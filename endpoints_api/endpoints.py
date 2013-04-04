from google.appengine.ext import endpoints
from protorpc import remote
from protorpc import message_types
#import messages as whosup_messages

from messages import FaceBookUserMessage, UserBalanceRequest, UserBalanceResponse, TransactionsRequest, TransactionsResponse, TransactionRequest, BalancesRequest, BalancesResponse, BalanceResponse, GroupsResponse, GroupsRequest, GroupRequest, GroupResponse
from models import User, Transaction, SubTransaction, Tag, TagTransaction, TagUser

import decimal
import logging


CLIENT_ID = 'whoUp'
FACEBOOK_APP_ID = "191611900970322"
FACEBOOK_APP_SECRET = "f1318e612bead81dd6808b10974f3379"

dthandler = lambda obj: int(obj) if isinstance(obj, decimal.Decimal) else obj


@endpoints.api(name='whosup', version='v1',
               description='API for whosup !',
               allowed_client_ids=[CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID])
class WhosupApi(remote.Service):
    @endpoints.method(UserBalanceRequest,
                      UserBalanceResponse,
                      name='balance',
                      path="balance",
                      http_method="GET"
                      )
    def get_user_balance(self, request):
        user = get_or_create_user(request.user)

        balance = user.balance()

        if balance and balance.count() > 0:
            balance = int(balance[0].balance)
        else:
            balance = 0

        return UserBalanceResponse(balance=balance)

    @endpoints.method(TransactionsRequest,
                      TransactionsResponse,
                      name='transactions.list',
                      path="transactions",
                      http_method="GET"
                      )
    def get_transactions(self, request):
        return TransactionsResponse()

    @endpoints.method(TransactionRequest,
                      message_types.VoidMessage,
                      name='transaction.insert',
                      path="transaction",
                      http_method="POST"
                      )
    def save_transaction(self, request):
        user = get_or_create_user(request.payer)

        transaction = Transaction.create(
            title=request.title,
            payer=user
        )

        if hasattr(request, "tags") and len(request.tags) > 0:
            for tag in request.tags:
                tag = Tag.get_or_create(
                    title=tag.title,
                    id=tag.id
                )

                TagTransaction.create(
                    tag=tag,
                    transaction=transaction
                )

        for sub_transaction in request.subTransactions:
            sub_user = get_or_create_user(sub_transaction.borrower)

            SubTransaction.create(
                borrower=sub_user,
                transaction=transaction,
                amount=sub_transaction.amount
            )

        return message_types.VoidMessage()

    @endpoints.method(BalancesRequest,
                      BalancesResponse,
                      name='groupbalances.list',
                      path="groupbalances",
                      http_method="GET"
                      )
    def get_group_balances(self, request):
        user = get_or_create_user(request.user)

        tag_balances = user.tag_balances()

        if tag_balances.count() > 0:
            logging.info("TAG BALANCES FOUND !! weee :)")

            for balance in tag_balances:
                logging.info(balance.balance)

            tag_balances = [
                BalanceResponse(
                    payer=FaceBookUserMessage(id=1),
                    borrower=FaceBookUserMessage(id=2),
                    balance=int(balance.balance)
                )
                for balance in tag_balances
            ]
        else:
            tag_balances = []

        logging.info(tag_balances)

        return BalancesResponse(group_balances=tag_balances)

    @endpoints.method(BalancesRequest,
                      BalancesResponse,
                      name='userbalances.list',
                      path="userbalances",
                      http_method="GET"
                      )
    def get_user_balances(self, request):
        user = get_or_create_user(request.user)

        user_balances = user.balance_against()

        if user_balances.count() > 0:
            for balance in user_balances:

                logging.info("balance %s: %s-%s = %s" % (balance.first_name, balance.balance_against, balance.balance, balance.balance_against or 0 - balance.balance or 0))

            user_balances = [
                BalanceResponse(
                    payer=request.user,
                    borrower=FaceBookUserMessage(id=int(balance.facebook_id), first_name=balance.first_name, last_name=balance.last_name),
                    balance=int(balance.balance)
                )
                for balance in user_balances
            ]
        else:
            user_balances = []

        return BalancesResponse(balances=user_balances)

    @endpoints.method(GroupsRequest,
                      GroupsResponse,
                      name='groups.list',
                      path="groups",
                      http_method="GET"
                      )
    def get_groups(self, request):
        groups = []
        return GroupsResponse(groups=groups)

    @endpoints.method(GroupRequest,
                      GroupResponse,
                      name='group',
                      path="group",
                      http_method="GET"
                      )
    def get_group(self, request):
        group = Tag.get(Tag.id == request.group_id)

        group_members = group.members()

        members = []

        for member in group_members:
            members.append(
                FaceBookUserMessage(
                    first_name=member.first_name,
                    last_name=member.last_name,
                    facebook_id=member.facebook_id,
                    id=member.facebook_id
                )
            )

        return GroupResponse(group_id=group.id, title=group.title, members=members)

    @endpoints.method(GroupResponse,
                      GroupResponse,
                      name='group.insert',
                      path="group",
                      http_method="POST"
                      )
    def save_group(self, request):
        tag = Tag.create(
            title=request.title
        )

        for member in request.members:
            member_user = get_or_create_user(member)

            TagUser.get_or_create(
                tag=tag,
                user=member_user
            )

        request.group_id = tag.id
        return request


def get_or_create_user(user):
    if hasattr(user, "facebook_id") and user.facebook_id != user.id:
        user.id = user.facebook_id

    user = User.get(User.facebook_id == user.id)

    if not user:
        user = User.create(
            facebook_id=user.id,
            name=user.name or "",
            first_name=user.first_name or "",
            last_name=user.last_name or "",
            middle_name=user.middle_name or "",
            link=user.link or "",
            username=user.username or "",
            gender=user.gender or "",
            email=user.email or "",
            locale=user.locale or ""
        )

    return user


APPLICATION = endpoints.api_server([WhosupApi], restricted=False)

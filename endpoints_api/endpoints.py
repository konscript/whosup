from google.appengine.ext import endpoints
from protorpc import remote
from protorpc import message_types
import messages as whosup_messages
from google.appengine.api import rdbms

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
    @endpoints.method(whosup_messages.UserBalanceRequest,
                      whosup_messages.UserBalanceResponse,
                      name='balance',
                      path="balance",
                      http_method="GET"
                      )
    def get_user_balance(self, request):
        user = User.get_or_create(
            facebook_id=request.id,
            first_name=request.first_name,
            last_name=request.last_name,
            middle_name=request.middle_name,
            link=request.link,
            username=request.username,
            gender=request.gender,
            email=request.email,
            locale=request.locale
        )

        balance = user.balance()

        if balance and balance.count() > 0:
            balance = int(balance[0].balance)
        else:
            balance = 0

        return whosup_messages.UserBalanceResponse(balance=balance)

    @endpoints.method(whosup_messages.TransactionsRequest,
                      whosup_messages.TransactionsResponse,
                      name='transactions.list',
                      path="transactions",
                      http_method="GET"
                      )
    def get_transactions(self, request):
        return whosup_messages.TransactionsResponse()

    @endpoints.method(whosup_messages.TransactionRequest,
                      message_types.VoidMessage,
                      name='transaction.insert',
                      path="transaction",
                      http_method="POST"
                      )
    def save_transaction(self, request):
        user = User.get_or_create(
            facebook_id=request.payer.id,
            first_name=request.payer.first_name,
            last_name=request.payer.last_name,
            middle_name=request.payer.middle_name,
            link=request.payer.link,
            username=request.payer.username,
            gender=request.payer.gender,
            email=request.payer.email,
            locale=request.payer.locale
        )

        transaction = Transaction.create(
            title=request.title,
            payer=user
        )

        if request.tags and len(request.tags) > 0:
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
            borrower_name = sub_transaction.borrower_name.split(" ")

            sub_user = User.get_or_create(
                first_name=borrower_name[0],
                last_name=borrower_name[1],
                facebook_id=sub_transaction.borrower_id
            )

            SubTransaction.create(
                borrower=sub_user,
                transaction=transaction,
                amount=sub_transaction.amount
            )

        return message_types.VoidMessage()

    @endpoints.method(whosup_messages.BalancesRequest,
                      whosup_messages.BalancesResponse,
                      name='groupbalances.list',
                      path="groupbalances",
                      http_method="GET"
                      )
    def get_group_balances(self, request):
        user = User.get_or_create(
            facebook_id=request.id,
            first_name=request.first_name,
            last_name=request.last_name,
            middle_name=request.middle_name,
            link=request.link,
            username=request.username,
            gender=request.gender,
            email=request.email,
            locale=request.locale
        )

        tag_balances = user.tag_balances()

        if len(tag_balances.count()) > 0:
            tag_balances = [
                whosup_messages.BalanceResponse(
                    payer_id=balance["user_id"],
                    borrower_id=balance["group_id"],
                    balance=balance["balance"]
                )
                for balance in tag_balances
            ]
        else:
            tag_balances = []

        return whosup_messages.BalancesResponse(group_balances=tag_balances)

    @endpoints.method(whosup_messages.BalancesRequest,
                      whosup_messages.BalancesResponse,
                      name='userbalances.list',
                      path="userbalances",
                      http_method="GET"
                      )
    def get_user_balances(self, request):

        conn = rdbms.connect(instance="", database='whosup')
        balances = []
        cursor = conn.cursor()

        #Get balances
        cursor.execute("SELECT * FROM balances WHERE payer_id='%s' OR borrower_id='%s'" % (request.user_id, request.user_id))

        for row in cursor.fetchall():
            balance = {}
            for index, column in enumerate(row):
                balance[cursor.description[index][0]] = (int(column) if not isinstance(column, basestring) else column.decode("latin-1")) if column else None
            balances.append(balance)

        conn.close()

        balances = [whosup_messages.BalanceResponse(payer_id=balance["payer_id"], borrower_id=balance["borrower_id"], balance=balance["balance"]) for balance in balances]

        return whosup_messages.BalancesResponse(balances=balances)

    @endpoints.method(whosup_messages.GroupsRequest,
                      whosup_messages.GroupsResponse,
                      name='groups.list',
                      path="groups",
                      http_method="GET"
                      )
    def get_groups(self, request):
        groups = []
        return whosup_messages.GroupsResponse(groups=groups)

    @endpoints.method(whosup_messages.GroupRequest,
                      whosup_messages.GroupResponse,
                      name='group',
                      path="group",
                      http_method="GET"
                      )
    def get_group(self, request):
        group = Tag.select(id=request.group_id)

        members = []

        for member in group.members():
            members.append(
                whosup_messages.UserResponse(
                    user_id=member.facebook_id,
                    email=member.email or "",
                    first_name=member.first_name,
                    last_name=member.last_name
                )
            )

        return whosup_messages.GroupResponse(group_id=1, title="test", members=[])

    @endpoints.method(whosup_messages.GroupResponse,
                      whosup_messages.GroupResponse,
                      name='group.insert',
                      path="group",
                      http_method="POST"
                      )
    def save_group(self, request):
        tag = Tag.create(request.title)

        for member in request.members:
            member_user = User.get_or_create(
                first_name=member.first_name,
                last_name=member.last_name,
                facebook_id=member.user_id
            )

            TagUser.get_or_create(
                tag=tag,
                user=member_user
            )
        return request


APPLICATION = endpoints.api_server([WhosupApi], restricted=False)

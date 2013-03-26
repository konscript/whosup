import os

os.environ['DJANGO_SETTINGS_MODULE'] = "whosup.settings"

from google.appengine.ext import endpoints
from protorpc import remote
from protorpc import message_types
import messages as whosup_messages
from google.appengine.api import rdbms
from django.db.models import Q

from whosup.models import Transaction, SubTransaction, GroupTransaction
from django.contrib.auth.models import User

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
    def get_user_balance(self, user):
        #user_dj = User.objects.get(id=user.user_id)

        # if not user_dj:
        #     user_dj = User.objects.get(id=user.user_id)
        #test = SubTransaction.objects.filter(Q(payer=user.user_id) | Q(borrower=user.user_id)).aggregate(Sum('amount')).select_related()
        #logging.info(user_dj)
        return whosup_messages.UserBalanceResponse(balance=200)

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
    def save_transaction(self, transaction):
        transaction_dj = Transaction.objects.create(title=transaction.title, payer=User(id=transaction.payer_id))

        if transaction.group:
            GroupTransaction.objects.create(group=transaction.group)

        for sub_transaction in transaction.subTransactions:
            SubTransaction.objects.create(transaction=transaction_dj, borrower=User(id=sub_transaction.borrower_id))

        # # Note that the only format string supported is %s
        # cursor.execute('INSERT INTO transactions (title, total_amount) VALUES (%s, %s)', (transaction.title, transaction.total_amount))
        # cursor.execute('SELECT LAST_INSERT_ID()')
        # row = cursor.fetchone()
        # info_id = row[0]
        # tags = []
        # user_id = transaction.payer_id

        # for sub_transaction in transaction.subTransactions:
        #     tag_ids = []
        #     if len(tags) > 0:
        #         for tag in tags:
        #             cursor.execute("SELECT * FROM tag WHERE tag='%s' AND user='%s'" % (tag, user_id))
        #             row = cursor.fetchone()
        #             if not row:
        #                 cursor.execute('INSERT INTO tag (tag, user) VALUES (%s, %s)', (tag, user_id))
        #                 cursor.execute('SELECT LAST_INSERT_ID()')
        #                 row = cursor.fetchone()
        #             tag = row[0]
        #             tag_ids.append(tag)
        #     cursor.execute('INSERT INTO subtransactions (payer_id, borrower_id, amount, transaction_id) VALUES (%s, %s, %s, %s)', (transaction.payer_id, sub_transaction.borrower_id, int(sub_transaction.amount), int(info_id)))
        #     cursor.execute('SELECT LAST_INSERT_ID()')
        #     row = cursor.fetchone()
        #     trans_id = row[0]
        #     for tag_id in tag_ids:
        #         cursor.execute('INSERT INTO transaction_tag (tagid, transid) VALUES (%s, %s)', (tag_id, trans_id))
        # conn.commit()
        # conn.close()

        return message_types.VoidMessage()

    @endpoints.method(whosup_messages.BalancesRequest,
                      whosup_messages.BalancesResponse,
                      name='balances.list',
                      path="balances",
                      http_method="GET"
                      )
    def get_all_balances(self, request):

        conn = rdbms.connect(instance="", database='whosup')
        balances = []
        group_balances = []
        cursor = conn.cursor()

        #Get group_balances
        cursor.execute("SELECT SUM(balance) as balance, group_id FROM group_balances WHERE user_id='%s' ORDER BY group_id" % (request.user_id))

        for row in cursor.fetchall():
            group_balance = {}
            for index, column in enumerate(row):
                group_balance[cursor.description[index][0]] = (int(column) if not isinstance(column, basestring) else column.decode("latin-1")) if column else None
            group_balances.append(group_balance)

        #Get balances
        cursor.execute("SELECT * FROM balances WHERE payer_id='%s' OR borrower_id='%s'" % (request.user_id, request.user_id))

        for row in cursor.fetchall():
            balance = {}
            for index, column in enumerate(row):
                balance[cursor.description[index][0]] = (int(column) if not isinstance(column, basestring) else column.decode("latin-1")) if column else None
            balances.append(balance)

        conn.close()

        balances = [whosup_messages.BalanceResponse(payer_id=balance["payer_id"], borrower_id=balance["borrower_id"], balance=balance["balance"]) for balance in balances]
        group_balance_messages = []

        #Build groups
        for balance in group_balances:
            #If groups exists
            if balance["group_id"]:
                cursor.execute("SELECT * FROM group WHERE id='%s'" % (balance["group_id"]))
                group_dict = {}
                group_row = cursor.fetchone()
                for index, column in enumerate(group_row):
                    group_dict[cursor.description[index][0]] = (int(column) if not isinstance(column, basestring) else column.decode("latin-1")) if column else None
                group = whosup_messages.GroupResponse(title=group_dict["title"], balance=balance["balance"], members=[])

            #If empty group
            else:
                group = whosup_messages.GroupResponse(title="Empty", balance=balance["balance"], members=[])

            group_balance_messages.append(whosup_messages.GroupBalanceResponse(group=group, balance=balance["balance"]))

        return whosup_messages.BalancesResponse(balances=balances, group_balances=group_balance_messages)

    @endpoints.method(whosup_messages.BalancesRequest,
                      whosup_messages.BalancesResponse,
                      name='groupbalances.list',
                      path="groupbalances",
                      http_method="GET"
                      )
    def get_group_balances(self, request):

        conn = rdbms.connect(instance="", database='whosup')
        group_balances = []
        cursor = conn.cursor()

        #Get group_balances
        cursor.execute("SELECT * FROM group_balances WHERE user_id='%s'" % (request.user_id))

        for row in cursor.fetchall():
            group_balance = {}
            for index, column in enumerate(row):
                group_balance[cursor.description[index][0]] = (int(column) if not isinstance(column, basestring) else column.decode("latin-1")) if column else None
            group_balances.append(group_balance)

        conn.close()

        group_balances = [whosup_messages.BalanceResponse(payer_id=balance["user_id"], borrower_id=balance["group_id"], balance=balance["balance"]) for balance in group_balances]

        return whosup_messages.BalancesResponse(group_balances=group_balances)

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
        conn = rdbms.connect(instance="", database='whosup')
        groups = []

        cursor = conn.cursor()

        #Get group_balances
        cursor.execute("SELECT * FROM groups a INNER JOIN groups_users b ON a.id = b.group_id WHERE b.user_id='%s'" % (request.user_id))

        for row in cursor.fetchall():
            group = {}
            for index, column in enumerate(row):
                group[cursor.description[index][0]] = (int(column) if column else column) if not isinstance(column, str) else column.decode('latin-1')
            groups.append(whosup_messages.GroupResponse(title=group["title"]))

        conn.close()

        return whosup_messages.GroupsResponse(groups=groups)

    @endpoints.method(whosup_messages.GroupRequest,
                      whosup_messages.GroupResponse,
                      name='group',
                      path="group",
                      http_method="GET"
                      )
    def get_group(self, group):
        conn = rdbms.connect(instance="", database='whosup')

        cursor = conn.cursor()

        members = []

        logging.info(group.group_id)

        #Get group_balances
        cursor.execute("SELECT * FROM groups WHERE id='%s'" % (group.group_id))

        logging.info("diller1")

        group_dict = {}
        group_row = cursor.fetchone()

        logging.info(group_row)
        for index, column in enumerate(group_row):
            group_dict[cursor.description[index][0]] = (int(column) if column else column) if not isinstance(column, str) else column.decode('latin-1')

        logging.info("diller2")

        cursor.execute("SELECT * FROM users a INNER JOIN groups_users b ON a.id = b.user_id WHERE b.group_id='%s'" % (group.group_id))

        for row in cursor.fetchall():
            member = {}
            for index, column in enumerate(row):
                member[cursor.description[index][0]] = (int(column) if column else column) if not isinstance(column, str) else column.decode('latin-1')
            members.append(whosup_messages.UserResponse(user_id=member["id"] or 0,
                                                        email=member["email"] or "",
                                                        first_name=member["first_name"],
                                                        last_name=member["last_name"]
                                                        )
                           )

        logging.info("diller3")

        conn.close()

        return whosup_messages.GroupResponse(group_id=group.group_id, title=group_dict["title"], members=members)

    @endpoints.method(whosup_messages.GroupResponse,
                      whosup_messages.GroupResponse,
                      name='group.insert',
                      path="group",
                      http_method="POST"
                      )
    def save_group(self, group):
        conn = rdbms.connect(instance="", database='whosup')
        cursor = conn.cursor()
        # Note that the only format string supported is %s
        cursor.execute('INSERT INTO groups (title) VALUES (%s)', (group.title))
        cursor.execute('SELECT LAST_INSERT_ID()')
        row = cursor.fetchone()
        group_id = row[0]

        for member in group.members:
            cursor.execute("SELECT * FROM users WHERE id='%s'" % (member.user_id))
            user_row = cursor.fetchone()
            if not user_row:
                cursor.execute('INSERT INTO users (facebook_id, first_name, last_name, email) VALUES (%s, %s, %s, %s)', (member.user_id, member.first_name, member.last_name, member.email))

            cursor.execute('INSERT INTO groups_users (group_id, user_id) VALUES (%s, %s)', (group_id, member.user_id))

        conn.commit()
        conn.close()

        group.group_id = group_id
        return group


APPLICATION = endpoints.api_server([WhosupApi], restricted=False)

from google.appengine.ext import endpoints
from protorpc import remote
import messages as whosup_messages
from google.appengine.api import rdbms
import decimal
import logging


CLIENT_ID = 'YOUR-CLIENT-ID'
FACEBOOK_APP_ID = "191611900970322"
FACEBOOK_APP_SECRET = "f1318e612bead81dd6808b10974f3379"

dthandler = lambda obj: int(obj) if isinstance(obj, decimal.Decimal) else obj


@endpoints.api(name='whosup', version='v1',
               description='API for whosup !',
               allowed_client_ids=[CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID])
class WhosupApi(remote.Service):
    @endpoints.method(whosup_messages.TransactionsRequest, whosup_messages.TransactionsResponse, name='transactions.list', path="transactions", http_method="GET")
    def get_transactions(self, request):
        return whosup_messages.TransactionsResponse()

    @endpoints.method(whosup_messages.TransactionRequest, whosup_messages.TransactionRequest, name='transaction.insert', path="transaction", http_method="POST")
    def save_transaction(self, request):
        return whosup_messages.TransactionRequest()

    @endpoints.method(whosup_messages.BalancesRequest, whosup_messages.BalancesResponse, name='balances.list', path="balances", http_method="GET")
    def get_balances(self, request):

        conn = rdbms.connect(instance="", database='whosup')
        balances = []
        group_balances = []
        cursor = conn.cursor()

        #Get group_balances
        cursor.execute("SELECT * FROM group_balances WHERE user_id='%s'" % (request.user_id))

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
        group_balances = [whosup_messages.BalanceResponse(payer_id=balance["user_id"], borrower_id=balance["group_id"], balance=balance["balance"]) for balance in group_balances]

        return whosup_messages.BalancesResponse(balances=balances, group_balances=group_balances)

    @endpoints.method(whosup_messages.GroupsRequest, whosup_messages.GroupsResponse, name='groups.list', path="groups", http_method="GET")
    def get_groups(self, request):
        conn = rdbms.connect(instance="", database='whosup')
        groups = []

        cursor = conn.cursor()

        #Get group_balances
        cursor.execute("SELECT * FROM groups a NATURAL JOIN user_in_group b WHERE b.user_id='%s'" % (request.user_id))

        for row in cursor.fetchall():
            group = {}
            for index, column in enumerate(row):
                group[cursor.description[index][0]] = int(column) if not isinstance(column, str) else column.decode('latin-1')
            groups.append(group)

        conn.close()

        return whosup_messages.GroupsResponse()

    @endpoints.method(whosup_messages.TransactionRequest, whosup_messages.TransactionRequest, name='groups.insert', path="groups", http_method="POST")
    def save_group(self, request):
        return whosup_messages.TransactionRequest()


APPLICATION = endpoints.api_server([WhosupApi],
                                   restricted=False)

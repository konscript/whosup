from google.appengine.ext import endpoints
from protorpc import remote
import messages as whosup_messages


@endpoints.api(name='whosup', version='v1', description='API for whosup !')
class WhosupApi(remote.Service):
    @endpoints.method(whosup_messages.TransactionsRequest, whosup_messages.TransactionsResponse, name='transactions.list', path="transactions", http_method="GET")
    def get_transactions(self, request):
        pass

    @endpoints.method(whosup_messages.TransactionRequest, whosup_messages.TransactionRequest, name='transaction.insert', path="transaction", http_method="POST")
    def save_transaction(self, request):
        pass

    @endpoints.method(whosup_messages.BalancesRequest, whosup_messages.BalancesResponse, name='transactions.list', path="transactions", http_method="GET")
    def get_balances(self, request):
        pass

    @endpoints.method(whosup_messages.GroupsRequest, whosup_messages.GroupsResponse, name='groups.list', path="groups", http_method="GET")
    def get_groups(self, request):
        pass

    @endpoints.method(whosup_messages.TransactionRequest, whosup_messages.TransactionRequest, name='groups.insert', path="groups", http_method="POST")
    def save_group(self, request):
        pass


APPLICATION = endpoints.api_server([WhosupApi],
                                   restricted=False)

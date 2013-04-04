from protorpc import messages


class FaceBookUserMessage(messages.Message):
    id = messages.IntegerField(1, required=True)
    name = messages.StringField(2)
    first_name = messages.StringField(3)
    last_name = messages.StringField(4)
    middle_name = messages.StringField(5)
    link = messages.StringField(6)
    username = messages.StringField(7)
    gender = messages.StringField(8)
    email = messages.StringField(9)
    locale = messages.StringField(10)
    verified = messages.BooleanField(11)


class UserBalanceRequest(messages.Message):
    user = messages.MessageField(FaceBookUserMessage, 1)


class UserBalanceResponse(messages.Message):
    balance = messages.IntegerField(1, required=True)


class SubTransaction(messages.Message):
    borrower = messages.MessageField(FaceBookUserMessage, 1)
    amount = messages.IntegerField(2, required=True)


class TransactionRequest(messages.Message):
    title = messages.StringField(1, required=True)
    payer = messages.MessageField(FaceBookUserMessage, 2, required=True)
    group = messages.IntegerField(3)
    total_amount = messages.IntegerField(4, required=True)
    subTransactions = messages.MessageField(SubTransaction, 5, repeated=True)


class TransactionsRequest(messages.Message):
    payer = messages.MessageField(FaceBookUserMessage, 1)
    group_id = messages.IntegerField(2)


class TransactionsResponse(messages.Message):
    transactions = messages.MessageField(TransactionRequest, 1, repeated=True)


class BalancesRequest(messages.Message):
    user = messages.MessageField(FaceBookUserMessage, 1)
    group_id = messages.IntegerField(2)


class BalanceResponse(messages.Message):
    payer = messages.MessageField(FaceBookUserMessage, 1)
    borrower = messages.MessageField(FaceBookUserMessage, 2)
    balance = messages.IntegerField(3)


class GroupsRequest(messages.Message):
    user = messages.MessageField(FaceBookUserMessage, 1)


class GroupUsers(messages.Message):
    users = messages.MessageField(FaceBookUserMessage, 1, repeated=True)


class GroupRequest(messages.Message):
    group_id = messages.IntegerField(1)


class GroupResponse(messages.Message):
    group_id = messages.IntegerField(1)
    title = messages.StringField(2)
    members = messages.MessageField(FaceBookUserMessage, 3, repeated=True)


class GroupsResponse(messages.Message):
    groups = messages.MessageField(GroupResponse, 1, repeated=True)


class GroupBalanceResponse(messages.Message):
    group = messages.MessageField(GroupResponse, 1)
    balance = messages.IntegerField(2)


class BalancesResponse(messages.Message):
    balances = messages.MessageField(BalanceResponse, 1, repeated=True)
    group_balances = messages.MessageField(GroupBalanceResponse, 2, repeated=True)

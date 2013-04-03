from protorpc import messages


class UserBalanceRequest(messages.Message):
    id = messages.IntegerField(1, required=True)
    first_name = messages.StringField(2)
    last_name = messages.StringField(3)
    middle_name = messages.StringField(4)
    link = messages.StringField(5)
    username = messages.StringField(6)
    gender = messages.StringField(7)
    email = messages.StringField(8)
    locale = messages.StringField(9)
    verified = messages.BooleanField(10)


class UserBalanceResponse(messages.Message):
    balance = messages.IntegerField(1, required=True)


class SubTransaction(messages.Message):
    borrower_id = messages.IntegerField(1, required=True)
    borrower_name = messages.StringField(2, required=True)
    amount = messages.IntegerField(3, required=True)


class TransactionRequest(messages.Message):
    title = messages.StringField(1, required=True)
    payer = messages.MessageField(UserBalanceRequest, 2, required=True)
    group = messages.IntegerField(3)
    total_amount = messages.IntegerField(4, required=True)
    subTransactions = messages.MessageField(SubTransaction, 5, repeated=True)


class TransactionsRequest(messages.Message):
    payer_id = messages.IntegerField(1, required=True)
    group_id = messages.IntegerField(2)


class TransactionsResponse(messages.Message):
    transactions = messages.MessageField(TransactionRequest, 1, repeated=True)


class BalancesRequest(messages.Message):
    user_id = messages.IntegerField(1, required=True)
    group_id = messages.IntegerField(2)


class BalanceResponse(messages.Message):
    payer_id = messages.IntegerField(1)
    borrower_id = messages.IntegerField(2)
    balance = messages.IntegerField(3)


class UserRequest(messages.Message):
    total_balance = messages.IntegerField(1)
    facebook_id = messages.IntegerField(2)


class UserResponse(messages.Message):
    user_id = messages.IntegerField(1, required=True)
    email = messages.StringField(2)
    facebook_id = messages.IntegerField(3)
    first_name = messages.StringField(4)
    last_name = messages.StringField(5)
    total_balance = messages.IntegerField(6)


class GroupsRequest(messages.Message):
    user_id = messages.IntegerField(1)


class GroupUsers(messages.Message):
    users = messages.MessageField(UserResponse, 1, repeated=True)


class GroupRequest(messages.Message):
    group_id = messages.IntegerField(1)


class GroupResponse(messages.Message):
    group_id = messages.IntegerField(1)
    title = messages.StringField(2)
    members = messages.MessageField(UserResponse, 3, repeated=True)


class GroupsResponse(messages.Message):
    groups = messages.MessageField(GroupResponse, 1, repeated=True)


class GroupBalanceResponse(messages.Message):
    group = messages.MessageField(GroupResponse, 1)
    balance = messages.IntegerField(2)


class BalancesResponse(messages.Message):
    balances = messages.MessageField(BalanceResponse, 1, repeated=True)
    group_balances = messages.MessageField(GroupBalanceResponse, 2, repeated=True)

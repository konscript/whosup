/* Controllers */

function BalancesCtrl($scope, $rootScope, UserBalances, facebookConnect) {

    // make sure we're logged in via facebook and have user info available
    $rootScope.$watch("facebookInit", function(fbReady){
        if(fbReady){
            facebookConnect.me(function(facebookUser){

                 UserBalances.get({id: facebookUser.id}, function(data){
                    // iterate through and set class whether balance is in minus or plus
                    $.each(data.balances, function(index, value) {
                        if (value.balance > 0) {
                            value.klass = "amount-plus";
                        } else if (value.balance === 0) {
                            value.klass = "amount-zero";
                        } else {
                            value.klass = "amount-minus";
                        }
                    });
                    $scope.data = data;
                 });
            });
        }
    });
}

function GroupBalancesCtrl($scope, $routeParams, GroupBalances) {
     var balances = GroupBalances.get({id: $routeParams.id}, function(data){

        // iterate through and set class whether balance is in minus or plus
        $.each(balances.balances, function(index, value) {
            if (value.balance > 0) {
                value.klass = "amount-plus";
            } else if (value.balance === 0) {
                value.klass = "amount-zero";
            } else {
                value.klass = "amount-minus";
            }
        });

        $scope.data = balances;
     });
}

function NewCtrl($scope, $location, $rootScope, $routeParams, Transactions, facebookConnect, Groups) {

    $scope.availableUsers = [];
    $scope.groups = [];

    $scope.transaction = {
        title: "",
        total_amount: "",
        group_id: undefined,
        payer_id: "",
        subTransactions: []
    };

    // new transaction for a group
    if ($routeParams.groupController !== undefined) {
        $scope.transaction.group_id = $routeParams.id;
        Groups.get({listController: "getUsers", itemController: $routeParams.id},function(data){
            $.each(data.users, function(index, value) {
                $scope.transaction.subTransactions.push({
                    value: value.id,
                    label: value.first_name + ' ' + value.last_name
                });
            });
        });
    }

    $rootScope.$watch("facebookInit", function(fbReady){
        if(fbReady){
            facebookConnect.getFriends(function(tokens){
                $scope.availableUsers = tokens.data.map(function(token){
                    return {
                        value: token.id,
                        label: token.name
                    };
                });
                $scope.$apply();
            });
            facebookConnect.me(function(user){
                $scope.transaction.payer_id = user.id;
                $scope.transaction.subTransactions.push({
                    value: user.id,
                    label: user.first_name + ' ' + user.last_name
                });
            });
        }
    });

    $scope.updateAmounts = function(){
        var restAmount = $scope.transaction.total_amount;
        var subTransactionsWithoutAmount = [];

        $.each($scope.transaction.subTransactions, function(index, subTransaction) {
            if(subTransaction.amount){
                restAmount -= subTransaction.amount;
            }else{
                subTransactionsWithoutAmount.push(subTransaction);
            }
        });

        var splitAmount = restAmount/subTransactionsWithoutAmount.length;

        $.each(subTransactionsWithoutAmount, function(index, subTransaction) {
            subTransaction.split_amount = splitAmount;
        });
    };

    $scope.newTransaction = function() {
        $.each($scope.transaction.subTransactions, function(index, subTransaction) {
            if(subTransaction.amount){
                // Hmm nothing to do here really
            }else{
                subTransaction.amount = subTransaction.split_amount;
                delete subTransaction.split_amount;
            }
        });
        Transactions.save($scope.transaction);
        $location.path( "/main" );
    };

    $scope.removeSubTransaction = function(userId) {
        $.each($scope.transaction.subTransactions, function(index, subTransaction){
            if (subTransaction.value === userId) {
                $scope.transaction.subTransactions.splice(index, 1);
            }
        });
        $scope.updateAmounts();
    };
}

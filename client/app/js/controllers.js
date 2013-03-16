/* Controllers */

function BalancesCtrl($scope, $rootScope, facebookConnect) {

    // make sure we're logged in via facebook and have user info available
    $rootScope.$watch('[facebookInit, endpointsInit]',
        function(ready){
            if(ready[0] && ready[1]){
                facebookConnect.me(function(facebookUser){
                    gapi.client.whosup.balances.list({user_id: facebookUser.id}).execute(function(data){
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
                        $.each(data.group_balances, function(index, value) {
                            if (value.balance > 0) {
                                value.klass = "amount-plus";
                            } else if (value.balance === 0) {
                                value.klass = "amount-zero";
                            } else {
                                value.klass = "amount-minus";
                            }
                        });
                        $scope.balances = data.balances;
                        $scope.groupBalances = data.group_balances;
                        $scope.$apply();
                    });
                });
            }
        },
        true
    );
}

function GroupBalancesCtrl($scope, $routeParams) {
    $scope.balances = [];
    gapi.client.whosup.group_balances.list({id: $routeParams.id}).execute(function(response){
        console.log(response);
        // iterate through and set class whether balance is in minus or plus
        $.each(response.groupbalances, function(index, value) {
            if (value.balance > 0) {
                value.klass = "amount-plus";
            } else if (value.balance === 0) {
                value.klass = "amount-zero";
            } else {
                value.klass = "amount-minus";
            }
        });

        $scope.balances = response;
    });
}

function NewCtrl($scope, $location, $rootScope, $routeParams, facebookConnect) {

    $scope.availableUsers = [];
    $scope.groups = [];

    $scope.transaction = {
        title: "",
        total_amount: "",
        group_id: undefined,
        payer_id: "",
        subTransactions: []
    };

    $rootScope.$watch("endpointsInit", function(endpointsRead){
        // new transaction for a group
        if ($routeParams.groupController !== undefined) {
            $scope.transaction.group_id = $routeParams.id;
            Groups.get({listController: "getUsers", itemController: $routeParams.id},function(data){
                $.each(data.users, function(index, user) {
                    $scope.transaction.subTransactions.push({
                        borrower_id: user.id,
                        borrower_name: user.first_name + ' ' + user.last_name
                    });
                });
            });
        }
    });

    $rootScope.$watch("facebookInit", function(fbReady){
        console.log(fbReady);
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
                    borrower_id: user.id,
                    borrower_name: user.first_name + ' ' + user.last_name
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
                subTransaction.amount = Math.floor(subTransaction.amount * 100);
                // Hmm nothing to do here really
            }else{
                subTransaction.amount = Math.floor(subTransaction.split_amount * 100);
                delete subTransaction.split_amount;
            }
        });
        gapi.client.whosup.transaction.insert($scope.transaction).execute(function(response){
            console.log(response);
        });
        //$location.path( "/main" );
    };

    $scope.removeSubTransaction = function(userId) {
        $.each($scope.transaction.subTransactions, function(index, subTransaction){
            if (subTransaction.value === userId) {
                $scope.transaction.subTransactions.splice(index, 1);
            }
        });
        $scope.updateAmounts();
    };

    $scope.addUser = function(item){
        $scope.transaction.subTransactions.push({
            borrower_id: ui.item.value,
            borrower_name: ui.item.label
        });
        $scope.updateAmounts();
        $scope.$apply();
    };
}

function NewGroupCtrl($scope, $location, $rootScope, $routeParams, facebookConnect){
    $scope.availableUsers = [];
    $scope.group = {
        title: null,
        id: $routeParams.id,
        members: []
    };

    $rootScope.$watch("facebookInit", function(fbReady){
        console.log(fbReady);
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
                $scope.addUser({
                    value: user.id,
                    label: user.first_name + ' ' + user.last_name
                });
            });
        }
    });

    $scope.removeUser = function(userId) {
        $.each($scope.group.members, function(index, member){
            if (member.user_id === userId) {
                $scope.group.members.splice(index, 1);
            }
        });
    };

    $scope.addUser = function(item){
        $scope.group.members.push({
            user_id: item.value,
            user_name: item.label
        });
        $scope.$apply();
    };
}

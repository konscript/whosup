/* Controllers */

function BalanceCtrl($scope, $rootScope){
    //Set User Balance
    $scope.userBalance = 0;

    $rootScope.apisReady.then(function(promises){
        FB.api('/me', function(facebookUser){
            gapi.client.balancebot.balance({user: facebookUser}).execute(function(data){
                var balClass;
                if (data.result.balance > 0) {
                    balClass = "amount-plus";
                } else if (data.result.balance === 0) {
                    balClass = "amount-zero";
                } else {
                    balClass = "amount-minus";
                }
                $scope.userBalance = data.result.balance / 100;
                $scope.userBalanceClass = balClass;
                $scope.$apply();
            });
        });
    }, function(message){
        
    });
}

function BalancesCtrl($scope, $rootScope, facebookConnect) {

    // make sure we're logged in via facebook and have user info available
    $rootScope.apisReady.then(function(promises){
        facebookConnect.me(function(facebookUser){
            var rpcBatch = gapi.client.newRpcBatch();
            rpcBatch.add(gapi.client.balancebot.userbalances.list({user: facebookUser}), {
                callback:function(data){
                    
                    // iterate through and set class whether balance is in minus or plus
                    if(data.result.balances){
                        $.each(data.result.balances, function(index, value) {
                            if (value.balance > 0) {
                                value.klass = "amount-plus";
                            } else if (value.balance === 0) {
                                value.klass = "amount-zero";
                            } else {
                                value.klass = "amount-minus";
                            }
                        });
                        $scope.balances = data.result.balances;
                    }
                }
            });

            rpcBatch.execute(function(){
                $scope.$apply();
            });

            var rpcBatch2 = gapi.client.newRpcBatch();
            rpcBatch2.add(gapi.client.balancebot.groupbalances.list({user: facebookUser}), {
                callback:function(data){
                    
                    if(data.result.group_balances){
                        $.each(data.result.group_balances, function(index, value) {
                            if (value.balance > 0) {
                                value.klass = "amount-plus";
                            } else if (value.balance === 0) {
                                value.klass = "amount-zero";
                            } else {
                                value.klass = "amount-minus";
                            }
                        });
                        $scope.groupBalances = data.result.group_balances;
                    }
                }
            });

            rpcBatch2.execute(function(){
                $scope.$apply();
            });
        });
        });
}

function GroupBalancesCtrl($scope, $routeParams) {
    $scope.balances = [];
    gapi.client.balancebot.group_balances.list({id: $routeParams.id}).execute(function(data){
        
        // iterate through and set class whether balance is in minus or plus
        $.each(data.result.groupbalances, function(index, value) {
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
}

function NewTransactionCtrl($scope, $location, $rootScope, $routeParams, facebookConnect) {

    $scope.availableUsers = [];
    $scope.groups = [];

    //Initialize transaction
    $scope.transaction = {
        title: "",
        total_amount: "",
        group: undefined,
        payer: {},
        subTransactions: []
    };

    $rootScope.apisReady.then(function(promises){
        //Get facebook friends
        facebookConnect.getFriends(function(users){
            $scope.availableUsers = users;
            $scope.$apply();
        });

        //Get facebook profile
        facebookConnect.me(function(facebookUser){
            //Set payer id
            $scope.transaction.payer = facebookUser;

            //Automatically add user to transaction
            $scope.transaction.subTransactions.push({
                borrower: facebookUser
            });

            //Get users group
            gapi.client.balancebot.groupbalances.list({user: facebookUser}).execute(function(data){
                $scope.groups = data.result.group_balances;
                $scope.$apply();
            });
        });
    });

    //Updates the calculated amounts of people that splits the remainder
    $scope.updateAmounts = function(){
        var restAmount = $scope.transaction.total_amount;
        var subTransactionsWithoutAmount = [];

        //Calculate remainder
        $.each($scope.transaction.subTransactions, function(index, subTransaction) {
            if(subTransaction.amount){
                restAmount -= subTransaction.amount;
            }else{
                subTransactionsWithoutAmount.push(subTransaction);
            }
        });

        var splitAmount = restAmount/subTransactionsWithoutAmount.length;

        //Update splitting users with their part of the remainder
        $.each(subTransactionsWithoutAmount, function(index, subTransaction) {
            subTransaction.split_amount = splitAmount;
        });
    };

    //Save the transaction
    $scope.newTransaction = function() {
        $.each($scope.transaction.subTransactions, function(index, subTransaction) {
            if(subTransaction.amount){
                subTransaction.amount = Math.floor(subTransaction.amount * 100);
            }else{
                subTransaction.amount = Math.floor(subTransaction.split_amount * 100);
                delete subTransaction.split_amount;
            }
        });

        gapi.client.balancebot.transaction.insert($scope.transaction).execute(function(response){
            $location.path( "/main" );
            $scope.$apply();
        });
    };

    $scope.removeSubTransaction = function(userId) {
        $.each($scope.transaction.subTransactions, function(index, subTransaction){
            if (subTransaction.value === userId) {
                $scope.transaction.subTransactions.splice(index, 1);
            }
        });
        $scope.updateAmounts();
    };

    //Add e friend to sub transactions
    $scope.addUser = function(user){
        $scope.transaction.subTransactions.push({
            borrower: user
        });
        $scope.updateAmounts();
        $scope.$apply();
    };

    //Change group
    $scope.changeGroup = function(){
        
        if($scope.transaction.group){
            //Get users group
            gapi.client.balancebot.group({group_id: $scope.transaction.group.group.group_id}).execute(function(data){
                $scope.transaction.subTransactions = $.map(data.result.members, function(user){
                    return {
                        borrower: user
                    };
                });
                $scope.updateAmounts();
                $scope.$apply();
            });
        }else{
            $scope.transaction.subTransactions = [{borrower: $scope.transaction.payer}];
            $scope.updateAmounts();
            $scope.$apply();
        }
    };
}

function NewGroupCtrl($scope, $location, $rootScope, $routeParams, $q, facebookConnect){
    $scope.availableUsers = [];
    $scope.group = {
        title: null,
        group_id: null,
        members: []
    };

    $rootScope.apisReady.then(function(promises){

        //Get friends
        facebookConnect.getFriends(function(users){
            $scope.availableUsers = users;
        });

        //If group exists
        if($routeParams.id !== ""){
            gapi.client.balancebot.group({group_id: Number($routeParams.id)}).execute(function(data){
                $scope.group.group_id = data.result.id;
                $scope.group.title = data.result.title;
                $scope.$apply();
            });

        //If new group
        }else{
            facebookConnect.me(function(user){
                $scope.addUser(user);
            });
        }
    });

    $scope.removeUser = function(listMember) {
        $.each($scope.group.members, function(index, member){
            if (member.id === listMember.id) {
                $scope.group.members.splice(index, 1);
            }
        });
    };

    $scope.addUser = function(user){
        $scope.group.members.push(user);

    };

    $scope.newGroup = function() {
        gapi.client.balancebot.group.insert($scope.group).execute(function(data){
            $location.path( "/group/" + data.result.group_id );
            $scope.$apply();
        });
    };
}

/* Controllers */

function BalancesCtrl($scope, $rootScope, facebookConnect) {

    // make sure we're logged in via facebook and have user info available
    $rootScope.$watch('[facebookInit, endpointsInit]',
        function(ready){
            if(ready[0] && ready[1]){
                facebookConnect.me(function(facebookUser){
                    gapi.client.whosup.balances.list(facebookUser).execute(function(data){
                        console.log(facebookUser);
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
        }, true);
}

function GroupBalancesCtrl($scope, $routeParams) {
    $scope.balances = [];
    gapi.client.whosup.group_balances.list({id: $routeParams.id}).execute(function(data){
        console.log(data);
        // iterate through and set class whether balance is in minus or plus
        $.each(data.groupbalances, function(index, value) {
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

function NewCtrl($scope, $location, $rootScope, $routeParams, facebookConnect) {

    $scope.availableUsers = [];
    $scope.groups = [];

    //Initialize transaction
    $scope.transaction = {
        title: "",
        total_amount: "",
        group_id: undefined,
        payer_id: "",
        subTransactions: []
    };

    $rootScope.$watch("[facebookInit, endpointsInit]", function(ready){
        if(ready[0] && ready[1]){

            //Get facebook friends
            facebookConnect.getFriends(function(tokens){
                $scope.availableUsers = tokens.data.map(function(token){
                    return {
                        value: token.id,
                        label: token.name
                    };
                });
                $scope.$apply();
            });

            //Get facebook profile
            facebookConnect.me(function(user){
                //Set payer id
                $scope.transaction.payer = user;

                //Automatically add user to transaction
                $scope.transaction.subTransactions.push({
                    borrower_id: user.id,
                    borrower_name: user.first_name + ' ' + user.last_name
                });

                //Get users group
                gapi.client.whosup.groups.list({user_id: user.id}).execute(function(data){
                    $scope.groups = data.groups;
                    $scope.$apply();
                });
            });
        }
    }, true);

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
        gapi.client.whosup.transaction.insert($scope.transaction).execute(function(response){
            $location.path( "/main" );
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
    $scope.addUser = function(item){
        $scope.transaction.subTransactions.push({
            borrower_id: item.value,
            borrower_name: item.label
        });
        $scope.updateAmounts();
        $scope.$apply();
    };
}

function NewGroupCtrl($scope, $location, $rootScope, $routeParams, facebookConnect){
    $scope.availableUsers = [];
    $scope.group = {
        title: null,
        group_id: null,
        members: []
    };

    $rootScope.$watch("[facebookInit, endpointsInit]", function(ready){
        if(ready[0] && ready[1]){
            facebookConnect.getFriends(function(tokens){
                $scope.availableUsers = tokens.data.map(function(token){
                    return {
                        value: token.id,
                        label: token.name
                    };
                });
                $scope.$apply();
            });

            //If group exists
            if($routeParams.id !== ""){
                gapi.client.whosup.group({group_id: Number($routeParams.id)}).execute(function(data){
                    $scope.group.group_id = data.group_id;
                    $scope.group.title = data.title;
                    $.each(data.members, function(index, member){
                        member.user_name = member.first_name + " " + member.last_name;
                        $scope.group.members.push(member);
                    });
                    $scope.$apply();
                });

            //If new group
            }else{
                facebookConnect.me(function(user){
                    $scope.addUser({
                        value: user.id,
                        label: user.first_name + ' ' + user.last_name
                    });
                    $scope.$apply();
                });
            }

        }
    }, true);

    $scope.removeUser = function(userId) {
        $.each($scope.group.members, function(index, member){
            if (member.user_id === userId) {
                $scope.group.members.splice(index, 1);
            }
        });
    };

    $scope.addUser = function(item){
        var splitName = item.label.split(" ");
        $scope.group.members.push({
            user_id: item.value,
            first_name: splitName[0],
            last_name: splitName[1],
            user_name: item.label
        });

    };

    $scope.newGroup = function() {
        gapi.client.whosup.group.insert($scope.group).execute(function(data){
            console.log(data);
            $location.path( "/group/" + data.group_id );
            $scope.$apply();
        });
    };
}

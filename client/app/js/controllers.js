'use strict';

/* Controllers */

function BalancesCtrl($scope, UserBalances, facebookConnect) {

    //console.log("ME");
    //console.log(facebookConnect.me());

     var balances = UserBalances.get({id: 1}, function(data){

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

function NewCtrl($scope, $location, $rootScope, Transactions, facebookConnect) {


    $scope.availableUsers = [];
    $scope.selectedUid;

    $scope.transaction = {
        title: "",
        total_amount: "",
        subTransactions: []
    };

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
        }
    });


    $scope.newTransaction = function(transactions) {
        console.log(transactions);
        Transactions.save(transactions);
        $location.path( "/main" );
    };
}

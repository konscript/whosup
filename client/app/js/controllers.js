'use strict';

/* Controllers */

function BalancesCtrl($scope, Transactions) {
     $scope.transactions = Transactions.query();
}

function NewCtrl($scope, $location, $rootScope, Transactions, facebookConnect) {


    $scope.availableUsers = [];
    $scope.selectedUid;

    $scope.transaction = {
        title: "",
        total_amount: "",
        subTransactions: []
    };

    $scope.subTransactionUsers = [];

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

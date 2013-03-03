'use strict';

/* Controllers */

function BalancesCtrl($scope, Transactions) {
     $scope.transactions = Transactions.query();
}

function NewCtrl($scope, $location, Transactions, facebookConnect) {
    $scope.availableTags = [];
    $scope.selectedUid;

    $scope.subTransactionUsers = [];

    facebookConnect.getFriends(function(tokens){
        console.log(tokens);
        $scope.availableUsers = tokens.data.map(function(token){
            return {
                value: token.id,
                label: token.name
            };
        });
    });

    $scope.newTransaction = function(transaction) {
        Transactions.save(transaction);
        $location.path( "/main" );
    };
}

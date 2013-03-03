'use strict';

/* Controllers */

function BalancesCtrl($scope, UserBalances) {
     $scope.balances = UserBalances.get({itemController:1});
}

function NewCtrl($scope, $location, Transactions, facebookConnect) {
    $scope.availableTags = [];
    $scope.selectedUid;

    $scope.subTransactionUsers = [];

    facebookConnect.getFriends(function(tokens){
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

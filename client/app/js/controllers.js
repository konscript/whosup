'use strict';

/* Controllers */

function BalancesCtrl($scope, Transactions) {
     $scope.transactions = Transactions.query();
}
//BalancesCtrl.$inject = ['Transactions'];

function NewCtrl($scope, $location, Transactions) {
    $scope.newTransaction = function(transaction) {
        Transactions.save(transaction);
        $location.path( "/main" );
    };
}
//NewCtrl.$inject = ['Transactions'];

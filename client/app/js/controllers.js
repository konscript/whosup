'use strict';

/* Controllers */

function BalancesCtrl($scope, Transactions) {
     $scope.transactions = Transactions.getItems();
}
//BalancesCtrl.$inject = ['Transactions'];

function NewCtrl($scope, Transactions) {
    $scope.newTransaction = function() {
        Transactions.addItem({
            name: 'John',
            balance: -200
        });
    };
}
//NewCtrl.$inject = ['Transactions'];

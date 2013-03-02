'use strict';

/* Controllers */

function BalancesCtrl($scope, Transactions) {
    $scope.balances = Transactions.getItems();
    console.log("Pushing to view");
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

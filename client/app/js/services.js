'use strict';

/* Services */

app.factory('Transactions', function($resource) {
    var Transactions = $resource('/whosup/api/transactions.json');
    var Transaction = $resource('/whosup/api/transactions/:transaction_id.json');

    Transactions.getItem = function(index) {
        var transaction = Transaction.get({transaction_id: index}, function() {
            return transaction;
        });
    };

    Transactions.getItems = function() {
        console.log("getItems()");
        var transactions = Transactions.get(function() {
            console.log("Fetched from backend");
            return transactions["transactions"];
        });
    };
    Transactions.addItem = function(item) { list.push(item); };
    Transactions.removeItem = function(item) { list.splice(list.indexOf(item), 1); };
    Transactions.size = function() { return list.length; };

    return Transactions;
});

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('WhosUp.services', []).value('version', '0.1');

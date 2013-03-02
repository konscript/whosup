'use strict';

/* Services */

app.factory('Transactions', function() {

    var Transactions = {};
    var list = [{
        name: 'Visti',
        balance: -300
    }, {
        name: 'Mikkel',
        balance: -200
    }, {
        name: 'Jakob',
        balance: -400
    }];

    Transactions.getItem = function(index) { return list[index]; }
    Transactions.getItems = function() { return list; }
    Transactions.addItem = function(item) { list.push(item); }
    Transactions.removeItem = function(item) { list.splice(list.indexOf(item), 1) }
    Transactions.size = function() { return list.length; }

    return Transactions;
});

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('WhosUp.services', []).value('version', '0.1');

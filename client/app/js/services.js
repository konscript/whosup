'use strict';

/* Services */

app.factory('Transactions', function($resource) {
    return $resource(
        "/whosup/api/transactions/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        },
        {
            clear: {
                method: "POST",
                params: {
                    listController: "clear-all"
                }
            }
        }
    );
});

app.factory('Balances', function($resource) {
    return $resource(
        "/whosup/api/balances/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
});

app.factory('Users', function($resource) {
    return $resource(
        "/whosup/api/users/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
});

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('WhosUp.services', []).value('version', '0.1');

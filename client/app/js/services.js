'use strict';

/* Services */

angular.module('whosUp.services', [])
.factory('Transactions', function($resource) {
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
})
.factory('Balances', function($resource) {
    return $resource(
        "/whosup/api/balances/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
})
.factory('Users', function($resource) {
    return $resource(
        "/whosup/api/users/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
});

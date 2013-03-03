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
.factory('UserBalances', function($resource) {
    return $resource(
        "/whosup/api/users/balances/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
})
.factory('GroupBalances', function($resource) {
    return $resource(
        "/whosup/api/groups/balances/:listController:id/:itemController",
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
})
.factory('facebookConnect', function() {
        var facebookConnectService = {};
        var self = this;
        this.auth = null;

        facebookConnectService.getAuth = function(){
            return self.auth;
        };

        facebookConnectService.me = function(callback){
            FB.api('/me', function(response) {
                callback(response);
            });
        };

        facebookConnectService.logout = function(callback) {
            FB.logout(function(response) {
              if (response) {
                self.auth = null;
              } else {
                console.log('Facebook logout failed.', response);
              }
            });
        };

        facebookConnectService.login = function(callback) {
            FB.login(function(response) {
              if (response.authResponse) {
                self.auth = response.authResponse;
                console.log(self.auth);
                if(callback){
                    callback(response);
                }
              } else {
                console.log('Facebook login failed', response);
              }
            });
        };

        facebookConnectService.getFriends = function(callback) {
            if(self.friends){
                callback(self.friends);
            }else{
                FB.api('/me/friends', {}, function(response) {
                    if (!response || response.error) {
                        console.log("Error");
                    } else {
                        callback(response);
                    }
                });
            }
        };

        facebookConnectService.getFriend = function(friend_id, callback) {
            if(self.auth){
                FB.api('/' + friend_id, function(response) {
                    callback(response);
                });
            }
        };

        return facebookConnectService;
});

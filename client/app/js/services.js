
angular.module('whosUp.services', [])
.factory('WhosupApi', ['$rootScope', function(){
        return gapi.client.whosup;
    }
])
    // I start the login process in my page controller, and when a user is authorized:

    // myApi.setLoggedIn();
    // $scope.loggedIn= true;
    // $scope.$digest();

    // And then in any controller:

    // if ($scope.loggedIn)
    //      // use api if already logged in
    // else{

    // // Ideally i'd have liked to watch a service variable here, but despite injecting the service into my controller, i couldn't get a watch reference a service property to work
    // $scope.$watch('loggedIn', function(newValue, oldValue){
    //   if(newValue){
    //      // use api here immediately after login
    //   }
    // },true);
// })
.factory('Transactions', function() {
    return $resource(
        "http://api." + window.location.hostname + "/transactions/:listController:id/:itemController",
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
        "http://api." + window.location.hostname + "/users/balances/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
})
.factory('GroupBalances', function($resource) {
    return $resource(
        "http://api." + window.location.hostname + "/groups/balances/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
})
.factory('Users', function($resource) {
    return $resource(
        "http://api." + window.location.hostname + "/users/:listController:id/:itemController",
        {
            id: "@id",
            listController: "@listController",
            itemController: "@itemController"
        }
    );
})
.factory('Groups', function($resource) {
    return $resource(
        "http://api." + window.location.hostname + "/groups/:listController:id/:itemController",
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
            if(self.me){
                callback(self.me);
            }else{
                FB.api('/me', function(response) {
                    self.me = response;
                    callback(response);
                });
            }
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

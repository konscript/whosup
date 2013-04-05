angular.module('balancebot.services', [])
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
                        console.log(response.error);
                    } else {
                        self.friends = response.data;
                        callback(response.data);
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

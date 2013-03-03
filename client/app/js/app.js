'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: 'partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope) {
    $rootScope.facebookInit = false;
    window.fbAsyncInit = function() {
        FB.init({
          appId      : '191611900970322', // App ID
          //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
          status     : true, // check login status
          cookie     : true, // enable cookies to allow the server to access the session
          xfbml      : false  // parse XFBML
        });

        FB.login(function(response) {
          console.log(response);
          if (response.authResponse) {
            FB.api('/me', function(response) {
              console.log(response);
              console.log('Good to see you, ' + response.name + '.');
           });
            $rootScope.facebookInit = true;
            $rootScope.$apply();
         } else {
            console.log('User cancelled login or did not fully authorize.');
         }
       }, {scope: 'email, publish_checkins'});
    };
});


// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: 'partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.when('/group/:id', {templateUrl: 'partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.when('/group/', {templateUrl: 'partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope) {
    $rootScope.endpointsInit = false;
    $rootScope.facebookInit = false;
    $rootScope.userBalance = 0;

    FB.login(function(response) {
      if (response.authResponse) {
        // fbReady to true
        $rootScope.facebookInit = true;
        $rootScope.$apply();
     } else {
        console.log('User cancelled login or did not fully authorize.');
     }
   }, {scope: 'email, publish_checkins'});

    function callback(){
        $rootScope.endpointsInit = true;
        $rootScope.$apply();
    }

    gapi.client.load('whosup', 'v1', callback, 'http://' + window.location.host + ':8081/_ah/api');

    //Set overall user balance
    $rootScope.$watch('[facebookInit, endpointsInit]',
        function(ready){
            console.log(ready);
            if(ready[0] && ready[1]){
                FB.api('/me', function(facebookUser){
                    gapi.client.whosup.balance(facebookUser).execute(function(data){
                        var balClass;
                        if (data.balance > 0) {
                            balClass = "amount-plus";
                        } else if (data.balance === 0) {
                            balClass = "amount-zero";
                        } else {
                            balClass = "amount-minus";
                        }
                        $rootScope.userBalance = data.balance / 100;
                        $rootScope.userBalanceClass = balClass;
                        $rootScope.$apply();
                    });
                });
            }
        },
        true
    );
});

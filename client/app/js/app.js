
// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: 'partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope, Users) {
    $rootScope.endpointsInit = false;
    $rootScope.facebookInit = false;
    $rootScope.userBalance = 0;
    console.log("init");
    FB.login(function(response) {
      if (response.authResponse) {
        console.log("Diller");
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

    gapi.client.load('whosup', 'v1', callback, 'http://' + window.location.host + ':8080/_ah/api');
});

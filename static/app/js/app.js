
// Declare app level module which depends on filters, and services
var app = angular.module('balancebot', ['balancebot.filters', 'balancebot.services', 'balancebot.directives', 'devorprod']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: '/static/app/partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: '/static/app/partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: '/static/app/partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: '/static/app/partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/group/:id', {templateUrl: '/static/app/partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.when('/group/', {templateUrl: '/static/app/partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope, $q, devOrProd) {


    //Promise for facebook login
    function facebookPromise(){
        var facebookDeferred = $q.defer();

        //Login to facebook
        FB.login(function(response) {
            if (response.authResponse) {
                facebookDeferred.resolve("Logged in to facebook");
            } else {
                facebookDeferred.reject('User cancelled login or did not fully authorize.');
            }
            $rootScope.$apply();
        }, {scope: 'email, publish_checkins'});

        return facebookDeferred.promise;
    }

    //Promise for endpoints loaded
    function endpointsPromise(){
        var endpointsDeferred = $q.defer();

        //Load the api
        gapi.client.load('balancebot', 'v1', function(response){
            console.log(response);
            if(response && response.error){
                endpointsDeferred.reject("Endpoints failed: " + response.error.message);
            }else{
                endpointsDeferred.resolve("Endpoints loadet");
            }
            $rootScope.$apply();
        }, devOrProd === "dev" ? "http://" + window.location.host + "/_ah/api" : 'https://balancebot-eu.appspot.com/_ah/api');

        return endpointsDeferred.promise;
    }

    $rootScope.apisReady = $q.all([facebookPromise(), endpointsPromise()]);
});

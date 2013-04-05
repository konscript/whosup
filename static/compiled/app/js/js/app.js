
// Declare app level module which depends on filters, and services
var app = angular.module('balancebot', ['balancebot.filters', 'balancebot.services', 'balancebot.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: '/static/app/partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: '/static/app/partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: '/static/app/partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: '/static/app/partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/group/:id', {templateUrl: '/static/app/partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.when('/group/', {templateUrl: '/static/app/partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope, $q) {
    //Initialize facebook
    FB.init({
        appId      : '191611900970322', // App ID
        //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : false  // parse XFBML
    });

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
            
            if(response && response.error){
                endpointsDeferred.reject("Endpoints failed: " + response.error.message);
            }else{
                endpointsDeferred.resolve("Endpoints loadet");
            }
            $rootScope.$apply();
        }, 'https://balancebot-eu.appspot.com/_ah/api');

        return endpointsDeferred.promise;
    }

    $rootScope.apisReady = $q.all([facebookPromise(), endpointsPromise()]);
});

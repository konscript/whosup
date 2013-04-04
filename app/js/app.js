
// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: 'partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: 'partials/new.html', controller: NewTransactionCtrl});
    $routeProvider.when('/group/:id', {templateUrl: 'partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.when('/group/', {templateUrl: 'partials/new_group.html', controller: NewGroupCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope, $q) {
    //Set User Balance
    $rootScope.userBalance = 0;

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
        gapi.client.load('whosup', 'v1', function(response){
            console.log(response);
            if(response && response.error){
                endpointsDeferred.reject("Endpoints failed: " + response.error.message);
            }else{
                endpointsDeferred.resolve("Endpoints loadet");
            }
            $rootScope.$apply();
        }, 'http://' + window.location.host + ':8081/_ah/api');

        return endpointsDeferred.promise;
    }

    $rootScope.apisReady = $q.all([facebookPromise(), endpointsPromise()]);

    $rootScope.apisReady.then(function(promises){
        FB.api('/me', function(facebookUser){
            gapi.client.whosup.balance({user: facebookUser}).execute(function(data){
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
    }, function(message){
        console.log(message);
    });
});

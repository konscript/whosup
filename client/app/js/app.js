
// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/balances', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/group-balances/:id', {templateUrl: 'partials/group-balances.html', controller: GroupBalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.when('/new/:groupController/:id', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.otherwise({redirectTo: '/balances'});
}]);

app.run(function($rootScope, Users) {
    $rootScope.facebookInit = false;
    $rootScope.userBalance = 0;
    window.fbAsyncInit = function() {
        FB.init({
          appId      : '191611900970322', // App ID
          //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
          status     : true, // check login status
          cookie     : true, // enable cookies to allow the server to access the session
          xfbml      : false  // parse XFBML
        });

        FB.login(function(response) {
          if (response.authResponse) {

            // post user obj to backend
            FB.api('/me', function(user) {
              Users.save(user);

              Users.get({listController:'totalBalance', itemController:user.id}, function(data){

                // iterate through and set class whether balance is in minus or plus
                if (data.total_balance > 0) {
                    data.klass = "amount-plus";
                } else if (data.total_balance === 0) {
                    data.klass = "amount-zero";
                } else {
                    data.klass = "amount-minus";
                }

                $rootScope.userBalance = data.total_balance;
                $rootScope.userBalanceClass = data.klass;

                if(!$scope.$$phase) {
                  $rootScope.$apply();
                }
              });

            });

            // fbReady to true
            $rootScope.facebookInit = true;
            $rootScope.$apply();
         } else {
            console.log('User cancelled login or did not fully authorize.');
         }
       }, {scope: 'email, publish_checkins'});
    };
});

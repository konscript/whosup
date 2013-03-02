'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('whosUp', ['whosUp.filters', 'whosUp.services', 'whosUp.directives', 'ngResource']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.otherwise({redirectTo: '/index'});
}]);

app.run(function($rootScope, facebookConnect) {
  $rootScope.facebookConnect = facebookConnect;
});

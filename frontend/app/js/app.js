'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('WhosUp', ['WhosUp.filters', 'WhosUp.services', 'WhosUp.directives', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'partials/balances.html', controller: BalancesCtrl});
    $routeProvider.when('/new', {templateUrl: 'partials/new.html', controller: NewCtrl});
    $routeProvider.otherwise({redirectTo: '/index'});
  }]);

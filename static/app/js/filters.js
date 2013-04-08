/* Filters */

angular.module('balancebot.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter('centsToDollars', function() {
        return function(input) {
            var out = input / 100;
            return out;
        };
});

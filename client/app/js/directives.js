'use strict';

/* Directives */


angular.module('WhosUp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

/* Directives */


angular.module('socialmoney.directives', [])
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
  }])
  .directive('autocomplete', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            scope.$watch(attrs.list, function(value) {
                $(element).autocomplete({
                    source: value,
                    focus:function (event, ui) {
                        element.val(ui.item.label);
                        return false;
                    },
                    select:function (event, ui) {
                        scope.selectedUid = ui.item.value;
                        scope.$apply;
                        return true;
                    },
                    change:function (event, ui) {
                        if (ui.item === null) {
                            scope.selectedUid = null;
                        }
                    }
                }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                    return $( "<li>" )
                    .append( "<a>" + item.label + "<br>" + item.value + "</a>" )
                    .appendTo( ul );
                };
            });
        }
    };
});

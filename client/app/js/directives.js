'use strict';

/* Directives */


angular.module('whosUp.directives', [])
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
                        event.preventDefault();
                        scope.transaction.subTransactions.push(ui.item);
                        element.val("");
                        scope.$apply();
                        return true;
                    },
                    change:function (event, ui) {
                        if (ui.item === null) {
                            scope.selectedUid = null;
                        }
                    }
                }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                    var image_url = "http://graph.facebook.com/" + item.value + "/picture";
                    return $('<li><a><img src="' + image_url + '" class="user-thumbnail"><span>' + item.label + '</span></a></li>').appendTo(ul);
                };
            });
        }
    };
});

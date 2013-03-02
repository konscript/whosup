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
                        scope.selectedUid = ui.item.label;
                        scope.facebookUi = ui.item.value;
                        scope.$apply;
                        return true;
                    },
                    change:function (event, ui) {
                        if (ui.item === null) {
                            scope.selectedUid = null;
                        }
                    }
                }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                    var image_url = "http://graph.facebook.com/" + item.value + "/picture";
                    return $('<li></li>').data("item.autocomplete", item).append($("<img>").attr('src', image_url)).append('<a>' + item.label + '</a>').appendTo(ul);
                };
            });
        }
    };
});

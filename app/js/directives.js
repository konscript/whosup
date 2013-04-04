/* Directives */


angular.module('whosUp.directives', [])
  .directive('autocomplete', function() {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {


            scope.$watch(attrs.list, function(friends) {
                $(element).autocomplete({
                    source: friends.map(function(friend){
                        friend.label = friend.name;
                        friend.value = friend.id;
                        return friend;
                    }),
                    focus:function (event, ui) {
                        element.val(ui.item.name);
                        return false;
                    },
                    select:function (event, ui) {
                        event.preventDefault();
                        scope.addUser(ui.item);
                        scope.$apply();
                        element.val("");
                        return true;
                    },
                    change:function (event, ui) {
                        if (ui.item === null) {
                            scope.selectedUid = null;
                        }
                    }
                }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                    var image_url = "http://graph.facebook.com/" + item.id + "/picture";
                    return $('<li><a><img src="' + image_url + '" class="user-thumbnail"><span>' + item.name + '</span></a></li>').appendTo(ul);
                };
            });
        }
    };
});

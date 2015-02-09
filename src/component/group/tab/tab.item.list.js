angular.module('admin.component')
    .directive('uiTabListItem', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab.list.item', $.extend({
                    tabRef: componentHelper.getComponentRef(element.parent(), '$tab')
                }, attrs));
            }
        };
    });

angular.module('admin.component')
    .directive('uiTabItem', function (uiTabItemFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var tabRef = componentHelper.getComponentRef($element.parent(), '$tab'),
                    uiTabItem = uiTabItemFactory($scope, $element, $attrs, $transclude($scope));
                $scope.$tabItem = uiTabItem;
                $scope[tabRef].addItem(uiTabItem);
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab.item', $.extend({
                    tabRef: componentHelper.getComponentRef(element.parent(), '$tab'),
                    index: element.index()
                }, attrs));
            }
        };
    });

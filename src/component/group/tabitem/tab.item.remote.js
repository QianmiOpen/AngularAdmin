angular.module('admin.component')
    .directive('uiTabRemoteItem', function (uiTabItemFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: function ($scope, $element, $attrs) {
                var tabRef = componentHelper.getComponentRef($element.parent(), '$tab'),
                    uiTabItem = uiTabItemFactory($scope, $element, $attrs);
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

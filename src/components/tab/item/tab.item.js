angular.module('admin.component')
    .directive('uiTabItem', function (UITabItemControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@',
                title: '@',
                url: '@'
            },
            link: ($scope, $element, $attrs, controller, $transclude) => {
                new UITabItemControl($scope, $element, $attrs, $transclude);
            },
            template: `
                <li ng-class="{'active': active}" title="{{title || head}}">
                    <a href="javascript:;" ng-click="component.clickHandler($event)">
                        <span>{{head}}</span>
                        <i class="fa fa-times" ng-click="component.removeHandler($event)"></i>
                    </a>
                </li>
            `
        };
    });

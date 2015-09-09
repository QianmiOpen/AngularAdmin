//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionTab', function (UITabControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                default: '@',
                lazy: '@'
            },
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs, controller, transclude) {
                        tab = new UITabControl(scope, element, attrs, transclude);
                    },
                    post: function () {
                        tab.build();
                    }
                };
            },
            template: `
                <ul class="nav nav-tabs portlet-tool-bar" ng-transclude>
                </ul>
            `
        };
    });




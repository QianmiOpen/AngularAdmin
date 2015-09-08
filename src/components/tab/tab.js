angular.module('admin.component')
    .directive('uiTab', function (UITabControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                close: '@',
                default: '@',
                url: '@'
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
                <div class="ui-tab tabbable-custom" ng-class="{'tabbable-close': close}">
                    <ul class="nav nav-tabs">
                    </ul>
                    <div class="tab-content" style="min-height: 100px;">
                    </div>
                </div>
            `
        };
    });

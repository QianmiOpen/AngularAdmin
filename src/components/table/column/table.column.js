//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableColumn', function (UITableColumnControl, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@'
            },
            compile: function (tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs) {
                        return new UITableColumnControl(scope, iElement, iAttrs, transclude);
                    }
                }
            },
            template: `
                <th>
                    {{head}}
                    <script type="text/ng-template" ng-transclude>
                    </scirpt>
                </th>'
            `
        };
    });
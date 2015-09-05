//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableColumn', function (UITableColumnControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                return new UITableColumnControl($scope, $element, $attrs, $transclude);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    });
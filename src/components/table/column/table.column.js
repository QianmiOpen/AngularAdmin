//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITableColumnHelper', (ValueService) => {
        return ($scope, $element, $attrs, attrName) => {
            let src = $element.attr(`${attrName}-bak`) || $element.attr(attrName);
            if (!$element.attr(`${attrName}-bak`)) {
                $attrs.$set(`${attrName}-bak`, src);
            }
            if ($scope.data && src) {
                let val = (src || '').replace(/\{\{([^\}]+)\}\}/g, function($0, $1){
                    return ValueService.get($scope, $1);
                });
                $element.prop(attrName.replace('ng-', ''), val);
            }
        };
    })
    .directive('a', function (UITableColumnHelper) {
        return {
            restrict: 'E',
            link: (scope, element, attrs) => {
                UITableColumnHelper(scope, element, attrs, 'ng-href');
            }
        };
    })
    .directive('img', function (UITableColumnHelper) {
        return {
            restrict: 'E',
            link: ($scope, $element, $attrs) => {
                UITableColumnHelper($scope, $element, $attrs, 'ng-src');
            }
        };
    })
    .directive('uiTableColumn', function (UITableColumnControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@',
                onRender: '&'
            },
            compile: function (tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs) {
                        return new UITableColumnControl(scope, iElement, iAttrs, transclude);
                    }
                };
            },
            template: `
                <th>
                    {{head}}
                    <script type="text/ng-template" ng-transclude>
                    </scirpt>
                </th>
            `
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTable', function (uiTableFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var uiTable = null;
                return {
                    pre: function (scope, element, attrs) {
                        var ref = attrs.ref || '$table';
                        uiTable = uiTableFactory(scope, element, attrs);
                        scope[ref] = uiTable;
                        componentHelper.tiggerComplete(scope, ref, uiTable);
                    },
                    post: function () {
                        uiTable.initTable();
                    }
                };
            },
            templateUrl: 'tpl.table'
        };
    });

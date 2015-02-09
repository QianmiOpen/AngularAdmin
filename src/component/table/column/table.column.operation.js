//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableOperationColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    render = function (rowData) {
                        var $doms = null;
                        $transclude($scope.$new(), function (c, s) {
                            s.data = rowData;
                            $doms = c;
                        });
                        return $doms;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].addColumn(uiTableColumnService(ref, $scope, $attrs, render));
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                attrs.head = attrs.head || '操作';
                return componentHelper.getTemplate('tpl.table.column', attrs);
            }
        };
    });
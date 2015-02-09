//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableDateColumn', function (uiTableColumnService, uiEditableDateInputFactory, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs, util) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    format = $attrs.format || 'yyyy-MM-dd HH:mm:ss',
                    name = $attrs.name,
                    render = function (rowData) {
                        var val = rowData[name];
                        if (val) {
                            val = util.dateFormatStr(val, format);
                        }
                        return $('<div/>').html(val);
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].addColumn(uiTableColumnService(ref, $scope, $attrs, render, uiEditableDateInputFactory));
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
            }
        };
    });
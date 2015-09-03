//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableImageColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('TableImageColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {

                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    placeholder = $attrs.placeholder || 'http://usr.im/110x30?text=What',
                    name = $attrs.name,
                    qiniu = $attrs.qiniu,
                    styleWidth = $attrs.imageWidth,
                    styleHeight = $attrs.imageHeight,
                    render = function (rowData) {
                        var val = rowData[name];
                        val = val !== undefined ? val : placeholder;
                        if(qiniu){
                            val = val + qiniu;
                        }
                        return $('<img/>').attr('src', val).css({width: styleWidth, height: styleHeight});
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
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
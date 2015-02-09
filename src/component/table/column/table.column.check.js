//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableCheckColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('tableCheckColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {
                $attrs.checked = true;
                var $dom = $element.find('input'),
                    ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    name = $attrs.name;

                //
                $dom.click(function (evt) {
                    var isChecked = evt.target.checked;
                    $scope[ref].selectAllHandler(isChecked, name);
                    evt.stopPropagation();
                });
                $scope.$on('uitable.selectAllChecked', function (evt, isAll) {
                    $dom[0].checked = isAll;
                    $.fn.uniform && $dom.uniform();
                });

                //
                var render = function (rowData) {

                    //判断之前是否被选过
                    var isContainValue = $scope[ref].containItem(rowData);
                    if (isContainValue) {
                        $scope[ref].pageSelectNum.push(true);
                    }
                    else{
                        $scope[ref].pageSelectNum.push(false);
                    }

                    //
                    $scope.$on('uitable.selectAll', function (evt, isAll) {
                        $dom[0].checked = isAll;
                        $.fn.uniform && $dom.uniform();
                    });

                    //
                    var $dom = $('<input type="checkbox"/>').val(rowData[name]).click(function (evt) {
                        $scope[ref].selectOneHandler(evt.target.checked, $attrs.name, rowData);
                        evt.stopPropagation();
                    });

                    //
                    $dom[0].checked = isContainValue;
                    return $dom;
                };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].addColumn(uiTableColumnService(ref, $scope, $attrs, render));
                    $scope[ref].idName = name;
                }
                else {
                    m.error('uiTableCheckColumn必须放在uiTable里面');
                }
            },
            templateUrl: 'tpl.table.column.checked'
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableStateColumn', function (uiTableColumnService, uiEditableChooseFactory, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    tpl = $attrs.tpl,
                    name = $attrs.name,
                    defaultValue = $attrs.default,
                    render = function (rowData) {
                        var val = rowData[name],
                            $dom = null;
                        if (tpl) {
                        }
                        else {
                            var $s = $scope.$new();
                            $s.data = rowData;
                            $transclude($s, function (clone) {
                                $dom = clone.filter('[state="' + val + '"]');
                                if ($dom.length === 0) { //用默认值
                                    $dom = clone.filter('[state="' + defaultValue + '"]');
                                }
                                if ($dom.length === 0) { //还没有...
                                    for (var i = 0, c; i < clone.length; i++) {
                                        c = clone[i];
                                        if (c.innerHTML && c.innerHTML.indexOf(defaultValue) != -1) {
                                            $dom = $(c);
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                        return $dom.length > 0 ? $dom : null;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    var choosableData = [];
                    $transclude().each(function (i, dom) {
                        var $dom = $(dom),
                            key = $dom.attr('state'),
                            val = $dom.html();
                        if (key && val) {
                            choosableData.push({value: key, text: val});
                        }
                    });
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render, uiEditableChooseFactory, choosableData), $attrs.index);
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
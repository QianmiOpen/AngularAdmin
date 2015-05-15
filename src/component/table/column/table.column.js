//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableColumn', function (uiTableColumnService, componentHelper, msg, $injector) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    hasTransclude = $transclude().length > 0,
                    name = $attrs.name || '',
                    render = function (rowData) {
                        if (hasTransclude) {
                            var $doms = null;
                            $transclude($scope.$new(), function (c, s) {
                                s.data = rowData;
                                $doms = c;
                            });
                            return $doms;
                        }
                        else {
                            var customRenderName = 'render' + name.charAt(0).toUpperCase() + name.substr(1),
                                v = rowData[name];
                            if ($scope[customRenderName]) {
                                return $scope[customRenderName](rowData);
                            }
                            return v != undefined ? $('<div/>').html(v) : v;
                        }
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    var editor = null;
                    if ($attrs.editable != undefined) {
                        var editorName = 'uiEditable' + $attrs.editable.charAt(0).toUpperCase() + $attrs.editable.substring(1) + 'Factory';
                        try {
                            editor = $injector.get(editorName);
                        }
                        catch (e) {
                            editor = $injector.get('uiEditableInputFactory');
                        }
                    }
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render, editor), $attrs.index);
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
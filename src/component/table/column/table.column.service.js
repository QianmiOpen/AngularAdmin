//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .filter('emptyFilter', function () {
        return function (val, defaultV) {
            return val || defaultV || '-';
        };
    })
    .factory('uiTableColumnService', function (msg) {
        var m = new msg('TableColumnService');
        return function (tableId, $scope, $attrs, render, editorFactory, editorConfig) {
            var columnConfig = {

                //自定义的属性
                sName: $attrs.name || '',
                mTitle: $attrs.head,
                bEditable: $attrs.editable,
                bChecked: $attrs.checked,
                mEditUrl: $attrs.editUrl,
                mAttrs: $attrs,

                //原生的属性
                sClass: $attrs.css || '',
                sWidth: $attrs.width || 'smart',
                bVisible: $attrs.novisible === undefined,
                bSortable: $attrs.sort !== undefined,
                mDataProp: function (aData, type) {
                    //
                    if (type != 'display') {
                        return '';
                    }
                    //datatable会调用两次，第一个获取数据，第二次用获取的数据，渲染数据....
                    if (arguments.length == 3) {
                        return arguments[2];
                    }
                    else {
                        var r = render ? render.apply(this, arguments) : aData[$attrs.name];

                        //针对字符串, 如果为空, 返回'-'
                        r = r != undefined ? r : '-'; //针对0或者false值
                        if (r != undefined && angular.isString(r)) {
                            r = $.trim(r);
                            r = r.length ? r : '-';
                            r = '<div>' + r + '</div>';
                        }

                        //
                        if ($attrs.editable != undefined) {
                            if (editorFactory) {
                                var edit = null,
                                    option = {
                                        url: $scope[tableId].editUrl,
                                        title: $attrs.head,
                                        pk: $scope[tableId].getIdByData(aData),
                                        name: $attrs.name,
                                        rule: $scope[tableId].getRuleByName($attrs.name),
                                        value: aData[$attrs.name]
                                    };
                                $scope.$on('uitable.editabled', function (evt, isEdit) {
                                    if (isEdit && edit) {
                                        edit.show();
                                    }
                                    else if (isEdit) {
                                        edit = editorFactory(r, $attrs, option, editorConfig);
                                    }
                                    else {
                                        edit.hide();
                                    }
                                });
                            }
                            else {
                                //m.error($attrs.name + '没有编辑器, 无法编辑');
                            }
                        }

                        //
                        return r;
                    }
                }
            };
            return columnConfig;
        };
    });
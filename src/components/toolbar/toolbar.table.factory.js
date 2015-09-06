//------------------------------------------------------
//
//
// 依赖 qm.table.js
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITableToolBarControl', function () {
        class UITableToolBarControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.table = null;
                this.message = new Message('UITableToolBar');
            }

            init() {
                this.transclude(this.scope, (dom) => {
                    this.element.find('.btn-group:eq(0)').append(dom);
                });
                this.scope.isShow = (index, column) => this._isShow(index, column);
                this.scope.toggleColumn = (evt, column) => this._toggleColumn(evt, column);
                this.triggerComplete(this.scope, this.attrs.ref || '$tableToolbar', this);
            }

            initEvents() {
                this.scope.$parent.$on('uitable.complete', (evt, uiTable) => {
                    this.scope.table = uiTable;
                });
            }

            _isShow(index, column) {
                if (column.className == 'CheckColumn' || column.className == 'OperationColumn') {
                    return false;
                }
                return true;
            }

            _toggleColumn(evt, column) {
                column.bVisible = !column.bVisible;
                this.scope.$parent.$broadcast('uitable.column.visable', column);
            }
        }
        return UITableToolBarControl;
    })
    .factory('uiTableToolBarFactory', function (msg, ajax, $injector) {
        var m = new msg('TableToolBar'),
            TableToolBar = function ($scope, tableId, $element, $attrs) {
                this.scope = $scope;
                this.element = $element;
                this.tableId = tableId;
                this.attrs = $attrs;
                this.blank = ',' + ($attrs.blank || '') + ',';
                this.isEdit = false;
                this.editText = '开启';
            };
        TableToolBar.prototype = {
            isShow: function (index, columnConfig) {
                return this.blank.indexOf(',' + index + ',') == -1 && !columnConfig.bChecked;
            },
            toggleColumn: function (evt, column) {
                column.bVisible = !column.bVisible;
                if (this.scope[this.tableId]) {
                    this.scope[this.tableId].instance.fnSetColumnVis(column.mIndex, column.bVisible, false);
                }
                evt.stopPropagation();
            },
            toggleEdit: function () {
                this.isEdit = !this.isEdit;
                this.editText = this.isEdit ? '关闭' : '开启';
                this.scope[this.tableId].toggleEdit(this.isEdit);
            },
            getHideBeforeIndex: function (index) {
                var css = this.instance.fnSettings().aoColumns;
                var num = 0;
                for (var i = 0; i < index; i++) {
                    if (css[i].bVisible)
                        num++;
                }
                return num;
            },
            doAddItem: function () {
                if (this.scope.addItem) {
                    this.scope.addItem();
                }
                else {
                    if (this.attrs.add) {
                        $injector.get('$state').go(this.attrs.add);
                    }
                    else {
                        m.error('点击添加数据按钮，但是没有设置地址, 请在add="地址"');
                    }
                }
            },
            doDelItem: function (values) {
                if (this.scope.delItem) {
                    this.scope.delItem(values);
                }
                else {
                    if (this.attrs.del) {
                        if (values.length > 1) {
                            ajax.remove(this.attrs.del, {ids: values.join(',')}).then(function () {
                                this.scope[this.tableId].refresh();
                            }.bind(this));
                        }
                        else {
                            ajax.remove(this.attrs.del + '/' + values[0]).then(function () {
                                this.scope[this.tableId].refresh();
                            }.bind(this));
                        }
                    }
                    else {
                        m.error('点击删除数据按钮，但是没有设置地址, 请在del="地址"');
                    }
                }
            }
        };
        return function ($scope, tableId, $element, $attrs) {
            return new TableToolBar($scope, tableId, $element, $attrs);
        };
    });
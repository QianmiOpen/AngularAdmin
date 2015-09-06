//------------------------------------------------------
//
//
// 依赖 qm.table.js
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITableToolBarControl', function ($state) {
        class UITableToolBarControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.table = null;
                this.isEdit = false;
                this.message = new Message('UITableToolBar');
                this.init();
                this.initEvents();
            }

            init() {
                this.transclude(this.scope, (dom) => {
                    this.element.find('.btn-group:eq(0)').append(dom);
                });
                this.scope.component = this;
                this.scope.editText = '开启';
                this.triggerComplete(this.scope, this.attrs.ref || '$tableToolbar', this);
            }

            initEvents() {
                this.scope.$parent.$on('uitable.complete', (evt, uiTable) => {
                    this.scope.table = uiTable;
                });
            }

            toggleEdit() {
                this.isEdit = !this.isEdit;
                this.scope.editText = this.isEdit ? '关闭' : '开启';
                this.scope.$parent.$broadcast('uitable.column.edit', this.isEdit);
            }

            doAddItem() {
                if (this.scope[this.attrs.add]) {
                    this.scope[this.attrs.add]();
                }
                else if (this.attrs.add && this.attrs.add.indexOf('/') != -1) {
                    if (this.attrs.addDialog) {
                        //TODO: 弹出框
                    }
                    else {
                        $state.go(this.attrs.add);
                    }
                }
                else {
                    this.message.error('点击添加数据按钮，但是没有设置地址, 请在add="地址"');
                }
            }

            doDelItems() {
                let table = this.scope.table,
                    selectValues = table.selectValues;
                if (this.scope[this.attrs.del]) {
                    this.scope[this.attrs.del](selectValues);
                }
                else {
                    if (this.attrs.del) {
                        if (selectValues.length > 1) {
                            ajax.remove(this.attrs.del, {ids: selectValues.join(',')}).then(() => {
                                table.refresh();
                            });
                        }
                        else {
                            ajax.remove(this.attrs.del + '/' + selectValues[0]).then(() => {
                                table.refresh();
                            });
                        }
                    }
                    else {
                        this.message.error('点击删除数据按钮，但是没有设置地址, 请在del="地址"');
                    }
                }
            }

            isShow(index, column) {
                if (column.className == 'CheckColumn' || column.className == 'OperationColumn') {
                    return false;
                }
                return true;
            }

            toggleColumn(evt, column) {
                column.bVisible = !column.bVisible;
                this.scope.$parent.$broadcast('uitable.column.visable', column);
            }
        }
        return UITableToolBarControl;
    });
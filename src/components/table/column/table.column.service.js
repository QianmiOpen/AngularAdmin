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
    .factory('UITableColumnControl', function (Message, $compile) {
        class UITableColumnControl extends ComponentEvent {
            constructor($scope, $element, $attrs, $transclude) {
                super();
                this.scope = $scope;
                this.element = $element;
                this.attrs = $attrs;
                this.transclude = $transclude;
                this.hasTransclude = $transclude && $transclude($scope).length > 0;
                this.className = this.className || 'Column';
                this.init();
                this.initEvents();
            }

            init() {
                this.message = new Message('UITable' + this.className);
                this.sName = this.attrs.name || '';
                this.mTitle = this.attrs.head;
                this.bEditable = this.attrs.editable;
                this.bChecked = this.attrs.checked;
                this.mEditUrl = this.attrs.editUrl;
                this.mAttrs = this.attrs;
                this.sClass = this.attrs.css || '';
                this.sWidth = this.attrs.width || 'smart';
                this.bVisible = this.attrs.novisible === undefined;
                this.bSortable = this.attrs.sort !== undefined;
                this.mDataProp = (rowData, type) => {
                    if (type != 'display') {
                        return '';
                    }
                    if (arguments.length == 3) {  //datatable会调用两次，第一个获取数据，第二次用获取的数据，渲染数据....
                        return arguments[2];
                    }
                    else {
                        let r = this.render(rowData, type);
                        let w = this.wrapperDisplay(r);
                        return w;
                    }
                };
                this.scope.$emit('uitable.column.complete', this);
            }

            initEvents() {
            }

            render(rowData) {
                if (this.hasTransclude) {
                    return this.getTransclude(rowData);
                }
                else if (this.scope.onRender && this.attrs.onRender){ //修复属性没有onRender也会进来
                    return this.scope.onRender({rowData: rowData});
                }
                else {
                    return this.getValue(rowData);
                }
            }

            getValue(rowData) {
                let name = this.sName, v;
                if (name && name.indexOf(".") != -1) {
                    let ns = name.split('.'), n;
                    v = rowData;
                    while ((n = ns.shift()) && v) {
                        v = v[n];
                    }
                }
                else if (name) {
                    v = rowData[name];
                }
                return v;
            }

            getTransclude(rowData) {
                let s = this.scope.$parent.$new(); //修复获取不到顶层controller的方法
                s.data = rowData;
                let $dom;
                this.transclude(s, (dom) => {
                    $dom = dom;
                });
                return $dom;
            }

            wrapperDisplay(r) {
                r = r !== undefined ? r : '-'; //针对0或者false值
                if (r !== undefined && angular.isString(r)) {
                    r = $.trim(r);
                    r = r.length ? r : '-';
                    r = '<div>' + r + '</div>';
                }
                return r;
            }
        }

        return UITableColumnControl;
    });
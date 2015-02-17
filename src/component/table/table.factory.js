//-----------------------------------------------------------------------------------------------
//
//
//  创建Table的委托对象, 目前使用datatable作为第三方库, 方法和其他差不多
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiTableFactory', function (uiTableDelegate, uiTableEditableFactory, util, logger, ajax, msg, Event) {
        var m = new msg('table'),
            Table = function (scope, element, attrs) {
                Event.call(this);
                this.columns = [];
                this.nopageMode = attrs.nopage !== undefined;
                this.idName = attrs.idName;
                this.pageResult = {};
                this.selectValues = [];
                this.selectItems = [];
                this.instance = null;
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.searchParams = null;
                this.pageSelectNum = [];
                uiTableEditableFactory.call(this);
            };

        Table.prototype = {

            /**
             * 初始化
             */
            initTable: function () {
                this.instance = uiTableDelegate(this, this.element, this.attrs, this.columns);
                this.element.on('click', 'tr', function (evt) {
                    //if(evt.target.nodeName == 'TR' || evt.target.nodeName == 'TD'){
                    //    var $tr = $(this);
                    //    $tr.find('td:eq(0) input[type="checkbox"]').click();
                    //    $tr.toggleClass('selected');
                    //}
                });
            },

            /**
             *
             */
            initEvnet: function () {
            },

            /**
             * 新增列
             * @param column
             */
            addColumn: function (column) {
                column.mIndex = this.columns.length;
                this.columns.push(column);
            },

            /**
             * 获取rowData
             * @param rowIndex
             * @returns {*}
             */
            getDataAtIndex: function (rowIndex) {
                return this.pageResult.aaData ? this.pageResult.aaData[rowIndex] : null;
            },

            /**
             * 获取rowData的id
             * @param rowIndex
             * @returns {*}
             */
            getIdByIndex: function (rowIndex) {
                var d = this.getDataAtIndex(rowIndex);
                return this.getIdByData(d);
            },

            /**
             *
             */
            getIdByData: function (d) {
                return d ? d[this.idName] : null;
            },

            /**
             * 是否包含该item
             */
            containItem: function (rowData) {
                var id = rowData[this.idName];
                for (var i = 0; i < this.selectValues.length; i++) {
                    if (this.selectValues[i] === id) {
                        return true;
                    }
                }
                return false;
            },

            /**
             *
             * @param columnIndex
             * @returns {Array}
             */
            getDomsByColumnIndex: function (columnIndex) {
                var doms = [];
                this.element.find('tr:gt(0)').each(function (index, tr) {
                    doms.push($('td', tr).eq(columnIndex));
                });
                return doms;
            },

            /**
             * 获取rowData的主键
             * @param rowIndex
             * @returns {*}
             */
            getIdByIndex: function (rowIndex) {
                var rowData = this.getDataAtIndex(rowIndex),
                    pk = rowData ? rowData[this.idName] : null;
                return pk;
            },

            /**
             * 预处理数据
             * @param result
             */
            beforeDataHandler: function (result) {
                this.pageResult = result;
                if (this.nopageMode) {
                    this.selectValues = [];
                    this.selectItems = [];
                }
                this.pageSelectNum = [];
                this.$emit('uitable.dataSuccess', result);
            },

            /**
             * 预处理完以后
             * @param result
             */
            afterDataHandler: function (result) {
                if ($.fn.uniform) {
                    this.element.find('input[type=checkbox]').uniform();
                }

                var sn = 0,
                    trs = this.element.find('tr:gt(0)');
                $.each(this.pageSelectNum, function (i, isSelect) {
                    if (isSelect) {
                        sn++;
                        //$(trs[i]).addClass('selected');
                    }
                });

                this.scope.$broadcast('uitable.selectAllChecked', this.pageResult.aaData&&sn == this.pageResult.aaData.length && sn != 0);
                this.$emit('uitable.renderSuccess', result);
            },

            /**
             * 数据获取报错
             * @param json
             */
            errorDataHandler: function (json) {
                this.$emit('uitable.dataFail', json);
            },

            /**
             * 刷新
             * @param params
             * @param url
             */
            refresh: function (params, url) {
                this.searchParams = params || this.searchParams;
                this.url = url || this.url;
                this.instance.fnPageChange(this.getCurrentPage() - 1);
                this.$emit('uitable.refreshData');
            },

            /**
             * 跳转
             * @param index
             */
            jumpTo: function (index) {
                if (/^\d+$/.test(index)) {
                    index = parseInt(index) - 1;
                }
                else if (index == undefined) {
                    index = this.getCurrentPage() - 1;
                }
                this.instance.fnPageChange(index != undefined ? Math.abs(index) : "first");
                this.$emit('uitable.refreshData');
            },

            /**
             * 获取当前页
             * @returns {null}
             */
            getCurrentPage: function () {
                var setting = this.instance.fnSettings();
                return Math.ceil(setting._iDisplayStart / setting._iDisplayLength) + 1;
            },

            /**
             * 查询, 设置条件, 返回第一页, 当查询的时候要去除所有选中的项目
             * @param params
             * @param url
             */
            search: function (params, url) {
                this.$emit('uitable.beforeSearch');
                this.selectItems = [];
                this.selectValues = [];
                this.searchParams = params || this.searchParams;
                this.url = url || this.url;
                this.jumpTo(1);
            },

            /**
             * 清空所有选中的行
             * @param isAll true是所有选中的包括跨页, false是当前页面所有选中的
             */
            cleanSelect: function (isAll) {
                if (isAll) {
                    this.selectItems = [];
                    this.selectValues = [];
                }
                else {
                    this.selectAllHandler(false);
                }
            },

            /**
             * 全选
             * @param isChecked
             * @param idName
             */
            selectAllHandler: function (isChecked, idName) {
                idName = idName || this.idName;
                var pageDatas = this.pageResult.aaData || [],
                    call = function () {
                        if (isChecked) {
                            //this.element.find('tr:gt(0)').addClass('selected');
                            this.selectItems = this.selectItems.concat($.grep(pageDatas, function (data) {
                                return !this.containItem(data);
                            }.bind(this)));
                        }
                        else {
                            //this.element.find('tr:gt(0)').removeClass('selected');
                            this.selectItems = $.grep(this.selectItems, function (item) {
                                for (var i = 0; i < pageDatas.length; i++) {
                                    if (pageDatas[i][this.idName] == item[this.idName]) {
                                        return false;
                                    }
                                }
                                return true;
                            }.bind(this));
                        }
                        this.selectValues = $.map(this.selectItems, function (selectItem) {
                            return selectItem[idName];
                        });
                        this.scope.$broadcast('uitable.selectAll', isChecked);
                    }.bind(this);
                if (!this.scope.$$phase) {
                    this.scope.$apply(call);
                }
                else {
                    call();
                }
            },

            /**
             * 单选
             * @param isChecked
             * @param idName
             * @param rowData
             */
            selectOneHandler: function (isChecked, idName, rowData) {
                idName = idName || this.idName;
                this.scope.$apply(function () {
                    if (isChecked) {
                        this.selectItems.push(rowData);
                        this.selectValues.push(rowData[idName]);
                    }
                    else {
                        for (var i = 0, item; item = this.selectItems[i]; i++) {
                            if (item[idName] == rowData[idName]) {
                                this.selectItems.splice(i, 1);
                                this.selectValues.splice(i, 1);
                                break;
                            }
                        }
                    }
                    this.scope.$broadcast('uitable.selectAllChecked', this.selectItems.length == this.pageResult.aaData.length && this.selectItems.length != 0);
                }.bind(this));
            },

            /**
             * 清空状态
             */
            cleanState: function () {
                if (this.attrs.stateKey) {
                    ajax.post('/dataTable/stateClean', {sStateKey: this.attrs.stateKey}).then(function () {
                        m.success("表格缓存信息更新成功！");
                        setTimeout('window.location.href = window.location.href;', 1000);
                    });
                } else {
                    m.error("该表格没有设置缓存！");
                }
            }
        };

        /**
         *
         */
        return function (scope, element, attrs) {
            return new Table(scope, element, attrs);
        };
    });
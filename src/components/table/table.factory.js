//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    let defaultConfig = {
            "bDestroy": true,
            "sDom": "<'table-scrollable't><'row ui-table-footer'<'col-md-3 col-sm-12'li>r<'col-md-7 col-sm-12'p>>",
            "bLengthChange": true,
            "bFilter": false,
            "bSort": true,
            "bAutoWidth": false,
            "bStateSave": true,
            "oLanguage": {
                "sProcessing": '<img src="http://7xi8np.com1.z0.glb.clouddn.com/assets/img/loading-spinner-grey.gif"/><span>&nbsp;&nbsp;正在查询.. .</span>',
                "sLengthMenu": "每页显示 _MENU_ 条",
                "sZeroRecords": "请选择条件后，点击搜索按钮开始搜索",
                "sInfo": "<label>当前第 _START_ - _END_ 条　共计 _TOTAL_ 条</label>",
                "sInfoEmpty": "没有符合条件的记录",
                "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
                "sSearch": "查询",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "尾页"
                }
            },
            "sPaginationType": "bootstrap_full_number",
            "aLengthMenu": [
                [10, 20, 30, 60],
                [10, 20, 30, 60]
            ],
            "bProcessing": true,
            "bServerSide": true
        },
        jumpTpl = `
            <div class="col-md-2">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="跳转页数">
                    <span class="input-group-btn">
                        <a href="javascript:;" class="btn green" style="font-size: 12px;">Go</a>
                    </span>
                </div>
            </div>
        `,
        dataName = 'aaData',
        totalName = 'iTotalRecords',
        requestMethod = 'post',
        pageSizeName = 'pageSize',
        pageNumberName = 'pageNo';

    angular.module('admin.component')
        .provider('UITableControl', function () {
            return {

                setConfig(_config) {
                    defaultConfig = $.extend(true, defaultConfig, _config);
                },

                setResultName(_dataName, _totalName) {
                    dataName = _dataName;
                    totalName = _totalName;
                },

                setRequestMethod(_requestMethod) {
                    requestMethod = _requestMethod;
                },

                setPageName(_pageSizeName, _pageNumberName) {
                    pageSizeName = _pageNumberName;
                    pageNumberName = _pageNumberName;
                },

                $get: function (Ajax, Message, Util, AdminCDN) {
                    class UITableControl extends ComponentEvent {
                        constructor(scope, element, attrs) {
                            super();
                            this.element = element;
                            this.scope = scope;
                            this.attrs = attrs;
                            this.message = new Message('UITable');
                        }

                        init() {
                            //
                            this.aoColumns = [];
                            this.bPaginate = this.attrs.nopage === undefined;
                            this.bInfo = this.bPaginate;
                            this.aaSorting = Util.toJSON(this.attrs.sort || '[]');
                            this.fnInitComplete = () => {
                                this._buildJumpDom();
                            };
                            this.fnServerData = (sSource, aoData, fnCallback) => {
                                setTimeout(() => {
                                    this._fetchData(sSource, aoData, fnCallback);
                                }, 100);
                            };

                            //
                            this.idName = this.attrs.idName;
                            this.pageResult = {};
                            this.pageResultData = [];
                            this.selectValues = [];
                            this.selectItems = [];
                            this.instance = null;
                            this.searchParams = [];
                            this.pageSelectNum = [];
                            this.triggerComplete(this.scope, this.attrs.ref || '$table', this);
                        }

                        initEvents() {
                            this.scope.$on('uitable.column.complete', (evt, column) => {
                                this.aoColumns.push(column);
                            });
                            this.scope.$on('uitable.column.idname', (evt, idName) => {
                                this.idName = idName;
                            });
                            this.scope.$on('uitable.column.selectall', (evt, isAll) => {
                                if (isAll) {
                                    this.selectItems = this.pageResultData;
                                    this.selectValues = this.selectItems.map((item) => item[this.idName]);
                                }
                                else {
                                    this.selectItems = [];
                                    this.selectValues = [];
                                }
                            });
                            this.scope.$on('uitable.column.selectone', (evt, obj) => {
                                if (obj.isCheck) {
                                    this.selectItems.push(obj.rowData);
                                    this.selectValues.push(obj.value);
                                }
                                else {
                                    let ii = _.indexOf(this.selectItems, obj.rowData);
                                    if (ii >= 0) {
                                        this.selectItems.splice(ii, 1);
                                        this.selectValues.splice(ii, 1);
                                    }
                                }
                            });
                            this.scope.$on('uitable.column.visable', (evt, column) => {
                                let i = _.indexOf(this.aoColumns, column);
                                this.instance.fnSetColumnVis(i, column.bVisible, false);
                            });
                        }

                        build() {
                            if ($.fn.dataTable) {
                                this._build();
                            }
                            else {
                                Ajax.getScript(`${AdminCDN}/assets/js/jquery.dataTables.min.js`)
                                    .then(() => this._build());
                            }
                        }

                        jumpTo(page) {
                            if (/^\d+$/.test(page)) {
                                page = parseInt(page) - 1;
                            }
                            else if (page === undefined) {
                                page = this.getCurrentPage() - 1;
                            }
                            this.instance.fnPageChange(page !== undefined ? Math.abs(page) : "first");
                            return this;
                        }

                        refresh(params, url) {
                            this.searchParams = params || this.searchParams;
                            this.url = url || this.url;
                            this.instance.fnPageChange(this.getCurrentPage() - 1);
                            return this;
                        }

                        search(params, url) {
                            this.selectItems = [];
                            this.selectValues = [];
                            this.searchParams = params || this.searchParams;
                            this.url = url || this.url;
                            this.jumpTo(1);
                        }

                        getCurrentPage() {
                            var setting = this.instance.fnSettings();
                            return Math.ceil(setting._iDisplayStart / setting._iDisplayLength) + 1;
                        }

                        selectAll(isSelected) {
                            this.scope.$broadcast('uitable.column.selectall', isSelected);
                        }

                        _build() {
                            this.instance = this.element.find('table').dataTable($.extend({}, defaultConfig, this));
                            this.scope.$emit('uitable.complete', this);
                        }

                        _fetchData(sSource, aoData, fnCallback) {
                            if ((!this.attrs.url && !this.url) || this.attrs.manual !== undefined) {
                                delete this.attrs.manual;
                                fnCallback({aaData: [], iTotalRecords: 0, iTotalDisplayRecords: 0});
                            }
                            else {
                                var url = this.url || this.attrs.url;
                                this._buildPageParam(aoData);
                                Ajax[requestMethod](url, aoData)
                                    .then((data) => {
                                        let result = this._buildPageResult(data);
                                        this._beforeDataHandler(result);
                                        fnCallback(result);
                                        this._afterDataHandler(result);
                                    })
                                    .catch((data) => {
                                        this._errorDataHandler(data);
                                    })
                                    .finally(() => {
                                    });
                            }
                        }

                        _beforeDataHandler(result) {
                            this.pageResult = result;
                            this.pageResultData = result.aaData;
                            if (this.bPaginate) {
                                this.selectItems = [];
                                this.selectValues = [];
                            }
                            this.scope.dataSuccess({result: result});
                        }

                        _afterDataHandler(result) {
                            this.element.find('input[type=checkbox]').uniform();
                        }

                        _errorDataHandler(result) {
                            this.scope.dateFail({result: result});
                        }

                        _buildPageResult(data) {
                            let result = {};
                            if ($.isArray(data)) {
                                result = {
                                    aaData: data,
                                    iTotalDisplayRecords: data.length,
                                    iTotalRecords: data.length
                                };
                            }
                            else {
                                result = {
                                    aaData: data[dataName],
                                    iTotalDisplayRecords: result[totalName],
                                    iTotalRecords: result[totalName]
                                };
                            }
                            return result;
                        }

                        _buildPageParam(searchParams) {
                            $.each(this.scope.initParams || {}, (name, value) => {
                                searchParams.push({name, value});
                            });
                            $.each(this.searchParams || {}, (name, value) => {
                                searchParams.push({name, value});
                            });
                            let start, size;
                            $.each(searchParams || {}, (name, value) => {
                                if (name == 'iDisplayStart') {
                                    start = value;
                                }
                                else if (name == 'iDisplayLength') {
                                    size = value;
                                }
                            });
                            searchParams.push({name: pageNumberName, value: start / size});
                            searchParams.push({name: pageSizeName, value: size});
                        }

                        _buildJumpDom() {
                            if (!this.bPaginate) {
                                return;
                            }
                            var $div = this.element.find('.ui-table-footer'),
                                $form = $(jumpTpl),
                                $btn = $form.find('a'),
                                $input = $form.find('input');
                            $div.append($form);
                            $btn.click(() => {
                                this.jumpTo($input.val());
                            });
                            $(document).keydown((evt) => {
                                if (evt.keyCode == 13) {
                                    this.refresh();
                                }
                            });
                        }
                    }

                    return UITableControl;
                }
            };
        });
})();
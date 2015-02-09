//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .provider('uiTableDelegate', function () {

        return {
            $get: function (util, ajax, logger) {
                return function (table, element, attrs, columns) {
                    var sStateKey = attrs.stateKey,  //属性state-key  需要唯一设计，每张表都要设置没有默认值，建议url以"_"分割，不要过长
                        sQuerySortStr = "", //查询出的排序字符串字段
                        instance = $(element.find('table')).dataTable({
                            "bDestroy": true,
                            "sDom": "<'table-scrollable't><'row'<'col-md-3 col-sm-12'li>r<'col-md-7 col-sm-12'p>>", // defaukt datatable without  horizobtal scroll
                            "bPaginate": attrs.nopage === undefined,
                            "bLengthChange": true,
                            "bFilter": false,
                            "bSort": true,
                            "bInfo": attrs.nopage === undefined,
                            "bAutoWidth": false,
                            "bStateSave": true,//保存条件等状态在cookie里
                            "aoColumns": columns,
                            "aaSorting": util.toJSON(attrs.sort || '[]'),
                            'fnInitComplete': function () {
                                if (attrs.nopage != undefined) {
                                    return;
                                }
                                try {
                                    var $div = this.parent().parent().find('div.row'),
                                        $form = $([
                                            '<div class="col-md-2">',
                                            '<div class="input-group">',
                                            '<input type="text" class="form-control" placeholder="跳转页数">',
                                            '<span class="input-group-btn">',
                                            '<a href="javascript:;" class="btn green" style="font-size: 12px;">Go</a>',
                                            '</span>',
                                            '</div>',
                                            '</div>'
                                        ].join('')),
                                        handler = function () {
                                            var val = $input.val();
                                            if (/\d+/.test(val)) {
                                                table.jumpTo(val);
                                            }
                                            else {
                                                $input.val('');
                                            }
                                        },
                                        $btn = $form.find('a'),
                                        $input = $form.find('input');
                                    //
                                    $div.append($form);

                                    //
                                    $btn.click(handler);
                                    $(document).keydown(function (evt) {
                                        if (evt.keyCode == 13) {
                                            handler();
                                        }
                                        evt.stopImmediatePropagation();
                                    });
                                }
                                catch (e) {
                                    logger.error(e);
                                }
                            },
                            "fnServerData": function (sSource, aoData, fnCallback) {
                                if (!attrs.url || attrs.manual != undefined) {
                                    delete attrs.manual;
                                    fnCallback({aaData: [], iTotalRecords: 0, iTotalDisplayRecords: 0});
                                    return;
                                }

                                //请求参数
                                var url = attrs.url;

                                //
                                if (table.searchParams) {
                                    var s = [];
                                    if ($.isArray(table.searchParams)) {
                                        s = table.searchParams;
                                    }
                                    else {
                                        $.each(table.searchParams, function (k, v) {
                                            s.push({name: k, value: v});
                                        });
                                    }
                                    aoData = aoData.concat(s);
                                }

                                //
                                ajax.post(url, aoData)
                                    .then(function (result) {
                                        table.beforeDataHandler(result);
                                        if ($.isArray(result)) {
                                            result = {
                                                aaData: result,
                                                iTotalDisplayRecords: result.length,
                                                iTotalRecords: result.length
                                            };
                                        }
                                        fnCallback(result);
                                        table.afterDataHandler(result);
                                    }, function (json) {
                                        table.errorHandleData(json);
                                    })
                                    .finally(function (json) {
                                        table.$emit('uitable.requestComplete');
                                    });
                            },
                            "fnStateLoadParams": function (oSettings, oData) {
                            },
                            "fnStateLoad": function (oSettings, oData) {
                                var r = undefined;
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    $.ajax({
                                        url: '/dataTable/stateLoad',
                                        data: {sStateKey: sStateKey},
                                        type: 'POST',
                                        dataType: 'json',
                                        cache: false,
                                        async: false,
                                        timeout: 1000,
                                        success: function (json) {
                                            if (json.result == 'ok' && json.data != null && json.data != '') {
                                                r = json.data;
                                                sQuerySortStr = r.aaSorting.toString() + r.abVisCols.toString() + r.iLength;
                                            }
                                        }
                                    });
                                }
                                return r;
                            },
                            "fnStateSaveParams": function (oSettings, oData) {
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    oData.sStateKey = sStateKey;
                                    oData.oSearch = "";
                                    oData.aoSearchCols = "";
                                    oData.iStart = 0;
                                }
                            },
                            "fnStateSave": function (oSettings, oData) {
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    var sNowSortStr = oData.aaSorting.toString() + oData.abVisCols.toString() + oData.iLength;
                                    if (sQuerySortStr != sNowSortStr) {
                                        ajax.post('/dataTable/stateSave', {data: JSON.stringify(oData)}).then(function () {
                                            sQuerySortStr = sNowSortStr;
                                        });
                                    }
                                }
                            },
                            "oLanguage": {
                                "sProcessing": '<img src="/static/img/loading-spinner-grey.gif"/><span>&nbsp;&nbsp;正在查询...</span>',
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
                        });
                    return instance;
                };
            }
        };
    });
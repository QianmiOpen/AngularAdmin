//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    let defaultConfig = {
        "bDestroy": true,
        "sDom": "<'table-scrollable't><'row'<'col-md-3 col-sm-12'li>r<'col-md-7 col-sm-12'p>>",
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
    };

    angular.module('admin.component')
        .provider('UITableControl', function () {
            return {

                setConfig(_config) {
                    defaultConfig = $.extend(true, defaultConfig, _config);
                },

                $get: function (Ajax, Message) {
                    class UITableControl extends ComponentEvent {
                        constructor(scope, element, attrs) {
                            super();
                            this.element = element;
                            this.scope = scope;
                            this.attrs = attrs;
                        }

                        init() {
                            this.columns = [];
                            this.nopageMode = this.attrs.nopage !== undefined;
                            this.idName = this.attrs.idName;
                            this.pageResult = {};
                            this.selectValues = [];
                            this.selectItems = [];
                            this.instance = null;
                            this.searchParams = null;
                            this.pageSelectNum = [];
                            this.triggerComplete(this.scope, this.attrs.ref || '$table', this);
                        }

                        build() {
                        }
                    }

                    return UITableControl;
                }
            };
        });
})();
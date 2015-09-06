//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTable', function (UITableControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                change: '&',  //选中的数据变动了
                jumpTo: '&', //点击跳转或者刷新
                dataSuccess: '&', //数据获取成功
                dateFail: '&', //数据获取失败
                initParams: '=' //查询参数
            },
            compile: function () {
                var uiTable = null;
                return {
                    pre: function (scope, element, attrs) {
                        uiTable = new UITableControl(scope, element, attrs);
                        uiTable.init();
                        uiTable.initEvents();
                    },
                    post: function () {
                        uiTable.build();
                    }
                };
            },
            template: `
                <div class="ui-table">
                    <table class="table table-striped table-bordered table-hover">
                        <thead>
                            <tr role="row" class="heading" ng-transclude>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>'
            `
        };
    });

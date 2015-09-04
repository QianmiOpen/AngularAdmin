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
            compile: function () {
                var uiTable = null;
                return {
                    pre: function (scope, element, attrs) {
                        uiTable = new UITableControl(scope, element, attrs);
                    },
                    post: function () {
                        uiTable.init();
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

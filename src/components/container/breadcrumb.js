//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('uiBreadcrumb', function (Util, Ajax) {

            class UIBreadcrumb extends Event {
                constructor(scope) {
                    this.scope = scope;
                    this.message = new Message('uiBreadcrumb');
                }

                init() {
                    if (this.scope.datas) {
                        this.handler(Util.toJSON(this.scope.datas));
                    }
                    else if (this.scope.url) {
                        Ajax.post(this.scope.url).then((datas) => this.handler(datas));
                    }
                    else {
                        this.message.error("至少设置datas或者url来配置面包屑");
                    }
                }

                handler(dataList) {
                    this.scope.items = (dataList || []).map((item) => {
                        return {name: item.name ? item.name : item, url: item.url ? item.url : ''};
                    });
                }
            }

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    datas: '@',
                    url: '@'
                },
                link: function (scope) {
                    new UIBreadcrumb(scope).init();
                },
                template: `
                    <div class="page-bar">
                        <ul class="page-breadcrumb">
                            <li ng-repeat="item in items">
                                <a ng-href="item.url" ng-bind="item.name"></a>
                                <i ng-if="!$last" class="fa fa-angle-right"></i>
                            </li>
                        </ul>
                    </div>
                `
            };
        });
})();
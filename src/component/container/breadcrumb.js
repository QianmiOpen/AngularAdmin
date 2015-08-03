//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class UIBreadcrumb extends Event {
        constructor(scope) {
            this.scope = scope;
            this.message = new Message('uiBreadcrumb');
            this.ajax = new Ajax();
        }

        init() {
            if (this.scope.datas) {
                this.handler(this.scope.datas);
            }
            else if (this.scope.url) {
                this.ajax.post(this.scope.url).then((datas) => this.handler(datas));
            }
            else {
                this.message.error("至少设置data或者url来配置面包屑");
            }
        }

        handler(dataList) {
            this.scope.items = (dataList || []).map((item) => {
                return {name: item.name ? item.name : item, url: item.url ? item.url : ''};
            });
        }
    }


    angular.module('admin.component')
        .directive('uiBreadcrumb', function () {
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
                                <i ng-if="!last" class="fa fa-angle-right"></li>
                            </li>
                        </ul>
                    </div>
                `
            };
        });
})();
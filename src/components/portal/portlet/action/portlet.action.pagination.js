//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionPagination', function (PaginationFactory) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var url = attrs.url,
                    pageIndex = attrs.pageIndex,
                    pageSize = attrs.pageSize,
                    pageLimit = attrs.pageLimit,
                    pageDataName = attrs.pageDataName,
                    pageTotalName = attrs.pageTotalName,
                    init = false,
                    paginationFactory = new PaginationFactory(url, pageIndex, pageSize, pageLimit, pageDataName, pageTotalName),
                    handler = function (r) {
                        $.extend(scope, r);
                    };

                //
                scope.setUrl = function (url) {
                    paginationFactory.url = url;
                };

                //
                scope.load = function (index) {
                    index--;
                    if (index != paginationFactory.pageIndex || !init) {
                        init = true;
                        paginationFactory.getPage(index).then(handler);
                    }
                };
                scope.loadFirst = function (isForce) {
                    if(!scope.isFirst || isForce){
                        paginationFactory.prePage().then(handler);
                    }
                };
                scope.loadLast = function (isForce) {
                    if(!scope.isLast || isForce){
                        paginationFactory.nextPage().then(handler);
                    }
                };

                //
                scope.load(1);
            },
            template: `
                <ul class="pagination pagination-circle portlet-tool-bar">
                    <li ng-class="{\'disabled\': isFirst}" ><a href="javascript:;" ng-click="loadFirst()"><i class="fa fa-angle-left"></i></a></li>
                    <li ng-repeat="page in pageList" ng-class="{\'active\': page.current}" ng-click="load(page.index)">
                        <a href="javascript:;" ng-bind="page.index"></a>
                    </li>
                    <li ng-class="{\'disabled\': isLast}" ><a href="javascript:;" ng-click="loadLast()"><i class="fa fa-angle-right"></i></a></li>
                </ul>
            `
        };
    });




angular.module('admin.component')
    .directive('uiSideBar', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                url: '@'
            },
            link: (s, e, a, c, t) => {
                $(document.body).addClass('page-sidebar-fixed');
            },
            template: `
                <div class="page-sidebar-wrapper">
                    <div class="page-sidebar navbar-collapse collapse">
                        <ul class="page-sidebar-menu hidden-sm hidden-xs" ng-transclude>
                        </ul>
                    </div>
                </div>
            `
        };
    });
angular.module('admin.component')
    .directive('uiPageHeader', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                logUrl: '@',
                logImage: '@',
                logoutUrl: '@'
            },
            link: (s, e, a, c, t) => {
                $(document.body).addClass('page-header-fixed');
            },
            template: `
                <div class="page-header navbar navbar-fixed-top">
                    <div class="page-header-inner">
                        <div class="page-logo">
                            <a ng-href="{{logUrl}}">
                                <img ng-src="{{logImage}}" alt="logo" class="logo-default">
                            </a>
                        </div>
                        <div class="hor-menu hor-menu-light hidden-sm hidden-xs">
                            <ul class="nav navbar-nav">
                            </ul>
                        </div>
                        <div class="top-menu">
                            <ul class="nav navbar-nav pull-right">
                                <li>
                                    <a ng-href="{{logoutUrl}}">
                                        <i class="icon-logout"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        };
    });
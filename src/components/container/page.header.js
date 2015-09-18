angular.module('admin.component')
    .directive('uiPageHeader', function (Ajax) {

        class UIPageHeaderControl extends ComponentEvent {
            constructor(scope, element, attrs) {
                super();
                this.scope = scope;
                this.element = element;
                this.init();
            }

            init() {
                this.leftContainer = this.element.find('.hor-menu ul');
                if (this.scope.leftMenuUrl) {
                    this._getContent(this.scope.leftMenuUrl)
                        .then((h) => {
                            this.leftContent = $(h);
                            this.leftContainer.append(this.leftContent);
                        });
                }
                this.rightContainer = this.element.find('.top-menu ul');
                if (this.scope.rightMenuUrl) {
                    this._getContent(this.scope.rightMenuUrl)
                        .then((h) => {
                            this.leftContent = $(h);
                            this.leftContainer.append(this.leftContent);
                        });
                }
            }

            _getContent(url) {
                return Ajax.load(url);
            }
        }


        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                logUrl: '@',
                logImage: '@',
                logCss: '@',
                logoutUrl: '@',

                leftMenuUrl: '@',
                rightMenuUrl: '@'
            },
            link: (s, e, a, c, t) => {
                $(document.body).addClass('page-header-fixed');
                if (s.leftMenuUrl) {
                }
                if (s.rightMenuUrl) {
                }
            },
            template: `
                <div class="page-header navbar navbar-fixed-top">
                    <div class="page-header-inner">
                        <div class="page-logo">
                            <a ng-href="{{logUrl}}">
                                <img ng-src="{{logImage}}" class="{{logCss}}">
                            </a>
                        </div>
                        <div class="hor-menu hidden-sm hidden-xs">
                            <ul class="nav navbar-nav" ng-transclude>
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
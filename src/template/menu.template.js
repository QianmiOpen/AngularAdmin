(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.menu', [
                '<div class="page-sidebar navbar-collapse collapse">',
                    '<ul class="page-sidebar-menu">',
                        '<ng-tranclude></ng-tranclude>',
                        '<li ng-class="{\'active open\': menuItem.active}" ng-click="onClickHandler(menuItem)" ng-repeat="menuItem in menuItems">',
                            '<a href="javascript:">',
                                '<i ng-class="menuItem.icon"></i>',
                                '<span class="title" ng-bind="menuItem.title"></span>',
                                '<span class="arrow"></span>',
                            '</a>',
                            '<ul class="sub-menu" ng-if="menuItem.children">',
                                '<li ng-class="{\'active\': menuItem.active}" ng-repeat="submenuItem in menuItem.children">',
                                    '<a ng-href="submenuItem.url">',
                                        '<i ng-class="submenuItem.icon"></i>',
                                        '{{submenuItem.title}}',
                                    '</a>',
                                '</li>',
                            '</ul>',
                        '</li>',
                    '</ul>',
                '</div>'
            ].join(''));

        });
})(jQuery);
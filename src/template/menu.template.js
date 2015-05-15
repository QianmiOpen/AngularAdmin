(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.menu', [
                '<div class="page-sidebar-wrapper">',
                    '<div class="page-sidebar navbar-collapse collapse">',
                        '<ul class="page-sidebar-menu" ng-transclude></ul>',
                    '</div>',
                '</div>'
            ].join(''));

        });
})(jQuery);
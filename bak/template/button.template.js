(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.button.state', '<button type="button" class="btn" ng-transclude></button>');

        });
})(jQuery);
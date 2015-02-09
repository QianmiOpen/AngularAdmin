(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal',[
                '<div class="row ui-sortable">',
                    '<div class="column sortable col-md-{{eachColumn}}" ng-repeat="column in columns">',
                        '<ui-portlet-container ng-repeat="portlet in column"></ui-portlet-container>',
                        '<div class="portlet-container portlet-sortable-empty"></div>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.container',[
                '<div class="portlet-container">',
                '</div>'
            ].join(''));
        });
})(jQuery);
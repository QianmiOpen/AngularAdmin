(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.line', [
                '<div class="" type="line">',
                    '<div></div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.column', [
                '<div class="" type="column">',
                    '<div></div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.pie', [
                '<div class="" type="pie">',
                    '<div></div>',
                '</div>'
            ].join(''));
        });
})(jQuery);
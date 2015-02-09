(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.table', [
                '<div class="ui-table">',
                    '<table class="table table-striped table-bordered table-hover">',
                        '<thead>',
                            '<tr role="row" class="heading" ng-transclude>',
                            '</tr>',
                        '</thead>',
                        '<tbody></tbody>',
                    '</table>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.table.column', [
                '<th>',
                    '{{head}}',
                '</th>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.table.column.checked', [
                '<th>',
                    '<input type="checkbox" ng-click="onSelectAllHandler($event)"/>',
                '</th>'
            ].join(''));
        });
})(jQuery);
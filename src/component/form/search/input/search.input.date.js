//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDate', function (uiDateFacotry, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateFacotry,
            template: function (element, attrs) {
                var format = [];
                if (!attrs.date)
                    format.push('YYYY-MM-DD');
                if (!attrs.time)
                    format.push('HH:mm:ss');
                return componentHelper.getTemplate('tpl.searchform.input', $.extend({
                    other: [
                        {key: 'data-date-format', val: format.join(' ')},
                        {key: 'readonly', val: ''}
                    ]
                }, attrs));
            }
        };
    });
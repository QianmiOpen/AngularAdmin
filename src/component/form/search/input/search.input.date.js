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
            link: function (scope, element, attrs) {
                //
                var inputDate = uiDateFacotry(element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchDate', inputDate);

                //
                scope.$on('uisearchform.reset', function () {
                    inputDate.reset();
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
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
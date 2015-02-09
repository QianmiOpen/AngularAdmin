//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDate', function (uiDateFacotry, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                //
                var inputDate = uiDateFacotry(element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$formDate', inputDate);

                //
                scope.$on('uiform.reset', function () {
                    inputDate.reset();
                });

                //
                element.removeAttr('name').removeAttr('model');
            },
            template: function (element, attrs) {
                //
                var format = [],
                    cc = (attrs.col || defaultCol).split(':');
                if (!attrs.date)
                    format.push('YYYY-MM-DD');
                if (!attrs.time)
                    format.push('HH:mm:ss');

                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1],
                    other: [
                        {key: 'data-date-format', val: format.join(' ')},
                        {key: 'readonly', val: ''}
                    ]
                }, attrs));
            }
        };
    });
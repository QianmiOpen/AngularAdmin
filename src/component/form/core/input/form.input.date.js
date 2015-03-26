//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDate', function (uiDateFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateFactory,
            template: function (element, attrs) {
                //
                var format = [],
                    cc = (attrs.col || defaultCol).split(':');
                if (!attrs.mode || attrs.mode.indexOf('date') != -1)
                    format.push('YYYY-MM-DD');
                if (!attrs.mode || attrs.mode.indexOf('time') != -1)
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
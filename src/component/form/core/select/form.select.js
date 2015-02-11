//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSelect', function (uiSelectFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSelectFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.select', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });

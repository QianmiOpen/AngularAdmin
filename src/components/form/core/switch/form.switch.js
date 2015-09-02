//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSwitch', function (uiSwitchFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSwitchFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.switch', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });

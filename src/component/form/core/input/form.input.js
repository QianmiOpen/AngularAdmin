//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormInput', function (uiInputFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var input = new uiInputFactory(element, attrs);
                scope.$on('uiform.reset', function () {
                    input.reset();
                });
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });
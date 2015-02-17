//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormTextarea', function (componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                //
                var $textarea = element.find('textarea');
                scope.$on('uiform.reset', function () {
                    $textarea.val('');
                });

                //
                $textarea.html(transclude().text());

                //
                element.removeAttr('name').removeAttr('model').removeAttr('rows').removeAttr('cols');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.textarea', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });
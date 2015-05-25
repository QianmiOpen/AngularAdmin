//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormUserSelect', function (uiMultiSelectFactory, componentHelper, userConfig, defaultCol) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                var select = uiMultiSelectFactory(scope, element, $.extend({}, userConfig, attrs));
                componentHelper.tiggerComplete(scope, attrs.ref || '$formUserSelect', select);

                //
                scope.$on('uiform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
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

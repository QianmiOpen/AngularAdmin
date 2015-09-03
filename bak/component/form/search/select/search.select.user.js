//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchUserSelect', function (uiMultiSelectFactory, componentHelper, userConfig) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var select = uiMultiSelectFactory(scope, element, $.extend({}, userConfig, attrs));
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchUserSelect', select);

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.userselect.input', attrs);
            }
        };
    });
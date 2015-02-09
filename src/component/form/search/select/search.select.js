//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchSelect', function (uiSelectFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                var select = uiSelectFactory(element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchSelect', select);

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', attrs);
            }
        };
    });
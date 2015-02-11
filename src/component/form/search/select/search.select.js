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
            link: uiSelectFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', attrs);
            }
        };
    });
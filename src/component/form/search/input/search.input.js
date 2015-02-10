//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInput', function (uiInputFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiInputFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
            }
        };
    });
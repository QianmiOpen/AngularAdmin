//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchRegion', function (uiRegionService, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiRegionService,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.region', attrs);
            }
        };
    });
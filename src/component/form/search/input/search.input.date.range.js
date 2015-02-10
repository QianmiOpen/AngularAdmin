//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDateRange', function (uiDateRangeService, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateRangeService,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.daterange', attrs);
            }
        };
    });
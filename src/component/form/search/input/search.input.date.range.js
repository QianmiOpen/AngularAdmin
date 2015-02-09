//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDateRange', function (componentHelper, uiDateRangeService) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, $element, $attrs) {
                var dateRange = uiDateRangeService($element, $attrs);
                dateRange.render();
                componentHelper.tiggerComplete(scope, $attrs.ref || '$searchDateRange', dateRange);

                //
                scope.$on('uisearchform.reset', function () {
                    dateRange.reset();
                });

                //
                $element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.daterange', attrs);
            }
        };
    });
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
            link: function (scope, element, attrs) {
                attrs.autoWidth = true;
                var region = uiRegionService(element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchRegion', region);

                //
                scope.$on('uisearchform.reset', function () {
                    region.reset();
                });

                //
                element.removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.region', attrs);
            }
        };
    });
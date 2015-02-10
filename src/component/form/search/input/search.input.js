//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInput', function (uiInputFacotry, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var ref = attrs.ref || '$searchInput',
                    input = new uiInputFacotry(element, attrs);
                componentHelper.tiggerComplete(scope, ref, input);

                //
                scope.$on('uisearchform.reset', function () {
                    input.reset();
                });
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
            }
        };
    });
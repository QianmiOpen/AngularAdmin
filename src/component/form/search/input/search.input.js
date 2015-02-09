//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInput', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var ref = attrs.ref || '$searchInput',
                    $input = element.find('input');

                //
                componentHelper.tiggerComplete(scope, ref, $input);

                //
                scope.$on('uisearchform.reset', function () {
                    $input.val('');
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
            }
        };
    });
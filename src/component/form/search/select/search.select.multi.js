//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchMultiSelect', function (uiSelectFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                attrs.isMulti = true;
                var select = new uiSelectFactory(scope, element, attrs);

                //
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchSelect', select);

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                });
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', $.extend({
                    other: [
                        {key: 'multiple', val: ''},
                        {key: 'title', val: attrs.tip || '请选择'}
                    ]
                }, attrs));
            }
        };
    });
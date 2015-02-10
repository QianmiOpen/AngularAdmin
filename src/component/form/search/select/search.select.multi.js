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
            link: uiSelectFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', $.extend({
                    isMulti: true,
                    other: [
                        {key: 'multiple', val: ''},
                        {key: 'title', val: attrs.tip || '请选择'}
                    ]
                }, attrs));
            }
        };
    });
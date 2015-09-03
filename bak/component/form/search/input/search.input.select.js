//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInputSelect', function (uiSelectFactory, uiInputFactory, componentHelper, msg) {
        var m = new msg('SearchInputSelect');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                //
                var hasName = attrs.selectName && attrs.inputName,
                    input = new uiInputFactory(scope, element, attrs),
                    select = new uiSelectFactory(scope, element, attrs);

                //
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchInputSelect', {
                    select: select,
                    input: input
                });

                //
                if (hasName) { //没有设置name, 那么当select的值变动的时候, 自动设置input的name为select的value
                }
                else if (!!!attrs.selectName && !!!attrs.inputName) {
                    select.change(function () {
                        input.attr('name', select.val());
                    });
                    input.attr('name', select.val());
                }
                else {
                    m.error('必须同时设置select-name和input-name, 要么不设置, 要么全设置');
                }

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                    input.reset();
                });
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input.select', attrs);
            }
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInputSelect', function (uiSelectFactory, componentHelper, msg) {
        var m = new msg('SearchInputSelect');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                //
                var hasName = attrs.selectName && attrs.inputName,
                    $input = element.find('input');

                //
                var select = uiSelectFactory(element, attrs);
                select.render();

                //
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchInputSelect', {
                    select: select,
                    input: $input
                });

                //
                if (hasName) { //没有设置name, 那么当select的值变动的时候, 自动设置input的name为select的value
                }
                else if (!!!attrs.selectName && !!!attrs.inputName) {
                    select.element.change(function () {
                        $input.attr('name', select.element.val());
                    });
                    $input.attr('name', select.element.val());
                }
                else {
                    m.error('必须同时设置select-name和input-name, 要么不设置, 要么全设置');
                }

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                    $input.val('');
                });

                //
                element.removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input.select', attrs);
            }
        };
    });
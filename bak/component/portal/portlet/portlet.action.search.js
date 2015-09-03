//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionSearch', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                if (attrs.onEnter) {
                    element.keydown(function (evt) {
                        if (evt.keyCode == 13 && scope[attrs.onEnter]) {
                            scope[attrs.onEnter](element.val());
                        }
                    });
                }
            },
            template: function (el, attrs) {
                return componentHelper.getTemplate('tpl.portal.portlet.action.search', attrs);
            }
        };
    });




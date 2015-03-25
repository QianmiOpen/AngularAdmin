//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionTab', function (uiTabFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs) {
                        tab = uiTabFactory(scope, element, attrs);
                        tab.getContainer = function(){
                            return element.parents('.portlet').find('.portlet-body');
                        };
                        scope[attrs.ref] = tab;
                    }
                };
            },
            template: function (el, attrs) {
                attrs.ref = attrs.ref || '$portletActionTab' + (new Date().getTime());
                return componentHelper.getTemplate('tpl.portal.portlet.action.tab', attrs);
            }
        };
    });




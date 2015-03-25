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
            template: function (el, attrs) {
                return componentHelper.getTemplate('tpl.portal.portlet.action.search', attrs);
            }
        };
    });




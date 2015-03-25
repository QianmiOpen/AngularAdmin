//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletAction', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'tpl.portal.portlet.action'
        };
    });




//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletContainer', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'uiPortletContainerController',
            templateUrl: 'tpl.portal.portlet.container'
        };
    });




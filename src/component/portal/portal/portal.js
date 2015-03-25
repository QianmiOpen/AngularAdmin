//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortal', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'uiPortalController',
            templateUrl: 'tpl.portal'
        };
    });
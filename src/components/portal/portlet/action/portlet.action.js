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
            templateUrl: `
                <div class="actions portlet-tool-bar" ng-transclude>
                </div>
            `
        };
    });




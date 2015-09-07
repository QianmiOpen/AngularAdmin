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
            template: `
                <div class="actions portlet-tool-bar" ng-transclude>
                </div>
            `
        };
    });




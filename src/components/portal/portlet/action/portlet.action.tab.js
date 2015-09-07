//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionTab', function (UITabItemControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: (s, e, a, c, t) => {
                new UITabItemControl(s, e, a, t);
            },
            template: `
                <ul class="nav nav-tabs portlet-tool-bar" ng-transclude>
                </ul>
            `
        };
    });




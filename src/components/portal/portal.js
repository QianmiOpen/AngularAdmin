//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortal', function (UIPortalControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                url: '@'
            },
            link: (s, e, a, c, t) => {
                new UIPortalControl(s, e, a, t);
            },
            templateUrl: `
                <div class="row ui-sortable">
                    <div class="column sortable col-md-{{eachColumn}}" ng-repeat="column in columns">
                        <ui-portlet-container ng-repeat="portlet in column"></ui-portlet-container>
                        <div class="portlet-container portlet-sortable-empty"></div>
                    </div>
                </div>
            `
        };
    });
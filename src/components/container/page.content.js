angular.module('admin.component')
    .directive('uiPageContent', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: `
                <div class="page-content-wrapper">
                    <div class="page-content" ng-transclude>
                    </div>
                </div>
            `
        };
    });
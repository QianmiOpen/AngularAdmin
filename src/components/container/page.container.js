angular.module('admin.component')
    .directive('uiPageContainer', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: `
                <div class="page-container" ng-transclude></div>
            `
        };
    });
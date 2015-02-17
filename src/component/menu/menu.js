angular.module('admin.component')
    .directive('uiMenu', function (uiMenuFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: uiMenuFactory,
            templateUrl: 'tpl.menu'
        };
    });

angular.module('admin.component')
    .directive('uiRow', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: (s, e, a, c, t) => {
                e.append(t(s));
            },
            template: `
                <div class="row"></div>
            `
        };
    });
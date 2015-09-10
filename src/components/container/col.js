angular.module('admin.component')
    .directive('uiCol', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                col: '@'
            },
            link: (s, e, a, c, t) => {
                e.append(t(s.$parent));
            },
            template: `
                <div class="col-md-{{col}}"></div>
            `
        };
    });
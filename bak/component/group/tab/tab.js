angular.module('admin.component')
    .directive('uiTab', function (uiTabFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs) {
                        tab = uiTabFactory(scope, element, attrs);
                        var ref = attrs.ref || '$tab';
                        scope[ref] = tab;
                        componentHelper.tiggerComplete(scope, ref, tab);
                    },
                    post: function () {
                        tab.init();
                    }
                };
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab', attrs);
            }
        };
    });

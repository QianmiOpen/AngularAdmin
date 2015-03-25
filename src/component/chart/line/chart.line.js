/**
 *
 */
angular.module('admin.component')
    .directive('uiLineChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            link: function (scope, element, attrs) {
                new uiChartFactory(scope, element, attrs);
            },
            templateUrl: 'tpl.chart.line'
        };
    });

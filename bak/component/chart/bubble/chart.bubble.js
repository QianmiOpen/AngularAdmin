/**
 *
 */
angular.module('admin.component')
    .directive('uiBubbleChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                var chart = new uiChartFactory(scope, element, attrs);
                chart.setType('line');
            },
            templateUrl: 'tpl.chart'
        };
    });

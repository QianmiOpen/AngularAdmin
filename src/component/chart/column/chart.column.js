/**
 *
 */
angular.module('admin.component')
    .directive('uiColumnChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                new uiChartFactory(scope, element, attrs);
            },
            templateUrl: 'tpl.chart.column'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiPieChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function (scope, element, attrs) {
                var factory = new uiChartFactory(scope, element, attrs);
                factory.setData = function (data) {
                    this.config.series = [{
                        type: 'pie',
                        data: data.map(function (d) {
                            for (var k in d) {
                                return [k, d[k]];
                            }
                        })
                    }];
                    this.build();
                };
            },
            templateUrl: 'tpl.chart.pie'
        };
    });

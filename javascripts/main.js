

angular.module('demoApp', ['admin', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
        var basePath = 'views/';

        $stateProvider
            .state('start', {
                url: '/start',
                templateUrl: basePath + 'start.html'
            })

        $urlRouterProvider.otherwise('/start');
    });
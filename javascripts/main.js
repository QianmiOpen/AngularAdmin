angular.module('demoApp', ['admin', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        var basePath = 'views/';


        $stateProvider
            .state('start', {url: '/start', templateUrl: basePath + 'start.html'})

            .state('searchform', {url: '/searchform', templateUrl: basePath + 'searchForm/index.html'})
            .state('searchform.input', {url: '/searchform/input', templateUrl: basePath + 'searchForm/searchInput.html'})
            .state('searchform.date', {url: '/searchform/date', templateUrl: basePath + 'searchForm/searchDate.html'})
            .state('searchform.daterange', {url: '/searchform/daterange', templateUrl: basePath + 'searchForm/searchDateRange.html'})
            .state('searchform.number', {url: '/searchform/number', templateUrl: basePath + 'searchForm/searchNumberInput.html'})
            .state('searchform.inputselect', {url: '/searchform/inputselect', templateUrl: basePath + 'searchForm/searchInputSelect.html'})
            .state('searchform.region', {url: '/searchform/region', templateUrl: basePath + 'searchForm/searchRegion.html'})
            .state('searchform.select', {url: '/searchform/select', templateUrl: basePath + 'searchForm/searchSelect.html'})
            .state('searchform.multiselect', {url: '/searchform/multiselect', templateUrl: basePath + 'searchForm/searchMultiSelect.html'})
            ;
        $urlRouterProvider.otherwise('/start');
    });
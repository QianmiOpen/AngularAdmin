angular.module('demoApp', ['admin', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        var basePath = 'views/';


        $stateProvider
            .state('start', {url: '/start', templateUrl: basePath + 'start.html'})

            .state('form', {url: '/form', templateUrl: basePath + 'form/index.html'})

            .state('tab', {url: '/tab', templateUrl: basePath + 'tab/index.html'})

            .state('chart', {url: '/chart', templateUrl: basePath + 'chart/index.html'})

            .state('searchform', {url: '/searchform', templateUrl: basePath + 'searchForm/index.html'})
            .state('searchform.input', {url: '/searchform/input', templateUrl: basePath + 'searchForm/searchInput.html'})
            .state('searchform.date', {url: '/searchform/date', templateUrl: basePath + 'searchForm/searchDate.html'})
            .state('searchform.daterange', {url: '/searchform/daterange', templateUrl: basePath + 'searchForm/searchDateRange.html'})
            .state('searchform.number', {url: '/searchform/number', templateUrl: basePath + 'searchForm/searchNumberInput.html'})
            .state('searchform.inputselect', {url: '/searchform/inputselect', templateUrl: basePath + 'searchForm/searchInputSelect.html'})
            .state('searchform.region', {url: '/searchform/region', templateUrl: basePath + 'searchForm/searchRegion.html'})
            .state('searchform.select', {url: '/searchform/select', templateUrl: basePath + 'searchForm/searchSelect.html'})
            .state('searchform.multiselect', {url: '/searchform/multiselect', templateUrl: basePath + 'searchForm/searchMultiSelect.html'})

            .state('tree', {url: '/tree', templateUrl: basePath + 'tree/index.html'})

            .state('table', {url: '/table', templateUrl: basePath + 'table/index.html'})
            .state('table.tablecheckcolumn', {url: '/table/checkcolumn', templateUrl: basePath + 'table/tableCheckColumn.html'})
            .state('table.tablecolumn', {url: '/table/tablecolumn', templateUrl: basePath + 'table/tableColumn.html'})
            .state('table.tabledatecolumn', {url: '/table/datecolumn', templateUrl: basePath + 'table/tableDateColumn.html'})
            .state('table.tableimagecolumn', {url: '/table/imagecolumn', templateUrl: basePath + 'table/tableImageColumn.html'})
            .state('table.tableprogresscolumn', {url: '/table/progresscolumn', templateUrl: basePath + 'table/tableProgressColumn.html'})
            .state('table.tablestatecolumn', {url: '/table/statecolumn', templateUrl: basePath + 'table/tableStateColumn.html'})

            .state('portal', {url: '/portal', templateUrl: basePath + 'portal/index.html'})
            .state('portal.portlet', {url: '/portal/portlet', templateUrl: basePath + 'portal/portlet.html'})
            .state('portal.portletaction', {url: '/portal/portlet/action', templateUrl: basePath + 'portal/portletaction.html'})
            .state('portal.portletactionsearch', {url: '/portal/portlet/action/search', templateUrl: basePath + 'portal/portletactionsearch.html'})
            .state('portal.portletactionpagination', {url: '/portal/portlet/action/pagination', templateUrl: basePath + 'portal/portletactionpagination.html'})
            ;
        $urlRouterProvider.otherwise('/start');
    });
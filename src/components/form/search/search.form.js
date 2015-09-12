//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchForm', function (UISearchFormControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                lcol: '@',
                rcol: '@',
                onSearch: '&',
                onReset: '&'
            },
            link: function (scope, element, attrs, controller, transclude) {
                new UISearchFormControl(scope, element, attrs, transclude);
            },
            template: `
                <form novalidate action="" class="ui-search-form form-inline">
                    <div class="row">
                        <div class="col-md-{{lcol}}"></div>
                        <div class="text-right col-md-{{rcol}}">
                            <a title="回车键也可触发搜索" class="btn blue-chambray btn-sm" ng-click="component.search()" style="width: 30px"><i class="fa fa-search"></i></button>
                            <a title="重置搜索选项" class="btn default btn-sm" ng-click="component.reset()" style="width: 30px"><i class="fa fa-undo font-blue-chambray"></i></a>
                        </div>
                    </div>
                </form>
            `
        };
    });

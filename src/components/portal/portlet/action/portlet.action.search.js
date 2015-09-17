//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionSearch', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                change: '&',
                placeholder: '@',
                model: '='
            },
            link: (scope) => {
                scope.model = '';
            },
            template: `
                <div class="inputs portlet-tool-bar">
                    <div class="portlet-input input-inline">
                        <div class="input-icon right">
                            <i class="icon-magnifier"></i>
                            <input type="text" ng-model="model" class="form-control input-circle" placeholder="{{placeholder}}"/>
                        </div>
                    </div>
                </div>
            `
        };
    });




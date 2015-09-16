//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchSelect', function (UISelectControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                label: '@',
                placeholder: '@',
                name: '@',
                css: '@',
                model: '=',
                change: '&',
                multiple: '@',
                render: '&',
                labelName: '@',
                valueName: '@',
                buttonClass: '@'
            },
            link: function (s, e, a) {
                new UISelectControl(s, e, a);
            },
            template: `
                <div class="input-inline ui-search-item">
                    <div ng-class="{'input-group': label}">
                        <div ng-if="label" class="input-group-addon">{{label}}</div>
                        <select class="form-control show-tick" data-live-search="true" name="{{name}}" ng-transclude></select>
                    </div>
                </div>
            `
        };
    });
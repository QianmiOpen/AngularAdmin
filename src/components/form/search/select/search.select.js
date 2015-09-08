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
                render: '&'
            },
            link: function (s, e, a) {
                new UISelectControl(s, e, a);
            },
            template: `
                <div class="input-inline search-item">
                    <div class="input-group">
                        <div ng-if="label" class="input-group-addon">{{label}}</div>
                        <select class="form-control show-tick" data-live-search="true" data-style="{{buttonClass}}" name="{{name}}" ng-transclude></select>
                    </div>
                </div>
            `
        };
    });
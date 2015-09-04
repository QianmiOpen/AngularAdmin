//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchTag', function (UITagControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                name: '@',
                model: '=',
                placeholder: '@',
                change: '&'
            },
            link: function (scope, element, attrs) {
                new UITagControl(scope, element, attrs);
            },
            template: `
                <div class="input-large">
                    <div class="input-group">
                        <div ng-if="label" class="input-group-addon">{{label}}</div>
                        <input class="form-control" name="{{name}}" />
                    </div>
                </div>
            `
        };
    });

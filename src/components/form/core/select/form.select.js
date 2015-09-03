//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSelect', function (UISelectControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                multiple: '@',
                render: '&'
            },
            link: function (s, e, a) {
                new UISelectControl(s, e, a);
            },
            template: `
                <div class="form-group">
                    <label class="col-md-{{lcol}} control-label">{{label}}</label>
                    <div class="col-md-{{rcol}}">
                        <select class="form-control show-tick" data-live-search="true" data-style="{{buttonClass}}" name="{{name}}" title="{{placeholder || '请选择'}}" ng-transclude></select>
                        <span ng-if="help" class="help-block">{{help}}</span>
                    </div>
                </div>
            `
        };
    });

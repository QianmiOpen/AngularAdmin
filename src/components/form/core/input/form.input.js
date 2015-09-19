//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormInput', function (UIInputControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                max: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                type: '@'
            },
            link: function (scope, element, attrs) {
                new UIInputControl(scope, element, attrs);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <input type="{{type || 'text'}}" max-length="{{max}}" class="form-control {{css}}" name="{{name}}" placeholder="{{placeholder}}" ng-change="change({val: model})" ng-model="model"/>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
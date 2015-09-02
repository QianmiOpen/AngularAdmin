//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormTag', function (UITagControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UITagControl(scope, element, attrs);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <input type="text" class="form-control" name="{{name}}"/>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>
            `
        };
    });

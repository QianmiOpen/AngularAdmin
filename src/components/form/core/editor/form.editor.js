//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormEditor', function (UIEditorControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UIEditorControl(scope, element, attrs);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <script name="{{name}}" type="text/plain"></script>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
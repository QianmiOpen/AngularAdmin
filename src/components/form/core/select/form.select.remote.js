//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormRemoteSelect', function (UIRemoteSelectControl) {
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
                new UIRemoteSelectControl(scope, element, attrs);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <div>
                            <input type="text" class="form-control" name="{{name}}"/>
                       </div>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>
            `
        };
    });

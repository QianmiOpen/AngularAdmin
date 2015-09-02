//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSwitch', function (UISwitchControl) {
        return {
            restrict: 'E',
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: (s, e, a) => {
                new UISwitchControl(s, e, a);
            },
            template: `
               <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                        <input type="checkbox" class="form-control {{css}}" name="{{name}}" />
                        <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>
            `
        };
    });

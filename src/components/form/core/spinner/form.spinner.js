//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSpinner', function (UISpinnerControl) {
        return {
            restrict: 'E',
            replace: true,
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
                new UISpinnerControl(s, e, a);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <div class="input-group" style="width:150px;">
                           <div class="spinner-buttons input-group-btn">
                               <button type="button" class="btn spinner-up blue"><i class="fa fa-plus"></i></button>
                           </div>
                           <input type="text" class="form-control {{css}}" name="{{name}}" placeholder="{{placeholder}}" ng-model="model" readonly="true"/>
                           <div class="spinner-buttons input-group-btn">
                               <button type="button" class="btn spinner-down red"><i class="fa fa-minus"></i></button>
                           </div>
                       </div>
                        <span ng-if="help" class="help-block">{{help}}</span>
                    </div>
               </div>
            `
        };
    });
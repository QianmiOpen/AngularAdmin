//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDateRange', function (UIDateRangeControl) {
        return {
            restrict: 'E',
            replace: true,
            link: function (s, e, a) {
                new UIDateRangeControl(s, e, a);
            },
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                fromModel: '=',
                toModel: '=',
                change: '&',
                help: '@'
            },
            template: `
               <div class="form-group">
                   <label class="col-md-{{lcol}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol}}">
                       <div class="input-date-range input-inline">
                           <div class="input-group">
                               <input type="text" class="form-control" name="{{fromName}}" ng-model="fromModel" value="{{fromValue}}" readonly>
                               <span class="input-group-addon">至</span>
                               <input type="text" class="form-control" name="{{toName}}" ng-model="toModel" value="{{toValue}}" readonly>
                           </div>
                       </div>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>
            `
        };
    });
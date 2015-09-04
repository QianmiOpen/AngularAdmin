//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormUpload', function (UIInputControl) {
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
                new UIInputControl(scope, element, attrs);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}} ui-form-upload">
                       <div>
                           <img class="{{css}}"/>
                       </div>
                       <div class="btn-group">
                           <button type="button" class="btn blue start">
                               <i class="fa fa-upload"></i>
                               <span>选择文件</span>
                           </button>
                           <button type="button" class="btn red start">
                               <i class="fa fa-upload"></i>
                               <span>删除文件</span>
                           </button>
                       </div>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
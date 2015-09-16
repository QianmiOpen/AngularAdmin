//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormText', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                model: '=',
                css: '@',
                placeholder: '@',
                help: '@'
            },
            link: function (scope, element, attrs, controller, tranclude) {
                scope.lcol = scope.lcol !== undefined ? scope.lcol : 2;
                scope.rcol = scope.rcol !== undefined ? scope.rcol : 10;
                element.find('p').append(tranclude(scope.$parent));
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <p class="form-control-static" ng-bind="model"></p>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
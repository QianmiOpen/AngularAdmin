//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormItem', function () {

        class UIFormControl extends UIFormItemControl {
            constructor(s, e, a, t) {
                this.transclude = t;
                super(s, e, a);
            }

            init() {
                super.init();
                this.content = this.transclude(this.scope.$parent);
            }

            render() {
                this.element.find('.ui-form-item-body').append(this.content);
            }
        }

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                help: '@'
            },
            link: function (scope, element, attrs, controller, tranclude) {
                new UIFormControl(scope, element, attrs, tranclude);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                       <div class="ui-form-item-body"></div>
                       <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
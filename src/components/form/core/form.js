//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .constant('defaultCol', '2:10')
    .directive('uiForm', function (UIFormControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                action: '@',
                onSubmit: '&'
            },
            compile: function () {
                var form = null;
                return {
                    pre: function (scope, element, attrs, controller, transclude) {
                        form = new UIFormControl(scope, element, attrs, transclude(scope.$parent));
                    },
                    post: function () {
                        form.layout();
                    }
                };
            },
            template: `
                <div class="form">
                    <form action="{{action}}" class="form-horizontal form-bordered form-row-stripped">
                        <div class="form-body">
                        </div>
                    </form>
                </div>

            `
        };
    });



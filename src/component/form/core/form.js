//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .constant('defaultCol', '2:10')
    .directive('uiForm', function (uiFormFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            transclude: true,
            compile: function () {
                var form = null;
                return {
                    pre: function (scope, element, attrs, controller, transclude) {
                        form = new uiFormFactory(scope, element, attrs, transclude(scope));
                        form.layout();
                        var ref = attrs.ref || '$form';
                        scope[ref] = form;
                        componentHelper.tiggerComplete(scope, ref, form);
                    },
                    post: function () {
                        form.initValidation();
                    }
                };
            },
            templateUrl: 'tpl.form'
        };
    });



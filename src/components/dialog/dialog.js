angular.module('admin.component')
    .directive('uiDialog', function (UIDialogControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                url: '@',
                initParams: '=',
                onShow: '&',
                onHide: '&'
            },
            link: function (scope, element, attrs, controller, transclude) {
                let control = new UIDialogControl(scope, scope.url, scope.initParams, transclude);
                control.triggerComplete(scope, attrs.ref || '$dialog', control);
            },
            template: `
                <div class="ui-dialog"></div>
            `
        };
    });
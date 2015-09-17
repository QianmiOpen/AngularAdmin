//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class UIStateButton extends Event {
        constructor(scope, element, attrs) {
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.message = new Message('uiStateButton');
        }

        init() {
            if (!this.scope.onClick) {
                this.message.error('必须设置on-click属性');
            }
            this.element.click(() => {
                this.disable(true);
                let result = this.scope.onClick({});
                this.wait(result);
            });
        }

        wait(result) {
            if (result && result.finally) {
                result.finally(() => this.disable(false));
            }
            else if (result && result.always) {
                result.always(() => this.disable(false));
            }
            else {
                this.disable(false);
            }
        }

        disable(isD) {
            if (this.scope.target) {
                if (isD) {
                    Metronic.blockUI({target: this.scope.target});
                }
                else {
                    Metronic.unblockUI(this.scope.target);
                }
            }

            //
            this.element.prop('disabled', isD);
        }
    }

    angular.module('admin.component')
        .directive('uiStateButton', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    target: '@',
                    onClick: '&'
                },
                link: function (scope, element, attrs) {
                    let button = new UIStateButton(scope, element, attrs);
                    button.init();
                },
                template: (element, attrs) => {
                    if (attrs.link != undefined) {
                        return '<a ng-transclude></a>';
                    }
                    else {
                        return '<button type="button" ng-transclude></button>';
                    }
                }
            };
        });
})();
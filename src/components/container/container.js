//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('uiContainer', function ($timeout, $controller, $injector) {

            class UIContainer extends Event {

                constructor(scope, element, attrs, $transclude) {
                    this.scope = scope;
                    this.element = element;
                    this.attrs = attrs;
                    this.scope.$on('componentComplete', this.initHandler.bind(this));
                    this.content = $transclude(scope);
                }

                init() {
                    this.element
                        .show()
                        .append(this.content);

                    this.lazyInit();
                    return this;
                }

                initEvents(){
                }

                lazyInit() {
                    var ctrl = this.attrs.controller;
                    $timeout(() => {
                        // 全局定义
                        if (ctrl && window[ctrl]) {
                            var ctrlArgs = /\(([^\)]+)\)/.exec(window[ctrl].toString())[1],
                                args = {$scope: this.scope};
                            ctrlArgs = ctrlArgs.split(',');
                            for (var i = 1, arg; i < ctrlArgs.length; i++) {
                                arg = $.trim(ctrlArgs[i]);
                                args[arg] = $injector.get(arg);
                            }
                            $controller(window[ctrl], args);
                        }
                        //
                        else if (ctrl) {
                            $controller(ctrl, {$scope: this.scope});
                        }
                        this.scope.$emit('uicontainer.ready'); // 触发
                    });
                }

                initHandler(evt, args) {
                    if (args) {
                        if (this.scope[args.ref]) {
                            this.scope[args.ref] = [].concat(this.scope[args.ref]);
                            this.scope[args.ref].push(args.component);
                        }
                        else {
                            this.scope[args.ref] = args.component;
                        }
                    }
                }
            }

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                link: function (scope, element, attrs, ctrl, tranclude) {
                    new UIContainer(scope, element, attrs, tranclude)
                        .init()
                        .initEvents();
                },
                template: `
                    <div></div>
                `
            };
        });
})();
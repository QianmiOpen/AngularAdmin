//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('uiDialog', function (msg, $compile, $q, $controller, $timeout, Event) {

        var m = new msg('Dialog'),
            Dialog = function (url, scope, ctrlName, resolve) {
                Event.call(this);
                this.url = url;
                this.ctrlName = ctrlName;
                this.scope = scope.$new();
                this.scope.dialog = this;
                this.resolve = $.extend(resolve || {}, {$scope: this.scope});
                this.start();
            };

        Dialog.prototype = {

            /**
             * 快捷增加关闭事件
             * @param fn
             */
            onClose: function (fn) {
                this.$on('hidden.bs.modal', fn);
            },

            /**
             * 开始弹出
             */
            start: function () {
                var $dom = $('<div/>').hide().appendTo(document.body),
                    defer = $q.defer();
                $dom.load(this.url, function (html) {
                    var $e = this.build(html);
                    $dom.remove(); //
                    defer.resolve($e);
                }.bind(this));
                this.result = defer.promise;
            },

            /**
             * 创建
             * @param html
             */
            build: function (html) {
                var angularDomEl = angular.element(html),
                    e = $compile(angularDomEl)(this.scope);

                //
                this.element = e;
                this.element.one('hidden.bs.modal', function () {
                    this.$emit('uiDialog.doHide');
                    this.element.remove();
                    $('.modal-backdrop').remove();
                    this.scope.$destroy();
                }.bind(this));
                this.element.one('shown.bs.modal', function () {
                    if (this.ctrlName) {
                        $timeout(function () {
                            try{
                                $controller(window[this.ctrlName] || this.ctrlName, this.resolve);
                            }
                            catch (e){
                                console.error('加载controller失败')
                            }
                        }.bind(this));
                    }
                    this.$emit('uiDialog.doShow');
                }.bind(this));

                //
                this.element.modal({
                    "keyboard": true,
                    "show": true
                });
                this.scope.$apply();
            },

            close: function () {
                if (this.element) {
                    this.element.modal('hide');
                }
            }
        };

        return {
            load: function (url, ctrlName, scope, reslove) {
                return new Dialog(url, ctrlName, scope, reslove);
            },

            //
            show: function () {
            }
        };
    });
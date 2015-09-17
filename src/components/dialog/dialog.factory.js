//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIDialog', function (UIDialogControl, $controller, $q) {
            return {
                show(url, $scope, controller) {
                    let defer = $q.defer(),
                        dialog = new UIDialogControl($scope, url);
                    //
                    $scope.onShow = () => {
                        defer.resolve(dialog);
                    };
                    $scope.onHide = () => {
                        defer.reject(dialog);
                    };

                    //
                    dialog
                        .show()
                        .then(() => {
                            try {
                                $controller(window[controller] || controller, {$scope});
                            }
                            catch (e) {
                            }
                        });
                    return defer.promise;
                }
            };
        })
        .factory('UIDialogControl', function (Util, Ajax, $compile, $controller, $q) {
            class UIDialogControl extends ComponentEvent {
                constructor(scope, url, urlParam, transclude) {
                    super();
                    this.scope = scope;
                    this.scope.dialog = this;
                    this.url = url;
                    this.urlParams = urlParam;
                    this.transclude = transclude;
                    this.message = new Message('UIDialogHelper');
                }

                show() {
                    return this.getContent()
                        .then(() => {
                            this.content.modal({
                                "keyboard": true,
                                "size": "large",
                                "show": true
                            });
                            return this.content;
                        });
                }

                hide() {
                    if (this.content) {
                        this.content.modal('hide');
                    }
                }

                getContent() {
                    if (this.content) {
                        return Util.toPromise(this.content);
                    }
                    else if (this.url) {
                        return Ajax.load(this.url, this.urlParams || {})
                            .then((html) => {
                                this.content = $compile(html)(this.scope);
                                this._addEvents();
                            });
                    }
                    else {
                        this.content = this.transclude(this.scope).filter('.modal');
                        this._addEvents();
                        return Util.toPromise(this.content);
                    }
                }

                remove() {
                    this.hide();
                    this.content.unbind('shown.bs.modal');
                    this.content.unbind('hidden.bs.modal');
                    this.content.remove();
                    super.remove();
                }

                close() {
                    this.remove();
                }

                _addEvents() {
                    this.content.bind('shown.bs.modal', () => {
                        this.scope.onShow();
                    });
                    this.content.bind('hidden.bs.modal', () => {
                        this.scope.onHide();
                    });
                }
            }
            return UIDialogControl;
        });
})();
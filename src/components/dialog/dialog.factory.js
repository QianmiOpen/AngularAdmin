//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIDialogControl', function (Util, Ajax, $compile, $controller, $q) {
            class UIDialogControl extends ComponentEvent {
                constructor(scope, url, urlParam, transclude) {
                    super();
                    this.scope = scope;
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
                                "show": true
                            });
                        });
                }

                hide() {
                    if (this.content) {
                        this.content.modal({
                            "show": false
                        });
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
                    super.remove();
                    this.content.unbind('shown.bs.modal');
                    this.content.unbind('hidden.bs.modal');
                }

                static alert(msg) {
                    let defer = $q.defer();
                    bootbox.alert({message: msg, callback: () => defer.resolve()});
                    return defer.promise;
                }

                static confirm(msg) {
                    let defer = $q.defer();
                    bootbox.confirm({message: msg, callback: (r) => r ? defer.resolve() : defer.reject()});
                    return defer.promise;
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
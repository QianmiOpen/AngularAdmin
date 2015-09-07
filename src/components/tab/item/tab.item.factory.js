//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITabItemControl', function (Ajax, Util, $compile) {
        class UITabItemControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.message = new Message('UITabItem');
                this.init();
                this.initEvents();
            }

            init() {
                this.scope.component = this;
                this.bodyElement = this.element.parents('.ui-tab').find('.tab-content');
            }

            initEvents() {
                this.scope.$on('uitab.item.remove', (evt, index) => {
                    if (index == this.element.index()) {
                        this._remove();
                    }
                });
                this.scope.$on('uitab.item.show', (evt, index) => {
                    this[index == this.element.index() ? '_show' : '_hide']();
                });
            }

            clickHandler(evt) {
                this.scope.$parent.$broadcast('uitab.item.show', this.element.index());
                evt.stopPropagation();
            }

            removeHandler(evt) {
                this.scope.$parent.$broadcast('uitab.item.remove', this.element.index());
                evt.stopPropagation();
            }

            getContent() {
                if (this.content) {
                    return Util.toPromise(this.content);
                }
                else if (this.scope.url) {
                    return Ajax.get(this.scope.url)
                        .then((html) => {
                            this.content = $compile(html)(this.scope);
                            return this.content;
                        });
                }
                else {
                    this.transclude(this.scope, (dom) => {
                        this.content = dom;
                    });
                    return Util.toPromise(this.content);
                }
            }

            _show() {
                if (this.content) {
                    this.content.show();
                }
                else {
                    this.getContent()
                        .then(() => {
                            this.bodyElement.append(this.content);
                            this.content.show();
                        });
                }
                this.scope.active = true;
            }

            _hide() {
                if (this.content) {
                    this.content.hide();
                }
                this.scope.active = false;
            }

            _remove() {
                setTimeout(()=> {
                    this.element.remove();
                    this.content && this.content.remove();
                    this.scope.$destroy();
                }, 100);
            }
        }

        return UITabItemControl;
    });
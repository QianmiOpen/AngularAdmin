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
            }

            initEvents() {
                this.scope.$on('uitab.item.remove', (evt, index) => {
                    if (index == this.element.index()) {
                        this.remove();
                    }
                });
                this.scope.$on('uitab.item.show', (evt, o) => {
                    let index = o.index,
                        isLazy = o.lazy;
                    if (index == this.element.index()) {
                        this._show();
                    }
                    else if (this.content) {
                        this._hide();
                    }
                    else if (!isLazy) {
                        this.getContent().then(() => {
                            this.getContainer().append(this.content);
                            this.content.hide();
                        });
                    }
                });
            }

            clickHandler(evt) {
                this.scope.$parent.$broadcast('uitab.item.show', {index: this.element.index()});
                evt.stopPropagation();
            }

            removeHandler(evt) {
                this.scope.$parent.$broadcast('uitab.item.remove', this.element.index());
                evt.stopPropagation();
            }

            getContainer() {
                if (!this.bodyElement) {
                    this.bodyElement = this.element.parents('.ui-tab').find('.tab-content');
                    if (this.bodyElement.length === 0) {
                        this.bodyElement = this.element.parents('.portlet').find('.portlet-body');
                    }
                }
                return this.bodyElement;
            }

            getContent() {
                if (this.content) {
                    return Util.toPromise(this.wrapperContent(html));
                }
                else if (this.scope.url) {
                    return Ajax.load(this.scope.url)
                        .then((html) => {
                            this.content = this.wrapperContent(html);
                            return this.content;
                        });
                }
                else {
                    this.transclude(this.scope.$parent.$parent, (dom) => {
                        this.content = dom;
                    });
                    return Util.toPromise(this.content);
                }
            }

            wrapperContent(html) {
                return $compile(html)(this.scope.$parent.$parent);
            }

            _show() {
                if (this.content) {
                    this.content.show();
                }
                else {
                    this.getContent()
                        .then(() => {
                            this.getContainer().append(this.content);
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

            remove() {
                setTimeout(()=> {
                    this.element.remove();
                    this.content && this.content.remove();
                    this.scope.$destroy();
                }, 100);
            }
        }

        return UITabItemControl;
    });
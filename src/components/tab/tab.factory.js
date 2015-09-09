//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITabControl', function () {
        class UITabControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.message = new Message('UITab');
                this.init();
                this.initEvents();
            }

            init() {
                this.scope.component = this;
                this.isLazy = this.scope.lazy != 'false';
                this.transclude(this.scope, (dom) => {
                    this.element.find('ul').append(dom);
                });
                this.triggerComplete(this.scope, this.attrs.ref || '$tab', this);
            }

            initEvents() {
            }

            build() {
                this.showAtIndex(this.scope.default || '0');
            }

            showAtIndex(index) {
                index && this.scope.$broadcast('uitab.item.show', {index, lazy: this.isLazy});
            }

            removeAtIndex(index) {
                index && this.scope.$broadcast('uitab.item.remove', index);
            }
        }

        return UITabControl;
    });
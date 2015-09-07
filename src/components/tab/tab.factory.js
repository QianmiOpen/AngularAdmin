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
                this.triggerComplete(this.scope, this.attrs.ref || '$tab', this);
            }

            initEvents() {
            }

            build() {
                this.showAtIndex(this.scope.default);
            }

            showAtIndex(index) {
                index && this.scope.$broadcast('uitab.item.show', index);
            }

            removeAtIndex(index) {
                index && this.scope.$broadcast('uitab.item.remove', index);
            }
        }

        return UITabControl;
    });
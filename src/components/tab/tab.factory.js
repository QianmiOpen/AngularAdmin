//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITabControl', function ($compile) {
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
                this.bodyElement = this.element.find('ul');
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

            addTab(head, content, active) {
                var $h = $(`<ui-tab-item head="${head}">${content}</ui-tab-item>`);
                this.bodyElement.append($h);
                $compile($h)(this.scope);
                if (active) {
                    this.showAtIndex(this.bodyElement.find('li').length - 1);
                }
            }

            showAtIndex(index) {
                index != undefined && this.scope.$broadcast('uitab.item.show', {index, lazy: this.isLazy});
            }

            removeAtIndex(index) {
                index != undefined && this.scope.$broadcast('uitab.item.remove', index);
            }
        }

        return UITabControl;
    });
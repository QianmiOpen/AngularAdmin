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
                this.tabItems = [];
                this.scope.component = this;
                this.bodyElement = this.element.find('ul');
                this.isLazy = this.scope.lazy != 'false';
                this.transclude(this.scope, (dom) => {
                    this.element.find('ul').append(dom);
                });
                this.triggerComplete(this.scope, this.attrs.ref || '$tab', this);
            }

            initEvents() {
                this.scope.$on('uitab.item.show', (evt, info) => {
                    setTimeout(() => {
                        this.scope.onChange({index: info.index});
                    }, 60);
                });
                this.scope.$on('uitab.item.remove', (evt, index) => {
                    this.scope.onRemove({index: index});
                });
                this.scope.$on('uitab.item.complete', (evt, item) => {
                    this.tabItems.push(item);
                });
            }

            build() {
                this.showAtIndex(this.scope.default || '0');
            }

            addTab(head, content, active) {
                this.addCustomTab(`<ui-tab-item head="${head}">${content || ''}</ui-tab-item>`, active);
            }

            addCustomTab(tpl, active) {
                var $h = $(tpl);
                this.bodyElement.append($h);
                $compile($h)(this.scope);
                if (active) {
                    this.showAtIndex(this.bodyElement.find('li').length - 1);
                }
            }

            showAtIndex(index) {
                index = parseInt(index);
                if (index !== undefined && index >= 0) {
                    this.scope.$broadcast('uitab.item.show', {index, lazy: this.isLazy});
                }
            }

            removeAtIndex(index) {
                index = parseInt(index);
                if(index != undefined && index >= 0){
                    this.scope.$broadcast('uitab.item.remove', index);
                }
            }
        }

        return UITabControl;
    });
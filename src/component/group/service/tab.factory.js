//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiTabFactory', function (msg, ajax, Event) {
        var m = new msg('Tab'),
            Tab = function (scope, element, attrs) {
                Event.call(this);
                this.element = element;
                this.contentElement = element.find('.tab-content');
                this.default = parseInt(attrs.default || 0);
                this.attrs = attrs;
                this.scope = scope;
                this.activeItem = null;
                this.items = [];
            };
        Tab.prototype = {

            /**
             *
             */
            init: function () {
                this.showAtIndex(this.default);
            },

            /**
             *
             */
            showAtItem: function (tabItem) {
                //
                if (this.activeItem) {
                    this.activeItem.active(false).hide();
                }

                //
                var container = this.contentElement;
                Metronic.blockUI({target: container});
                tabItem.active(true).show().then(function (content) {
                    if (content.parent().length == 0) {
                        container.append(content);
                    }
                    setTimeout(function () {
                        Metronic.unblockUI(container);
                    }, 500);
                });
                this.activeItem = tabItem;
                return this;
            },

            /**
             *
             * @param index
             */
            showAtIndex: function (index) {
                this.showAtItem(this.items[index]);
            },

            /**
             *
             * @param tabItem
             */
            addItem: function (tabItem) {
                this.items.push(tabItem);
                tabItem.onActive(this.onActiveHandler.bind(this));
            },

            /**
             *
             */
            onActiveHandler: function (tabItem) {
                this.showAtItem(tabItem);
            }
        };
        return function (scope, element, attrs) {
            return new Tab(scope, element, attrs);
        };
    });
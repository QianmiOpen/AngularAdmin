//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiTabFactory', function (msg, ajax, Event, $compile) {
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
            change: function (fn) {
                this.$on('change', fn);
            },

            /**
             *
             */
            remove: function (fn) {
                this.$on('remove', fn);
            },

            /**
             *
             * @returns {*|Tab.contentElement}
             */
            getContainer: function () {
                return this.contentElement;
            },

            /**
             *
             */
            showAtItem: function (tabItem) {
                if (!tabItem) {
                    return;
                }

                //
                if (this.activeItem) {
                    this.activeItem.active(false).hide();
                }

                //
                var container = this.getContainer();
                tabItem.active(true).show().then(function (content) {
                    if (content.parent().length === 0) {
                        container.append(content);
                    }
                    content.show();
                });

                //
                this.$emit('change', tabItem, tabItem.getIndex());

                //
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
                tabItem.index = this.items.length;
                this.items.push(tabItem);
                tabItem.onActive(this.onActiveHandler.bind(this));
                tabItem.onRemove(this.onRemoveHandler.bind(this));
            },

            /**
             *
             */
            onActiveHandler: function (tabItem) {
                this.showAtItem(tabItem);
            },

            /**
             *
             */
            onRemoveHandler: function (tabItem, index) {
                this.items.splice(index, 1);
                if (this.activeItem == tabItem) {
                    var preIndex = index - 1,
                        nextIndex = index;
                    if (preIndex >= 0 && preIndex <= this.items.length - 1) {
                        this.showAtIndex(preIndex);
                    }
                    else if (nextIndex >= 0 && nextIndex < this.items.length - 1) {
                        this.showAtIndex(nextIndex);
                    }
                }
                //
                this.$emit('remove', tabItem, tabItem.getIndex());
            },

            /**
             * 新增简单tab
             */
            addTab: function (head, content, active) {
                var h = [
                        '<ui-tab-item head="' + head + '">',
                        content,
                        '</ui-tab-item>'
                    ],
                    $e = $(h.join(''));
                this.element.find('ul').append($e);
                $compile($e)(this.scope);
                if (active) {
                    this.showAtIndex(this.items.length - 1);
                }
            }
        };
        return function (scope, element, attrs) {
            return new Tab(scope, element, attrs);
        };
    });
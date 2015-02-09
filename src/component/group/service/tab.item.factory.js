//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiTabItemFactory', function ($compile, msg, ajax, Event) {
        var m = new msg('TabItem'),
            TabItem = function (scope, element, attrs, $content) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.content = $content ? this.wrapperContent($content) : null;
                this.attrs = attrs;
                this.scope = scope;
                this.items = [];
                this.dropdown = element.parent().hasClass('dropdown-menu');
            };
        TabItem.prototype = {

            onClickHandler: function () {
                this.$emit('uitabitem.active', this);
            },

            onActive: function (fn) {
                this.$on('uitabitem.active', fn);
            },

            /**
             *
             * @param isActive
             */
            active: function (isActive) {
                var $dom = null;
                if (this.dropdown) {
                    $dom = this.element.parent().parent();
                    //var defaultHead = $dom.data('head');
                    //if (!defaultHead) {
                    //    defaultHead = $dom.find('>a').html();
                    //    $dom.data('head', defaultHead);
                    //}
                    //if (isActive) {
                    //    $dom.find('>a').html(this.element.find('>a').html() + ' <i class="fa fa-angle-down"></i>');
                    //}
                    //else {
                    //    $dom.find('>a').html(defaultHead);
                    //}
                }
                else {
                    $dom = this.element;
                }
                $dom[isActive ? 'addClass' : 'removeClass']('active');
                return this;
            },

            /**
             *
             */
            wrapperContent: function (c) {
                return $('<div/>').addClass('tab-pane fade').append(c);
            },

            /**
             *
             */
            hide: function () {
                if (this.content) {
                    this.content.removeClass('active in');
                }
                return this;
            },

            /**
             *
             */
            show: function () {
                var defer = $.Deferred();
                if (this.content) {
                    defer.resolve(this.content);
                }
                else if (this.attrs.url) {
                    $.get(this.attrs.url, function (r) {
                        this.content = $compile(this.wrapperContent(r))(this.scope);
                        defer.resolve(this.content);
                    }.bind(this));
                }
                return defer.promise().then(function (c) {
                    c.addClass('active in');
                    return c;
                });
            }
        };
        return function (scope, element, attrs, $content) {
            return new TabItem(scope, element, attrs, $content);
        };
    });
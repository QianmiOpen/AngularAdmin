//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiMenuFactory', function (msg, ajax, Event) {
        var m = new msg('Menu'),
            Menu = function (scope, element, attrs) {
                Event.call(this);
                this.element = element;
                this.attrs = attrs;
                this.scope = scope;
                this.activeItem = null;
            };
        Menu.prototype = {

            /**
             *
             */
            init: function () {
                this.scope.activeItem = null;
                this.scope.menuItems = [];
                this.scope.onClickHandler = this.onClickHandler.bind(this);
                if (this.attrs.url) {
                    this.setUrl(this.attrs.url);
                }
            },

            /**
             *
             * @param url
             */
            setUrl: function (url) {
                ajax.get(url).then(function(data){
                    this.setData(data);
                }.bind(this));
            },

            /**
             *
             */
            setData: function (menuItems) {
                this.scope.menuItems = menuItems;
            },

            /**
             *
             * @param menuItem
             */
            onClickHandler: function(menuItem){
                if(this.scope.activeItem){
                    this.scope.activeItem.active = false;
                }
                this.scope.activeItem = menuItem;
                this.scope.activeItem.active = true;
            }
        };
        return function (s, e, a, c, t) {
            return new Menu(s, e, a, c, t);
        };
    });
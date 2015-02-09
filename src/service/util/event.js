//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('Event', function () {
        return function () {
            this.listenerMap = {};
            this.$on = function (evtName, fn) {
                var list = this.listenerMap[evtName] || [];
                list.push(fn);
                this.listenerMap[evtName] = list;
            };
            this.$emit = function (evtName) {
                var list = this.listenerMap[evtName] || [],
                    args = Array.prototype.slice.call(arguments, 1);
                $.each(list, function (index, fn) {
                    fn.apply(this, args);
                }.bind(this));
            };
        };
    });
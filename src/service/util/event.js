//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
class Event {
    constructor() {
        this.listenerMap = {};
    }

    $on(evtName, fn) {
        var list = this.listenerMap[evtName] || [];
        list.push(fn);
        this.listenerMap[evtName] = list;
    }

    $emit(evtName) {
        var list = this.listenerMap[evtName] || [],
            args = Array.prototype.slice.call(arguments, 1);
        $.each(list, function (index, fn) {
            fn.apply(this, args);
        }.bind(this));
    }
}

angular.module('admin.service')
    .service('Event', () => Event);
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin', ['admin.service', 'admin.filter', 'admin.component', 'admin.template']);

//
if($.fn.modal){
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
}

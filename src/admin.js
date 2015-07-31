//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin', ['admin.service', 'admin.filter', 'admin.component', 'admin.template'])
        .config((ajaxProvider) => {

            //
            // ajax 默认返回处理
            //
            ajaxProvider.setSuccessHandler((result) => result.type == 1 ? result.data : null);
            ajaxProvider.setFailHandler((result) => result.type != 1 ? result.data : null);
        });
})();

//
if($.fn.modal){
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
}

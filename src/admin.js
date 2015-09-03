//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin', ['admin.service', 'admin.filter', 'admin.component'])
        .config((AjaxProvider, MessageProvider, UIEditorControlProvider) => {
            let baseJsUrl = 'http://localhost:63342/AngularAdmin/output/assets/js/';

            //
            // ajax 默认返回处理
            //
            AjaxProvider.setSuccessHandler((result) => result.type == 1 ? result.data : null);
            AjaxProvider.setFailHandler((result) => result.type != 1 ? result.data : null);

            //
            // 通知位置
            //
            MessageProvider.setPosition('bottom', 'right');

            //
            // 百度编辑器的库地址
            //
            UIEditorControlProvider.setUrl(`${baseJsUrl}/ueditor/ueditor.config.js`, `${baseJsUrl}/ueditor/ueditor.all.js`);
        });
})();

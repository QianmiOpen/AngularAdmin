//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
  angular.module('admin', ['admin.service', 'admin.filter', 'admin.component', 'ui.router'])
         .constant('AdminCDN', 'http://7xllk7.com1.z0.glb.clouddn.com')
         .config((AdminCDN, AjaxProvider, MessageProvider, UIEditorControlProvider, UIUploadControlProvider, UITableControlProvider, UITreeControlProvider) => {

           //
           // ajax 默认返回处理
           //
           AjaxProvider.setHost('');
           AjaxProvider.setSuccessHandler((result) => result.type == 1 ? result.data : null);
           AjaxProvider.setFailHandler((result) => result.type != 1 ? result.data : null);

           //
           // 通知位置
           //
           MessageProvider.setPosition('bottom', 'right');

           //
           // 百度编辑器的库地址
           //
           UIEditorControlProvider.setUrl(`${AdminCDN}/assets/js/ueditor/ueditor.config.js`, `${AdminCDN}/assets/js/ueditor/ueditor.all.js`);

           //
           // 上传空间的配置
           //
           UIUploadControlProvider.setDomain('七牛域名');
           UIUploadControlProvider.setTokenUrl('七牛每次上传会调用这个URL, 返回算好的token, 然后才能上传');
           UIUploadControlProvider.setMaxSize('1mb');

           //
           // 表格配置项
           //
           UITableControlProvider.setRequestMethod('post');
           UITableControlProvider.setResultName('aaData', 'iTotalRecords');
           UITableControlProvider.setPageName('pageSize', 'pageNo');
           UITableControlProvider.setConfig({});

           //
           // 树配置项
           //
           UITreeControlProvider.setDataName('id', 'name', 'pid');
           UITreeControlProvider.setRequestMethod('post');
         });
})();

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
       .provider('Ajax', () => {
         let successHandler,
           failHandler,
           host = '',
           hook = () => {

           },
           result = {
             setSuccessHandler(handler) {
               successHandler = handler;
             },

             setFailHandler(handler) {
               failHandler = handler;
             },

             setHost(h) {
               host = h;
             },

             setHook(h) {
               hook = h;
             },

             $get($q, Util, Message) {
               let _msg = new Message('Ajax'),
                 _execute = (method, url, data) => {
                   var defer = $q.defer(),
                     opts = {
                       url: host + url, cache: false, data: data, type: method, dataType: 'json',
                       success: (resData) => {
                         var success = successHandler(resData),
                           error = failHandler(resData);
                         if (success !== undefined && success !== null) {
                           defer.resolve(success);
                         }
                         else {
                           defer.reject(error);
                         }
                       },
                       error: (xhr, status) => {
                         var errMsg = {403: '没有权限', 404: '请求的地址不存在', 500: '服务器出现了问题,请稍后重试'}[status];
                         _msg.error(errMsg || '服务器出现了问题,请稍后重试');
                       }
                     };

                   //
                   if (hook) {
                     let isIntercept = hook(opts);
                     if (isIntercept) {
                       defer.reject()
                       return
                     }
                   }

                   //
                   $.ajax(ops);
                   return defer.promise;
                 };
               return {

                 get(url, data) {
                   return _execute('GET', url, data);
                 },

                 post(url, data) {
                   return _execute('POST', url, data);
                 },

                 message(url, data, successMsg, failMsg) {
                   return this.post(url, data)
                              .then(() => _msg.success(successMsg))
                              .catch(() => _msg.error(failMsg));
                 },

                 add(url, data) {
                   return this.message(url, data, '添加数据成功', '添加数据失败');
                 },

                 update(url, data) {
                   return this.message(url, data, '更新数据成功', '更新数据失败');
                 },

                 remove(url, data, options) {
                   options = options || {};
                   return Util.confirm(`您确认删除该${options.label || '数据'}吗?`)
                              .then(() => this[options.method ? options.method : 'get'](url, data, options));
                 },

                 load(url) {
                   var $dom = $('<div/>').hide().appendTo(document.body),
                     defer = $q.defer();
                   $dom.load(url, (html) => {
                     $dom.remove();
                     defer.resolve(html);
                   });
                   return defer.promise;
                 },

                 getScript(url) {
                   return $.ajax({
                     url: url,
                     dataType: "script",
                     cache: true
                   });
                 }
               };
             }
           };
         return result;
       });
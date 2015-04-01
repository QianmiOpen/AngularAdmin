//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function ($) {


    var P = function ($q, msg) {
        this.$q = $q;
        this.m = msg;
    };
    P.prototype = {
        execute: function (method, url, data, extra) {
            extra = extra || {};
            var self = this,
                defer = extra.defer || this.$q.defer();
            $.ajax({
                url: url,
                cache: false,
                data: data,
                type: method,
                async: extra.async !== undefined ? extra.async : true,
                dataType: 'json',
                success: function (resData) {
                    if (resData.result == 'ok' || resData.result == 1 || resData.status == 1) {
                        defer.resolve(resData.data);
                    }
                    else {
                        defer.reject(resData);
                        self.m.error(resData.msg || resData.data);
                    }
                },
                error: function (xhr, status, err) {
                    switch (status) {
                        case 403:
                            self.m.error('没有权限');
                            break;
                        case 404:
                            self.m.error('请求的地址不存在');
                            break;
                        case 500:
                            self.m.error('服务器出现了问题,请稍后重试');
                            break;
                    }
                }
            });
            return defer.promise;
        }
    };

    /**
     *  导出
     */
    angular.module('admin.service')
        .factory('ajax', function ($q, msg, util) {
            var m = new msg('Ajax'),
                p = new P($q, m);


            //
            var result = {

                /**
                 * get请求
                 *      url        地址
                 *      data        数据
                 *      timeout    超时, 毫秒
                 *      extra        扩展参数
                 */
                get: function (url, data, extra) {
                    return p.execute('GET', url, data, extra);
                },

                /**
                 * post请求
                 *      同get
                 */
                post: function (url, data, extra) {
                    return p.execute('POST', url, data, extra);
                },

                /**
                 * 简单的提交根据返回结果提示信息
                 * @param url
                 * @param data
                 * @param extra
                 * @param successMsg
                 * @param failMsg
                 * @returns {promise}
                 */
                message: function (url, data, extra, successMsg, failMsg) {
                    var defer = $q.defer();
                    this.post.apply(this, arguments).then(
                        function (json) {
                            m.success(successMsg);
                            defer.resolve(json);
                        }, function (json) {
                            m.error(failMsg);
                            defer.reject(json);
                        });
                    return defer.promise;
                },

                /**
                 * 新增
                 */
                add: function (url, data, extra) {
                    return this.message(url, data, extra, '添加数据成功', '添加数据失败');
                },

                /**
                 * 更新
                 */
                update: function (url, data, extra) {
                    return this.message(url, data, extra, '更新数据成功', '更新数据失败');
                },

                /**
                 * 删除
                 */
                remove: function (url, data, options, extra) {
                    var defer = $q.defer(),
                        self = this;
                    options = options || {};
                    options.defer = defer;
                    util.confirm("您确认删除该" + (options.label || '数据') + "吗？").then(function () {
                        self.message(url, data, extra, '删除数据成功', '删除数据失败').then(
                            function(){defer.resolve();}
                        );
                    });
                    return defer.promise;
                }
            };
            return result;
        });
})(jQuery);
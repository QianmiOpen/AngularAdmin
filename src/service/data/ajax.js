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
            result = {
                setSuccessHandler(handler) {
                    successHandler = handler;
                },

                setFailHandler(handler) {
                    failHandler = handler;
                },

                $get($q, Util, Message) {
                    let _msg = new Message('Ajax'),
                        _execute = (method, url, data) => {
                            var defer = $q.defer();
                            $.ajax({
                                url: url, cache: false, data: data, type: method, dataType: 'json',
                                success: (resData) => {
                                    var success = successHandler(resData),
                                        error = failHandler(resData);
                                    if (success) {
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
                            });
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
                            return util.confirm(`您确认删除该${options.label || '数据'}吗?`)
                                .then(() => this.message(url, data, '删除数据成功', '删除数据失败'));
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
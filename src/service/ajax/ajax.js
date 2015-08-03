//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
class Ajax {
    constructor(q, util, provider) {
        this.q = q;
        this.msg = new Message("Ajax");
        this.util = util;
        this.provder = provider;
    }

    _execute(method, url, data) {
        var defer = this.q.defer();
        $.ajax({
            url: url, cache: false, data: data, type: method, dataType: 'json',
            success: (resData) => {
                var success = this.provider.successHandler(resData),
                    error = this.provder.failHandler(resData);
                if (success) {
                    defer.resolve(success);
                }
                else {
                    defer.resolve(error);
                }
            },
            error: (xhr, status) => {
                var errMsg = {403: '没有权限', 404: '请求的地址不存在', 500: '服务器出现了问题,请稍后重试'}[status];
                this.msg.error(errMsg || '服务器出现了问题,请稍后重试');
            }
        });
        return defer.promise;
    }

    get(url, data) {
        return this._execute('GET', url, data);
    }

    post(url, data) {
        return this._execute('POST', url, data);
    }

    message(url, data, successMsg, failMsg) {
        return this.post(url, data)
            .then(() => this.msg.success(successMsg))
            .catch(() => this.msg.error(failMsg));
    }

    add(url, data) {
        return this.message(url, data, '添加数据成功', '添加数据失败');
    }

    update(url, data) {
        return this.message(url, data, '更新数据成功', '更新数据失败');
    }

    remove(url, data, options) {
        return this.util.confirm(`您确认删除该${options.label || '数据'}吗?`)
            .then(() => this.message(url, data, '删除数据成功', '删除数据失败'));
    }
}

class AjaxProvider {

    setSuccessHandler(handler) {
        this.successHandler = handler;
    }

    setFailHandler(handler) {
        this.failHandler = handler;
    }

    $get($q, util) {
        return new Ajax($q, util, this);
    }
}

angular.module('admin.service')
    .provider('ajax', AjaxProvider)
    .provider('Ajax', AjaxProvider);
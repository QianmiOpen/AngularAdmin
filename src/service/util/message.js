//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
if (window.toastr) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-center",
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}
else {
    console.error('需要 toastr库 支持, 请导入...');
}

class Message {
    constructor(className) {
        this.className = className ? className + ': ' : '';
    }

    success(msg, title) {
        Message.success(this.className + msg, title);
    }

    static success(msg, title) {
        title = title || '成功';
        toastr.success((this.className || '') + msg, title);
    }

    info(msg, title) {
        Message.info(this.className + msg, title);
    }

    static info(msg, title) {
        title = title || '消息';
        toastr.info((this.className || '') + msg, title);
    }

    warning(msg, title) {
        Message.warning(this.className + msg, title);
    }

    static warning(msg, title) {
        title = title || '警告';
        toastr.warning(msg, title);
    }

    error(msg, title) {
        Message.error(this.className + msg, title);
    }

    static error(msg, title) {
        title = title || '错误';
        toastr.error(msg, title);
    }
}

class MessageProvider {

    setPostion(v, h) {
        toastr.options.positionClass = 'toast-' + v + '-' + h;
    }

    $get() {
        return Message;
    }
}

/**
 * 导出
 */
angular.module('admin.service')
    .provider('msg', MessageProvider)
    .provider('Message', MessageProvider);
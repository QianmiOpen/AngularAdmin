//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
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

    /**
     *
     * @param className
     * @constructor
     */
    var P = function (className) {
        this.className = className ? '[' + className + ']' : '';
    };
    $.each(['success', 'info', 'warning', 'error'], function (i, item) {
        P[item] = function (t, m) {
            var msg = m ? m : t,
                title = m ? t : ['成功', '提示', '警告', '错误'][i];
            toastr[item]((this.className || '') + ': ' + msg, title);
        };
    });
    P.prototype = P; //保险实例有单例的方法


    /**
     * 导出
     */
    angular.module('admin.service')
        .provider('msg', function () {
            return {

                /**
                 * 设置位置
                 */
                setPostion: function (v, h) {
                    toastr.options.positionClass = 'toast-' + v + '-' + h;
                },

                /**
                 *
                 * @returns {Function}
                 */
                $get: function () {
                    return P;
                }
            }
        });
})();

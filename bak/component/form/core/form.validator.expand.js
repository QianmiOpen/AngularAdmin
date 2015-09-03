//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    if (!jQuery.validator) {
        return;
    }

    jQuery.validator.addMethod("url", function (value, element) {
        var reg = /^(http|https):\/\//;
        return this.optional(element) || (reg.test(value));
    }, "链接地址必须以http://或者https://开头！");

//新增广告时间
    jQuery.validator.addMethod("dateRange", function (value, element, params) {
        var formDate = moment(value),
            toDate = moment($(this.currentForm).find('[name="terminatetime"]').val());
        return formDate.isBefore(toDate);
    }, '时间范围不正确');

    jQuery.validator.addMethod("maxlength", function (value, element, param) {
        var maxlength = 0;
        if (param && param > 0) {
            maxlength = param;
        }
        return this.optional(element) || value.replace(/[^\x00-\xff]/gi, "--").length <= maxlength;
    }, "请输入一个长度最多是 {0} 的字符串（中文文字按照2个字符计算）");

    jQuery.validator.addMethod("minlength", function (value, element, param) {
        var minLength = 0;
        if (param && param > 0) {
            minLength = param;
        }
        return this.optional(element) || value.replace(/[^\x00-\xff]/gi, "--").length >= minLength;
    }, "请输入一个长度最少是 {0} 的字符串（中文文字按照2个字符计算）");


    jQuery.validator.addMethod("rangelength", function (value, element, params) {
        var minLength = 0;
        var maxLength = 0;
        if (params && params[0] > 0) {
            minLength = params[0];
        }
        if (params && params[1] > 0) {
            maxLength = params[1];
        }
        var length = value.replace(/[^\x00-\xff]/gi, "--").length;
        return length <= maxLength && length >= minLength;
    }, "请输入一个长度介于 {0} 和 {1} 之间的字符串（中文文字按照2个字符计算）");

    jQuery.validator.addMethod("mobile", function (value, element) {
        var length = value.length;
        var tel = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return this.optional(element) || (length == 11 && tel.test(value));
    }, "手机号码不正确");
// 密码
    jQuery.validator.addMethod("pwdRule", function (value, element) {
        var reg = /^(?![0-9]+$)(?![a-z]+$)(?![0-9a-z]+$)(?![\~\)\!@#\$%^&\*\(\)_\+\-=\{\}\[\]|:;<>\?,\.\/]+$)[0-9A-Za-z\~\)\!@#\$%^&\*\(\)_\+\-=\{\}\[\]|:;<>\?,\.\/]{8,16}$/;
        return this.optional(element) || reg.test(value);
    }, "密码由8-16位字母、数字和特殊字符组成，且至少有一个大写字母或者特殊字符！");
})(jQuery);
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
var Event = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
    function Event() {
        this.listenerMap = {};
    }DP$0(Event,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.$on = function(evtName, fn) {
        var list = this.listenerMap[evtName] || [];
        list.push(fn);
        this.listenerMap[evtName] = list;
    };

    proto$0.$emit = function(evtName) {
        var list = this.listenerMap[evtName] || [],
            args = Array.prototype.slice.call(arguments, 1);
        $.each(list, function (index, fn) {
            fn.apply(this, args);
        }.bind(this));
    };
MIXIN$0(Event.prototype,proto$0);proto$0=void 0;return Event;})();
var ComponentEvent = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;function ComponentEvent() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(ComponentEvent, super$0);if(super$0!==null)SP$0(ComponentEvent,super$0);ComponentEvent.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ComponentEvent,"configurable":true,"writable":true}});DP$0(ComponentEvent,"prototype",{"configurable":false,"enumerable":false,"writable":false});var proto$0={};

    proto$0.triggerComplete = function(scope, ref, component) {
        scope[ref] = component;
        scope.$emit('componentComplete', {ref: ref, component: component});
    };

    proto$0.getComponent = function(scope, element, defaultRef) {
        var ref = element.attr('ref') || defaultRef;
        return scope[ref];
    };
MIXIN$0(ComponentEvent.prototype,proto$0);proto$0=void 0;return ComponentEvent;})(Event);
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.filter', []);

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service', []);

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .provider('Ajax', function()  {
        var successHandler,
            failHandler,
            result = {
                setSuccessHandler: function(handler) {
                    successHandler = handler;
                },

                setFailHandler: function(handler) {
                    failHandler = handler;
                },

                $get: function($q, Util, Message) {
                    var _msg = new Message('Ajax'),
                        _execute = function(method, url, data)  {
                            var defer = $q.defer();
                            $.ajax({
                                url: url, cache: false, data: data, type: method, dataType: 'json',
                                success: function(resData)  {
                                    var success = successHandler(resData),
                                        error = failHandler(resData);
                                    if (success) {
                                        defer.resolve(success);
                                    }
                                    else {
                                        defer.reject(error);
                                    }
                                },
                                error: function(xhr, status)  {
                                    var errMsg = {403: '没有权限', 404: '请求的地址不存在', 500: '服务器出现了问题,请稍后重试'}[status];
                                    _msg.error(errMsg || '服务器出现了问题,请稍后重试');
                                }
                            });
                            return defer.promise;
                        };
                    return {

                        get: function(url, data) {
                            return _execute('GET', url, data);
                        },

                        post: function(url, data) {
                            return _execute('POST', url, data);
                        },

                        message: function(url, data, successMsg, failMsg) {
                            return this.post(url, data)
                                .then(function()  {return _msg.success(successMsg)})
                                .catch(function()  {return _msg.error(failMsg)});
                        },

                        add: function(url, data) {
                            return this.message(url, data, '添加数据成功', '添加数据失败');
                        },

                        update: function(url, data) {
                            return this.message(url, data, '更新数据成功', '更新数据失败');
                        },

                        remove: function(url, data, options) {var this$0 = this;
                            return util.confirm((("您确认删除该" + (options.label || '数据')) + "吗?"))
                                .then(function()  {return this$0.message(url, data, '删除数据成功', '删除数据失败')});
                        },

                        getScript: function(url) {
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
var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};//-----------------------------------------------------------------------------------------------
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

var Message = (function(){"use strict";var static$0={},proto$0={};
    function Message(className) {
        this.className = className ? className + ': ' : '';
    }DP$0(Message,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.success = function(msg, title) {
        Message.success(this.className + msg, title);
    };

    static$0.success = function(msg, title) {
        title = title || '成功';
        toastr.success((this.className || '') + msg, title);
    };

    proto$0.info = function(msg, title) {
        Message.info(this.className + msg, title);
    };

    static$0.info = function(msg, title) {
        title = title || '消息';
        toastr.info((this.className || '') + msg, title);
    };

    proto$0.warning = function(msg, title) {
        Message.warning(this.className + msg, title);
    };

    static$0.warning = function(msg, title) {
        title = title || '警告';
        toastr.warning(msg, title);
    };

    proto$0.error = function(msg, title) {
        Message.error(this.className + msg, title);
    };

    static$0.error = function(msg, title) {
        title = title || '错误';
        toastr.error(msg, title);
    };
MIXIN$0(Message,static$0);MIXIN$0(Message.prototype,proto$0);static$0=proto$0=void 0;return Message;})();

var MessageProvider = (function(){"use strict";function MessageProvider() {}DP$0(MessageProvider,"prototype",{"configurable":false,"enumerable":false,"writable":false});var proto$0={};

    proto$0.setPostion = function(v, h) {
        toastr.options.positionClass = 'toast-' + v + '-' + h;
    };

    proto$0.$get = function() {
        return Message;
    };
MIXIN$0(MessageProvider.prototype,proto$0);proto$0=void 0;return MessageProvider;})();

/**
 * 导出
 */
angular.module('admin.service')
    .provider('msg', MessageProvider)
    .provider('Message', function()  {
        var result = {
            setPosition: function(v, h) {
                toastr.options.positionClass = 'toast-' + v + '-' + h;
            },

            $get: function() {
                var Message = (function(){var static$0={},proto$0={};
                    function Message(className) {
                        this.className = className ? className + ': ' : '';
                    }DP$0(Message,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                    proto$0.success = function(msg, title) {
                        Message.success(this.className + msg, title);
                    };

                    static$0.success = function(msg, title) {
                        title = title || '成功';
                        toastr.success((this.className || '') + msg, title);
                    };

                    proto$0.info = function(msg, title) {
                        Message.info(this.className + msg, title);
                    };

                    static$0.info = function(msg, title) {
                        title = title || '消息';
                        toastr.info((this.className || '') + msg, title);
                    };

                    proto$0.warning = function(msg, title) {
                        Message.warning(this.className + msg, title);
                    };

                    static$0.warning = function(msg, title) {
                        title = title || '警告';
                        toastr.warning(msg, title);
                    };

                    proto$0.error = function(msg, title) {
                        Message.error(this.className + msg, title);
                    };

                    static$0.error = function(msg, title) {
                        title = title || '错误';
                        toastr.error(msg, title);
                    };
                MIXIN$0(Message,static$0);MIXIN$0(Message.prototype,proto$0);static$0=proto$0=void 0;return Message;})();
                return Message;
            }
        };
        return result;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var defaultOpt = {
        'type': 'keydown',
        'propagate': false,
        'inputDisabled': false,
        'keyCode': false
    };

    var shift_nums = {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
    };
    var special_keys = {
        'esc': 27,
        'escape': 27,
        'tab': 9,
        'space': 32,
        'return': 13,
        'enter': 13,
        'backspace': 8,

        'scrolllock': 145,
        'scroll_lock': 145,
        'scroll': 145,
        'capslock': 20,
        'caps_lock': 20,
        'caps': 20,
        'numlock': 144,
        'num_lock': 144,
        'num': 144,

        'pause': 19,
        'break': 19,

        'insert': 45,
        'home': 36,
        'delete': 46,
        'end': 35,

        'pageup': 33,
        'page_up': 33,
        'pu': 33,

        'pagedown': 34,
        'page_down': 34,
        'pd': 34,

        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,

        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    };

    var Shortcut = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
        function Shortcut($window, $timeout) {
            this.window = $window;
            this.timeout = $timeout;
            this.keyboardEvent = {};
        }DP$0(Shortcut,"prototype",{"configurable":false,"enumerable":false,"writable":false});

        proto$0.bind = function(label, callback, opt) {
            opt = $.extend({}, defaultOpt, opt);
            label = label.toLowerCase();
            var el = opt && opt.target ? opt.target : this.window.document;
            this.keyboardEvent[label] = {
                callback: this.handler,
                target: el,
                event: opt['type'],
                opt: opt
            };
            $(el).bind(opt.type, this.handler.bind(this, callback, label));
        };

        proto$0.unbind = function(label) {
            label = label.toLowerCase();
            var binding = this.keyboardEvent[label];
            delete(this.keyboardEvent[label]);
            if (!binding)
                return;
            var type = binding['event'],
                elt = binding['target'],
                callback = binding['callback'];
            $(elt).unbind(type, callback);
        };

        proto$0.handler = function(callback, label, evt) {
            var opt = this.keyboardEvent[label];

            //输入框不监听
            if (opt.inputDisabled) {
                var elt = evt.target;
                if (elt.tagName == 'INPUT' || elt.tagName == 'TEXTAREA') return;
            }

            //
            var character = String.fromCharCode(evt.keyCode).toLowerCase();
            if (code == 188)
                character = ",";
            if (code == 190)
                character = ".";

            //
            var keys = label.split("+");
            var kp = 0;

            //
            var modifiers = {
                shift: {
                    wanted: false,
                    pressed: evt.shiftKey ? true : false
                },
                ctrl: {
                    wanted: false,
                    pressed: evt.ctrlKey ? true : false
                },
                alt: {
                    wanted: false,
                    pressed: evt.altKey ? true : false
                }
            };
            for (var i = 0, l = keys.length, k; k = keys[i], i < l; i++) {
                switch (k) {
                    case 'ctrl':
                    case 'control':
                        kp++;
                        modifiers.ctrl.wanted = true;
                        break;
                    case 'shift':
                    case 'alt':
                    case 'meta':
                        kp++;
                        modifiers[k].wanted = true;
                        break;
                }

                if (k.length > 1) {
                    if (special_keys[k] == code) kp++;
                } else if (opt['keyCode']) {
                    if (opt['keyCode'] == code) kp++;
                } else {
                    if (character == k) kp++;
                    else {
                        if (shift_nums[character] && e.shiftKey) {
                            character = shift_nums[character];
                            if (character == k) kp++;
                        }
                    }
                }
            }

            if (kp == keys.length &&
                modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                modifiers.shift.pressed == modifiers.shift.wanted &&
                modifiers.alt.pressed == modifiers.alt.wanted &&
                modifiers.meta.pressed == modifiers.meta.wanted) {
                this.timeout(function () {
                    callback(e);
                }, 1);

                if (opt.propagation) {
                    evt.stopPropagation();
                }
            }

        };
    MIXIN$0(Shortcut.prototype,proto$0);proto$0=void 0;return Shortcut;})();


    angular.module('admin.service')
        .factory('Shortcut', Shortcut);
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('Util', function ($rootScope, $compile, $filter, $parse, $q) {
        return {

            /**
             *
             * @param date
             * @param format
             * @returns {*}
             */
            dateFormatStr: function (date, format) {
                return $filter('date')(date || new Date(), format);
            },
            dateTimeStr: function (date) {
                return this.dateFormatStr(date, 'yyyy-MM-dd HH:mm:ss');
            },
            dateStr: function (date, format) {
                return this.dateFormatStr(date, 'yyyy-MM-dd');
            },
            timeStr: function (date, format) {
                return this.dateFormatStr(date, 'HH:mm:ss');
            },

            /**
             * 给元素加特效, 需要animate.css的支持
             * @param $el
             * @param animateCssName
             * @param isCompleteRemove
             */
            animate: function ($el, animateCssName, isCompleteRemove) {
                isCompleteRemove = isCompleteRemove !== undefined ? isCompleteRemove : true;
                $el.addClass(animateCssName + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    isCompleteRemove && $(this).removeClass(animateCssName + ' animated');
                });
            },

            /**
             * 设置组件的tag值
             * @param tagName
             * @param tagObj
             * @param $scope
             */
            setTag: function (tagName, tagObj, $scope) {
                $scope.$emit('ui.completeInit', tagName, tagObj);
            },

            /**
             * 给scope的属性设值, 支持表达式
             * @param scope
             * @param express
             * @param value
             */
            setValue: function (scope, express, value) {
                var m = express.split('.');
                if (m.length > 1) {
                    var t = m.splice(m.length - 1, m.length).join('');
                    var p = m.join('.');
                    var o = $parse(p)(scope);
                    o[t] = value;
                }
                else {
                    scope[express] = value;
                }
            },

            /**
             * 获取表达式的值
             * @param scope
             * @param exporess
             */
            getValue: function (scope, exporess) {
                return $parse(exporess)(scope);
            },

            /**
             * 针对非标准字符串转JSON
             * @param str
             */
            toJSON: function (str) {
                return eval((("(" + str) + ")"));
            },

            /**
             * 根据提供的scope, 转换一个新的scope, 并且复值
             * @param others
             * @param parentScope
             * @returns ee
             */
            toScope: function (others, parentScope) {
                parentScope = parentScope || $rootScope;
                return $.extend(parentScope.$new(), others || {});
            },

            /**
             * 模板 + scope -> element
             * @param str
             * @param scope
             * @returns ee
             */
            format: function (str, scope) {
                var $e = $compile(str)(scope);
                return $e;
            },

            /**
             * 确认框
             * @param msg
             * @returns {promise}
             */
            confirm: function (msg) {
                if (bootbox) {
                    var def = $q.defer();
                    bootbox.confirm(msg, function (result) {
                        result ? def.resolve() : def.reject();
                    });
                    return def.promise;
                }
                else {
                    throw new Error('需要 bootbox库 支持, 请导入....');
                }
            },

            /**
             * 使用jquery validate验证json数据
             */
            checkValuesUseRules: function (jsonData, jsonRules) {
                var $form = $('<form></form>'),
                    $inputs = [];
                $.each(jsonData, function (name, val) {     //逐一创建input添加到form里面
                    var $input = $('<input>').attr('name', name).val(val);
                    $inputs.push($input);
                    $form.append($input);
                });
                var validator = $form.validate({rules: jsonRules, debug: true, submitHandler: function () {
                        return false;
                    }}),
                    errName = null,
                    errMsg = null;
                $.each($inputs, function (i, $input) {  //逐一验证, 只要发现错误, 直接跳出
                    if (!validator.check($input)) {
                        errName = $input.attr('name');
                        return false;
                    }
                });
                return errName ? validator.errorMap[errName] : null;
            },

            /**
             * 检测单个数据
             * @param name
             * @param value
             * @param rules
             * @returns {*}
             */
            checkValueUseRules: function(name, value, rules){
                var jsonData = {},
                    jsonRules = {};
                jsonData[name] = value;
                jsonRules[name] = rules;
                return this.checkValuesUseRules(jsonData, jsonRules);
            }
        };
    });
/**
 *
 */
(function () {

    var ValueService = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

        function ValueService($parse) {
            this.$parse = $parse;
        }DP$0(ValueService,"prototype",{"configurable":false,"enumerable":false,"writable":false});

        proto$0.set = function(scope, express, value) {
            var getter = this.$parse(express);
            getter.assign(scope, value);
            if (!scope.$$phase) {
                scope.$apply();
            }
        };

        proto$0.get = function(scope, express) {
            var getter = this.$parse(express);
            return getter(scope);
        };
    MIXIN$0(ValueService.prototype,proto$0);proto$0=void 0;return ValueService;})();

    angular.module('admin.service')
        .service('ValueService', ValueService);
})();

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component', []);
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormItem', function (componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, controller, tranclude) {
                element.find('>div').append(tranclude(scope));
                element.removeAttr('name').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.item', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .constant('defaultCol', '2:10')
    .directive('uiForm', function (UIFormControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            transclude: true,
            compile: function () {
                var form = null;
                return {
                    pre: function (scope, element, attrs, controller, transclude) {
                        form = new UIFormControl(scope, element, attrs, transclude(scope));
                    },
                    post: function () {
                        form.layout();
                        setTimeout(function () {
                            form.initValidation();
                        }, 300);
                    }
                };
            },
            templateUrl: 'tpl.form'
        };
    });



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
/**
 * 表单控件
 */
var UIFormControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIFormControl, super$0);var proto$0={};
    function UIFormControl(scope, element, attrs) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
        this.isSearchControl = element.parents('.ui-search-form').length > 0;
        this.formPrefix = this.isSearchControl ? '$search' : '$form';
        this.formResetEventName = this.isSearchControl ? 'uisearchform.reset' : 'uiform.reset';
        this.init();
        this.initEvents();
        this.cleanElement();
        this.render();
    }if(super$0!==null)SP$0(UIFormControl,super$0);UIFormControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIFormControl,"configurable":true,"writable":true}});DP$0(UIFormControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.init = function() {
        this.message = new Message('UI' + (this.formPrefix + this.className));
        this.scope.lcol = this.scope.lcol !== undefined ? this.scope.lcol : 2;
        this.scope.rcol = this.scope.rcol !== undefined ? this.scope.rcol : 10;
        this.triggerComplete(this.scope, this.attrs.ref || (this.formPrefix + this.className), this);
    };

    proto$0.initEvents = function() {var this$0 = this;
        this.scope.$on(this.formResetEventName, function()  {return this$0.reset()});
    };

    proto$0.cleanElement = function() {
        this.element.removeAttr('name').removeAttr('model').removeAttr('readonly').removeAttr('disabled');
    };

    proto$0.attr = function(k, v) {
        if (this.formEl) {
            if (k && v) {
                this.formEl.prop(k, v);
                return this;
            }
            else {
                return this.formEl.prop(k);
            }
        }
    };

    proto$0.val = function(v) {
        if (this.formEl) {
            if (v !== undefined) {
                this.formEl.val(v);
                return this;
            }
            else {
                return this.formEl.val();
            }
        }
    };

    proto$0.destroy = function() {
        delete this.listenerMap;
        this.reset();
    };

    proto$0.change = function(fn) {
        this.$on('change', fn);
    };

    proto$0.render = function() {
    };

    proto$0.reset = function() {
        if (this.formEl) {
            this.formEl.val('');
        }
    };
MIXIN$0(UIFormControl.prototype,proto$0);proto$0=void 0;return UIFormControl;})(ComponentEvent);


angular.module('admin.component')
    .factory('uiFormControl', function()  {return UIFormControl});
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIDateControl', function()  {
            var UIDateControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIDateControl, super$0);var proto$0={};
                function UIDateControl(s, e, a) {
                    this.className = 'Date';
                    this.formEl = e.find('input');
                    this.dateMode = a.mode ? a.mode.indexOf('date') != -1 : true;
                    this.timeMode = a.mode ? a.mode.indexOf('time') != -1 : true;
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIDateControl,super$0);UIDateControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIDateControl,"configurable":true,"writable":true}});DP$0(UIDateControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);
                    var format = [];
                    if (this.dateMode)
                        format.push('yyyy-MM-dd');
                    if (this.timeMode)
                        format.push('HH:mm:ss');
                    this.format = format.join(' ');
                };

                proto$0.initEvents = function() {
                    super$0.prototype.initEvents.call(this);
                };

                proto$0.render = function(){
                    this.formEl.datetimepicker({
                        language: 'zh-CN',
                        pickDate: this.dateMode,
                        useCurrent: false,
                        pickTime: this.timeMode,
                        useSeconds: this.timeMode
                    });
                };
            MIXIN$0(UIDateControl.prototype,proto$0);proto$0=void 0;return UIDateControl;})(UIFormControl);

            return UIDateControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var uiDateRangeDefaultRange = {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
        '最近7天': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
        '最近30天': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')],
        '当前月': [moment().startOf('month'), moment().endOf('month')],
        '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
        '最近六个月': [moment().subtract('days', 182).startOf('day'), moment().endOf('day')]
    };

    var uiDateRangeDefaultConfig = {
        opens: ('right'),
        minDate: moment().subtract('year', 40).startOf('year'),
        maxDate: moment().add('year', 10).endOf('year'),
        showDropdowns: true,
        showWeekNumbers: false,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'green',
        cancelClass: 'default',
        separator: ' - ',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            resetLabel: '重置',
            fromLabel: '从',
            toLabel: '至',
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    };


    angular.module('admin.component')
        .factory('UIDateRangeControl', function()  {
            var UIDateRangeControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIDateRangeControl, super$0);var proto$0={};
                function UIDateRangeControl(s, e, a) {
                    this.className = 'DateRange';
                    this.startDateElement = e.find('.input-group').find('input:first');
                    this.endDateElement = e.find('.input-group').find('input:last');

                    this.hasDefaultDateRange = !!a.range;
                    this.isDateTimeMode = a.mode !== 'date' || a.time !== undefined;
                    this.format = a.format || (this.isDateTimeMode ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');

                    this.limit = a.limit;
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIDateRangeControl,super$0);UIDateRangeControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIDateRangeControl,"configurable":true,"writable":true}});DP$0(UIDateRangeControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);

                    //默认值
                    var dateRange = uiDateRangeDefaultRange[this.attrs.range] || [];
                    this.defaultStartDate = this.attrs.fromValue || dateRange[0];
                    this.defaultEndDate = this.attrs.toValue || dateRange[1];

                    //
                    this.config = $.extend({}, uiDateRangeDefaultConfig, {
                        ranges: uiDateRangeDefaultRange,
                        timePicker: this.isDateTimeMode,
                        format: this.format
                    });

                    //要小心设置这个值
                    if (this.limit) {
                        this.config.dateLimit = {days: this.limit};
                    }

                    //默认值
                    if (this.hasDefaultDateRange) {
                        this.config.startDate = this.defaultStartDate;
                        this.config.endDate = this.defaultEndDate;
                    }
                };

                proto$0.render = function() {var this$0 = this;
                    this.element.find("div").daterangepicker(this.config, function(startVal, endVal)  {
                        startVal = startVal ? startVal.format(this$0.format) : "";
                        endVal = endVal ? endVal.format(this$0.format) : "";
                        this$0.val(startVal, endVal);
                        this$0.scope.change({startVal: startVal, endVal: endVal});
                    });
                };

                proto$0.reset = function() {
                    this.startDateElement.val('');
                    this.endDateElement.val('');
                };

                proto$0.val = function(sv, ev) {
                    if (sv) {
                        this.startDateElement.val(sv);
                    }
                    if (ev) {
                        this.endDateElement.val(ev);
                    }
                    if (!sv && !ev) {
                        return [this.startDateElement.val(), this.endDateElement.val()];
                    }
                    else {
                        return this;
                    }
                };
            MIXIN$0(UIDateRangeControl.prototype,proto$0);proto$0=void 0;return UIDateRangeControl;})(UIFormControl);

            return UIDateRangeControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .provider('UIEditorControl', function()  {
            var configUrl, allUrl,
                result = {
                    setUrl: function(_configUrl, _allUrl) {
                        configUrl = _configUrl;
                        allUrl = _allUrl;
                    },

                    $get: function() {
                        var UIEditorControl = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIEditorControl, super$0);var proto$0={};

                            function UIEditorControl(s, e, a) {
                                this.className = 'Editor';
                                this.$scriptElement = e.find('script');
                                super$0.call(this, s, e, a);
                            }if(super$0!==null)SP$0(UIEditorControl,super$0);UIEditorControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIEditorControl,"configurable":true,"writable":true}});DP$0(UIEditorControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                            proto$0.init = function() {
                                super$0.prototype.init.call(this);
                                this.editorId = 'uiFromEditor' + new Date().getTime();
                                this.$scriptElement.attr('id', this.editorId);
                            };

                            proto$0.render = function() {var this$0 = this;
                                super$0.prototype.render.call(this);
                                if (window.UE) {
                                    this._initEditor();
                                }
                                else {
                                    $.getScript(configUrl, function()  {
                                        $.getScript(allUrl, function()  {
                                            this$0._initEditor();
                                        });
                                    });
                                }
                            };

                            proto$0.reset = function() {
                                this.editor.setContent('');
                            };

                            proto$0.val = function(val) {
                                if (val !== undefined) {
                                    this.editor.setContent(val);
                                    return this;
                                }
                                else {
                                    return this.editor.getContent();
                                }
                            };

                            proto$0.getEditor = function() {
                                return this.editor;
                            };

                            proto$0._initEditor = function() {var this$0 = this;
                                this.editor = UE.getEditor(this.editorId, {
                                    autoHeightEnabled: true
                                });
                                this.editor.addListener('contentChange', function()  {
                                    this$0._change();
                                });
                            };

                            proto$0._change = function() {
                                var content = this.val();
                                this.scope.model = content;
                                this.scope.change({val: content});
                            };
                        MIXIN$0(UIEditorControl.prototype,proto$0);proto$0=void 0;return UIEditorControl;})(UIFormControl);
                        return UIEditorControl;
                    }
                };
            return result;
        });
})();
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
(function () {

    var defaultFormValidateConfig = {
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: '',
        rules: {},
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        success: function (label, element) {
            label.closest('.form-group').removeClass('has-error');
        },
        errorPlacement: function (error, element, message) {
            $(error).appendTo($(element).parent());
        }
    };

    angular.module('admin.component')
        .factory('UIFormControl', function()  {
            var UIFormControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIFormControl, super$0);var proto$0={};

                function UIFormControl(s, e, a, formItems) {
                    this.className = 'form';
                    this.action = this.attrs.action.replace(/#/g, '');
                    this.formItems = formItems;
                    this.formControlMap = {};
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIFormControl,super$0);UIFormControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIFormControl,"configurable":true,"writable":true}});DP$0(UIFormControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {var this$0 = this;
                    super$0.prototype.init.call(this);
                    this.scope.$on('componentComplete', function(evt, o)  {
                        this$0.formControlMap[o.name] = o.component;
                    });
                };

                proto$0.initEvents = function() {
                    super$0.prototype.initEvents.call(this);
                };

                proto$0.changeValidateRule = function(ruleName, ruleConfig) {
                    var validator = this.element.data().validator;
                    if (validator) {
                        var oldConfig = validator.settings.rules[ruleName];
                        validator.settings.rules[ruleName] = $.extend(oldConfig, ruleConfig);
                    }
                };

                proto$0.startValidate = function() {
                    this.element.valid();
                };

            MIXIN$0(UIFormControl.prototype,proto$0);proto$0=void 0;return UIFormControl;})(UIFormControl);
            return UIFormControl;
        })
        .constant('uiFormValidateConfig', {
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            ignore: '',
            rules: {},
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            success: function (label, element) {
                label.closest('.form-group').removeClass('has-error');
            },
            errorPlacement: function (error, element, message) {
                $(error).appendTo($(element).parent());
            }
        })
        .factory('uiFormFactory', function (msg, ajax, uiFormValidateConfig, uiFormControl) {
            var m = new msg('Form'),
                Form = function (scope, element, attrs, formItems) {
                    this.column = attrs.column;
                    this.formItems = formItems;
                    this.formControlMap = {};
                    this.action = attrs.action.replace(/#/g, '');
                    this.formName = attrs.formName;
                    uiFormControl.apply(this, arguments);
                };
            Form.prototype = $.extend(new uiFormControl(), {

                /**
                 *
                 * @private
                 */
                _init: function () {
                    this.scope.$on('componentComplete', function (evt, o) {
                        if (o && o.name) {
                            this.formControlMap[o.name] = o;
                        }
                    }.bind(this));
                },

                /**
                 *
                 */
                changeValidateRule: function (ruleName, ruleConfig) {
                    var validator = this.element.data().validator;
                    if (validator) {
                        var oldConfig = validator.settings.rules[ruleName];
                        validator.settings.rules[ruleName] = $.extend(oldConfig, ruleConfig);
                    }
                },

                /**
                 *
                 */
                startValidate: function () {
                    this.element.valid();
                },

                /**
                 *
                 */
                addFormItem: function (formItem) {
                    this.formItems.push(formItem);
                    this.layout();
                },

                /**
                 *
                 */
                formItemVal: function (formItemName, value) {
                    var $el = this.element.find('[name="' + formItemName + '"]');
                    if (value) {
                        $el.val(value);
                    }
                    else {
                        return $el.val();
                    }
                },

                /**
                 * 根据column进行布局
                 */
                layout: function (column) {
                    column = parseInt(column !== undefined ? column : this.column);
                    if (column > 1) {
                        var eachColumn = 12 / column,
                            $body = this.element.find(' > div'),
                            doms = []; //没列占多少
                        $body.html();
                        var i, dom;
                        for (i = 0; i < this.formItems.length; i++) { //过滤一下
                            dom = this.formItems[i];
                            if (dom.innerHTML !== undefined) {
                                if (dom.type == 'hidden') {
                                    $body.append(dom);
                                }
                                else {
                                    doms.push(dom);
                                }
                            }
                        }
                        var otherHandler = function (i, dom) {
                            $body.append(dom);
                        };
                        for (i = 0; i < doms.length; i = i + column) {
                            var $rowDom = $('<div/>').addClass('row'),
                                tempI = i,
                                tempColumn = i,
                                other = [];
                            while (tempColumn < tempI + column && doms[tempColumn]) {
                                dom = doms[tempColumn];
                                if (dom.className.indexOf('row') != -1) {
                                    other.push(dom);
                                    i++; //多用了一个
                                    tempI++;
                                }
                                else {
                                    var $cellDom = $('<div/>').addClass('col-md-' + eachColumn);
                                    $cellDom.append(doms[tempColumn]);
                                    $rowDom.append($cellDom);
                                }
                                tempColumn++;
                            }
                            $body.append($rowDom);
                            $.each(other, otherHandler);
                        }
                    }
                    else {
                        this.element.find(' > div').append(this.formItems);
                    }
                },

                /**
                 *
                 */
                initValidation: function () {
                    if (this.action) {  //推荐用心的
                        $.getJSON('/validator?action=' + this.action, function (rules) {
                            this.setRules(rules);
                        }.bind(this));
                    }
                    else if (this.formName) { //这是老的, 不要这样啊啊
                        $.getJSON('/validator?cm=' + this.formName, function (rules) {
                            this.setRules(rules);
                        }.bind(this));
                    }
                    else if (this.attrs.validateUrl) {
                        $.getJSON(this.attrs.validateUrl, function (rules) {
                            this.setRules(rules);
                        }.bind(this));
                    }
                    else {
                        this.element.submit(this._submit.bind(this));
                    }
                },

                /**
                 *
                 * @param rules
                 */
                setRules: function (rules) {
                    var messages = {};
                    this.$emit('uiform.rules', rules, messages);
                    this.element.validate($.extend({}, uiFormValidateConfig, {
                        rules: rules,
                        messages: messages,
                        submitHandler: this._submit.bind(this)
                    }));
                },

                /**
                 *
                 * @returns {*}
                 */
                formData: function (isJson) {
                    var r = this.element.serializeArray();
                    if (isJson === true) {
                        var o = {};
                        $.each(r, function (i, item) {
                            var n = item.name,
                                v = item.value;
                            if (o[n]) {
                                if ($.isArray(o[n])) {
                                    o[n].push(v);
                                }
                                else {
                                    o[n] = [o[n], v];
                                }
                            }
                            else {
                                o[n] = v;
                            }
                        });
                        r = o;
                    }
                    return r;
                },

                /**
                 * 加载数据绑定到表单
                 * @param url
                 */
                loadData: function (url) {
                    var self = this;
                    return ajax.post(url).then(function (formData) {
                        self.setData(formData);
                    });
                },

                /**
                 * 给表单设置数据集
                 * @param data
                 */
                setData: function (data) {
                    for (var k in data) {
                        var formControl = this.formControlMap[k];
                        if (formControl) {
                            formControl.val(data[k]);
                        }
                    }
                },

                /**
                 *
                 */
                submit: function (fn) {
                    this.$on('uiForm.doSubmit', fn);
                },
                _submit: function (other) {
                    if (this.action) {
                        ajax.post(this.action, this.formData(other)).then(function () {
                            this.$emit('uiForm.completeSubmit', this);
                        }.bind(this));
                    }
                    else {
                        this.$emit('uiForm.doSubmit', this.formData({}));
                    }
                    return false;
                },

                /**
                 *
                 */
                reset: function () {
                    this.scope.$broadcast('uiform.reset');
                }
            });
            return Form;
        });
})
(jQuery);
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .factory('UIInputControl', function()  {
            var UIInputControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIInputControl, super$0);

                function UIInputControl(s, e, a) {
                    this.className = 'Input';
                    this.formEl = e.find('input');
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIInputControl,super$0);UIInputControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIInputControl,"configurable":true,"writable":true}});DP$0(UIInputControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});
            ;return UIInputControl;})(UIFormControl);
            return UIInputControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiRegionHelper', function ($q, Message, AdminCDN, Ajax) {
        var m = new Message('UiRegionHelper'),
            requestQueue = [],

            isInitDataMaping = false,
            isInitDataMap = false,
            dataMapUrl = (("" + AdminCDN) + "/js/China_Region_Last.js"),
            dataMap,

            isInitDataList = false,
            dataList,


            isInitTreeData = false,
            strandardTreeData,
            allTreeData,
            rootId = '086',
            getSubDataList = function (pid, placeholder, $el, isRequire) {
                if (isRequire && pid === undefined) {
                    return;
                }
                else {
                    var self = this,
                        d = $q.defer();
                    this.getTreeData().then(function () {
                        var r = allTreeData[pid].child;
                        d.resolve(r);
                        $el && self.setHtml($el, r);
                    }, function () {
                        d.reject([]);
                    });
                    return d.promise;
                }
            };
        return {

            /**
             * json类型的数据
             */
            getDataMap: function () {
                var d = $q.defer();
                if (isInitDataMap) {    //加载过了, 就直接返回啦
                    d.resolve(dataMap);
                }
                else {
                    if (!isInitDataMaping) { //设置状态, 其他的请求放入队列, 保持多次调用只请求一次
                        isInitDataMaping = true;
                        $.getScript(dataMapUrl, function () {
                            d.resolve(dataMap = window['CHINA_REGION']);
                            $.each(requestQueue, function (ii, dd) {
                                dd.resolve(dataMap);
                            }); //返回所有请求队列
                            requestQueue = []; //清空请求队列
                            isInitDataMap = true;
                        }, function () {
                            isInitDataMaping = false; //设置状态，重新
                            d.reject({});
                        });
                    }
                    else {   //放入队列
                        requestQueue.push(d);
                    }
                }
                return d.promise;
            },

            /**
             * 列表数据
             * @param mode      p|c|s  默认是a, 也就是最小视图是什么模式, 省|市|区
             * @returns {promise}
             */
            getDataList: function (mode) {
                mode = mode || 's';
                var d = $q.defer();
                this.getTreeData().then(function () {
                    var dataList = [];
                    $.each(dataMap, function (k, v) {
                        var isC = false;
                        switch (mode) {
                            case 'p':
                                isC = v[1] == rootId;
                                break;
                            case 'c':
                                var p = allTreeData[v[1]];
                                if (p && p.id == rootId) {  //这个数据是省, 那是必须的
                                    isC = true;
                                }
                                else if (k == rootId) { //这个数据是全国, 那也是必须的
                                    isC = true;
                                }
                                else {
                                    var p2 = allTreeData[p.pid]; //这个数据是市, 那是必须的
                                    isC = p2 ? p2.id == rootId : false;
                                }
                                break;
                            case 's':
                                isC = true;
                                break;
                        }
                        if (isC) {
                            dataList.push({id: k, name: v[0], pid: v[1]});
                        }
                    });
                    d.resolve(dataList);
                    isInitDataList = true;
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             *
             * @param mode
             */
            getDatasByMode: function (mode) {
                mode = mode || 's';
                var d = $q.defer();
                this.getTreeData().then(function () {
                    var dataList = [];
                    $.each(allTreeData, function (id, o) {
                        if (o.mode == mode)
                            dataList.push(o);
                    });
                    d.resolve(dataList);
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             * tree类型的数据
             */
            getTreeData: function () {
                var d = $q.defer();
                if (isInitTreeData) {
                    d.resolve(strandardTreeData);
                }
                else {
                    this.getDataMap().then(function (dataMap) {
                        strandardTreeData = {'086': {id: rootId, text: '全国', child: []}};
                        allTreeData = {'086': {id: rootId, text: '全国', child: []}};
                        $.each(dataMap, function (k, v) {
                            var o = {id: k, text: v[0], child: [], pid: v[1], mode: null};
                            if (k != rootId) { //非全国
                                allTreeData[k] = o;
                            }

                            if (allTreeData[v[1]]) {
                                allTreeData[v[1]].child.push(o);
                                if (v[1] == rootId) {   //父ID是全国, 那么就是这条数据就是省
                                    o.mode = 'p';
                                    strandardTreeData[rootId].child.push(o);
                                }
                                else if (allTreeData[v[1]].pid == rootId) { //父id的父id是全国, 那么就是市
                                    o.mode = 'c';
                                }
                                else {
                                    o.mode = 's';
                                }
                            }
                        });
                        d.resolve(strandardTreeData);
                        isInitTreeData = true;
                    }, function () {
                        d.reject({});
                    });
                }
                return d.promise;
            },

            /**
             * 获取html
             */
            getHtml: function (dataList) {
                var h = [];
                $.each(dataList, function (i, data) {
                    var value = data.id;
                    h.push('<option value="' + value + '">' + data.text + '</option>');
                });
                return h.join('');
            },

            /**
             * 给el设置html
             * @param $el
             * @param dataList
             */
            setHtml: function ($el, dataList) {
                $el.html(this.getHtml(dataList)).change();
            },

            /**
             * 获取所有省
             */
            getProvince: function ($el) {
                return getSubDataList.call(this, rootId, '请选择省', $el, false);
            },

            /**
             * 根据省ID获取所有区
             * @param pid
             */
            getCity: function (pid, $el) {
                return getSubDataList.call(this, pid, '请选择市', $el, true);
            },


            /**
             * 根据ID获取所有街道
             * @param cip
             */
            getStreet: function (cid, $el) {
                return getSubDataList.call(this, cid, '请选择区', $el, true);
            },

            /**
             * 根据ID获取
             * @param id
             */
            getById: function (id) {
                var d = $q.defer();
                this.getTreeData().then(function () {
                    d.resolve(allTreeData[id]);
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             * 设置内容根据街道ID
             */
            htmlById: function (sid, $sel, $cel, $pel) {
                var self = this,
                    d = $q.defer();
                this.getById(sid).then(function (target) {
                    if (target) {
                        var provinceId, cityId, streetId, p, c;
                        switch (target.mode) {
                            //省的话, 直接取值
                            case 'p':
                                provinceId = sid;
                                self.getProvince($pel); //
                                self.getCity(provinceId, $cel); //
                                d.resolve([null, null, target]);
                                break;
                            //市的话, 取他的省
                            case 'c':
                                p = allTreeData[target.pid];
                                provinceId = p.id;
                                cityId = sid;
                                self.getProvince($pel);
                                self.getCity(p.id, $cel);
                                self.getStreet(cityId, $sel);
                                d.resolve([null, target, p]);
                                break;
                            //区的话, 取他的市和省
                            case 's':
                                c = allTreeData[target.pid];
                                p = allTreeData[c.pid];
                                provinceId = p.id;
                                cityId = c.id;
                                streetId = sid;
                                self.getProvince($pel);
                                self.getCity(p.id, $cel);
                                self.getStreet(c.id, $sel);
                                d.resolve([target, c, p]);
                                break;
                            default:
                        }
                        setTimeout(function () {
                            provinceId && $pel && $pel.select2('val', provinceId);
                            cityId && $cel && $cel.select2('val', cityId);
                            streetId && $sel && $sel.select2('val', streetId);
                        }, 500);
                    }
                    else {
                        m.error('当前地址数据有误, 请重新编辑保存');
                        logger.error('[' + sid + ']');
                        self.getProvince($pel);
                        d.reject();
                    }
                });
                return d.promise;
            }
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIRegionControl', function(uiRegionHelper)  {
            var UIRegionControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIRegionControl, super$0);var proto$0={};
                function UIRegionControl(s, e, a) {
                    this.className = 'Region';
                    this.$inputDom = e.find('input:eq(0)');
                    this.$pDom = e.find('[name="province"]');
                    this.$cDom = e.find('[name="city"]');
                    this.$sDom = e.find('[name="area"]');
                    this.$aDom = e.find('[name="address"]');
                    this.valueType = a.valueType || 'text'; //保存的是文字还是ID
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIRegionControl,super$0);UIRegionControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIRegionControl,"configurable":true,"writable":true}});DP$0(UIRegionControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);
                    switch (this.attrs.mode) {
                        case 'p':
                            this.$cDom.hide();
                            this.$sDom.hide();
                            this.$aDom.hide();
                            break;
                        case 'c':
                            this.$sDom.hide();
                            this.$aDom.hide();
                            break;
                        case 's':
                            this.$aDom.hide();
                            break;
                    }
                };

                proto$0.initEvents = function() {var this$0 = this;
                    super$0.prototype.initEvents.call(this);
                    this.$pDom.change(function(evt)  {
                        if (evt.val) {
                            uiRegionHelper.getCity(evt.val).then(function(data)  {
                                this$0.$cDom.select2(this$0.toCityData(data));
                                this$0.$sDom.select2(this$0.toStreetData());
                            });
                            this$0.$pDom.val(evt.added[this$0.valueType]);
                            this$0.$inputDom.val(evt.val);
                            this$0._change('p');
                        }
                        else {
                            this$0.reset();
                        }
                    });

                    //
                    this.$cDom.change(function(evt)  {
                        if (evt.val) {
                            uiRegionHelper.getStreet(evt.val).then(function(data)  {
                                this$0.$sDom.select2(this$0.toStreetData(data));
                            });
                            this$0.$cDom.val(evt.added[this$0.valueType]);
                            this$0.$inputDom.val(evt.val);
                            this$0._change('c');
                        }
                        else {
                            this$0.$sDom.select2(this$0.toStreetData());
                            this$0.$cDom.val('');
                            this$0.$inputDom.val('');
                        }
                    });

                    //
                    this.$sDom.change(function(evt)  {
                        if (evt.val) {
                            this$0.$sDom.val(evt.added[this$0.valueType]);
                            this$0.$inputDom.val(evt.val);
                            this$0._change('s');
                        }
                        else {
                            this$0.$sDom.val('');
                            this$0.$inputDom.val('');
                        }
                    });
                };

                proto$0.render = function() {var this$0 = this;
                    super$0.prototype.render.call(this);
                    if (/^\d+$/g.test(this.codeValue)) {  //有区域ID
                        uiRegionHelper.htmlById(this.codeValue)
                            .then(function (ts) {
                                return ts.concat(uiRegionHelper.getProvince());
                            })
                            .then(function(p, c, s, data)  {
                                this$0.$pDom.select2(this$0.toProvinceData(data));
                                if (p) {
                                    this$0.$pDom.select2('val', p.id);
                                    this$0.$pDom.val(p[self.valueType]);
                                    return [c, s, uiRegionHelper.getCity(p.id)];
                                }
                                else {
                                    this$0.$cDom.select2(this$0.toCityData([]));
                                    this$0.$sDom.select2(this$0.toStreetData([]));
                                }
                                throw new Error();
                            })
                            .then(function(c, s, data)  {
                                this$0.$cDom.select2(self.toCityData(data));
                                if (c) {
                                    this$0.$cDom.select2('val', c.id);
                                    this$0.$cDom.val(c[self.valueType]);
                                    return [s, uiRegionHelper.getStreet(c.id)];
                                }
                                else {
                                    this$0.$sDom.select2(this$0.toStreetData([]));
                                }
                                throw new Error();
                            })
                            .then(function(s, data)  {
                                this$0.$sDom.select2(self.toStreetData(data));
                                if (s) {
                                    self.$sDom.select2('val', s.id);
                                    self.$sDom.val(s[self.valueType]);
                                }
                            });
                        this.$inputDom.val(this.codeValue);
                    }
                    else { //没有则直接加载省
                        uiRegionHelper.getProvince().then(function(data)  {
                            this$0.$pDom.select2(this$0.toProvinceData(data));
                            this$0.$cDom.select2(this$0.toCityData([]));
                            this$0.$sDom.select2(this$0.toStreetData([]));
                        });
                    }
                };

                proto$0.toProvinceData = function(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择省'};
                };

                proto$0.toCityData = function(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择市'};
                };

                proto$0.toStreetData = function(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择区'};
                };

                proto$0.reset = function() {
                    this.$inputDom.val('');
                    this.$pDom.val('').select2('val', '');
                    this.$cDom.val('').select2(this.toCityData());
                    this.$sDom.val('').select2(this.toStreetData());
                };

                proto$0._change = function(mode) {
                    this.scope.model = this.$inputDom.val();
                    var val = this.scope.mode,
                        p = this.$pDom.val(),
                        c = this.$cDom.val(),
                        s = this.$sDom.val();
                    this.scope.change({mode: mode, val: val, p: p, c: c, s: s});
                };
            MIXIN$0(UIRegionControl.prototype,proto$0);proto$0=void 0;return UIRegionControl;})(UIFormControl);

            return UIRegionControl;
        });
})();
angular.module('admin.component')
    .factory('uiRegionService', function (uiRegionHelper, msg, uiFormControl) {
        var m = new msg('Region'),
            Region = function (scope, element, attrs) {
                var $doms = element.find('input');
                this.$inputDom = $($doms[0]);
                this.$pDom = $($doms[1]);
                this.$cDom = $($doms[2]);
                this.$sDom = $($doms[3]);
                this.$aDom = $($doms[$doms.length - 1]);
                this.codeValue = attrs.sValue;
                this.autoWidth = attrs.autoWidth;
                this.mode = attrs.mode || 's';
                this.valueType = attrs.valueType || 'text'; //保存的是文字还是ID
                uiFormControl.apply(this, arguments);
            };
        Region.prototype = $.extend(new uiFormControl(), {

            _init: function () {
                var self = this;
                if (/^\d+$/g.test(this.codeValue)) {  //有区域ID
                    var p, c, s;
                    uiRegionHelper.htmlById(this.codeValue)
                        .then(function (ts) {
                            p = ts[2];
                            c = ts[1];
                            s = ts[0];
                            return uiRegionHelper.getProvince();
                        })
                        .then(function (data) {
                            self.$pDom.select2(self.toProvinceData(data));
                            if (p) {
                                self.$pDom.select2('val', p.id);
                                self.$pDom.val(p[self.valueType]);
                                return uiRegionHelper.getCity(p.id);
                            }
                            else {
                                return null;
                            }
                        })
                        .then(function (data) {
                            if (data) {
                                self.$cDom.select2(self.toCityData(data));
                                if (c) {
                                    self.$cDom.select2('val', c.id);
                                    self.$cDom.val(c[self.valueType]);
                                    return uiRegionHelper.getStreet(c.id);
                                }
                                else {
                                    return null;
                                }
                            }
                        })
                        .then(function (data) {
                            if (data) {
                                self.$sDom.select2(self.toStreetData(data));
                                if (s) {
                                    self.$sDom.select2('val', s.id);
                                    self.$sDom.val(s[self.valueType]);
                                }
                            }
                        });
                    this.$inputDom.val(this.codeValue);
                }
                else { //没有则直接加载省
                    uiRegionHelper.getProvince().then(function (data) {
                        self.$pDom.select2(self.toProvinceData(data));
                    });
                }

                //
                if (this.attrs.aValue) {
                    this.$aDom.val(this.attrs.aValue);
                }

                this.initMode();
                this.initEvent();
            },

            initMode: function () {
                var width = 0;
                switch (this.attrs.mode) {
                    case 'p':
                        width = 120 * 1;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.remove();
                        this.$sDom.remove();
                        break;
                    case 'c':
                        width = 120 * 2;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.select2(this.toCityData());
                        this.$sDom.remove();
                        break;
                    default:
                        width = 120 * 3;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.select2(this.toCityData());
                        this.$sDom.select2(this.toStreetData());
                }
                if (this.autoWidth) {
                    this.element.width(width + 60);
                }
            },

            initEvent: function () {
                var self = this;

                //
                this.$pDom.change(function (evt) {
                    if (evt.val) {
                        uiRegionHelper.getCity(evt.val).then(function (data) {
                            self.$cDom.select2(self.toCityData(data));
                            self.$sDom.select2(self.toStreetData());
                        });
                        this.$pDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.reset();
                    }
                }.bind(this));

                //
                this.$cDom.change(function (evt) {
                    if (evt.val) {
                        uiRegionHelper.getStreet(evt.val).then(function (data) {
                            self.$sDom.select2(self.toStreetData(data));
                        });
                        this.$cDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.$sDom.select2(this.toStreetData());
                        this.$cDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));

                //
                this.$sDom.change(function (evt) {
                    if (evt.val) {
                        this.$sDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.$sDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));
            },

            toProvinceData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择省'};
            },

            toCityData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择市'};
            },

            toStreetData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择区'};
            },

            reset: function () {
                this.$inputDom.val('');
                this.$pDom.val('').select2('val', '');
                this.$cDom.val('').select2(this.toCityData());
                this.$sDom.val('').select2(this.toStreetData());
            }
        });
        return function (s, e, a, c, t) {
            return new Region(s, e, a, c, t);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiSearchFormFactory', function (msg, uiFormControl) {
        var m = new msg('SearchForm'),
            SearchForm = function (scope, element, attrs, tableId) {
                this.elementContainer = element.find('.row > div:eq(0)');
                this.tableId = tableId;
                uiFormControl.apply(this, arguments);
            };
        SearchForm.prototype = $.extend(new uiFormControl(), {
            _init: function () {
                $(document).keydown(function (evt) {
                    if (evt.keyCode == 13) {
                        this.search();
                    }
                }.bind(this));
                this.element.submit(function (evt) {
                    evt.preventDefault();
                    return false;
                });
            },

            addFormItem: function (formItem) {
                this.elementContainer.append(formItem);
            },

            formData: function () {
                return this.element.serializeArray();
            },

            formParamData: function () {
                return this.element.serialize();
            },

            search: function () {
                var data = this.formData();
                this.$emit('uisearchform.doSubmit', data);
                if (this.scope[this.tableId]) {
                    this.scope[this.tableId].search(data);
                }
                else {
                    m.error('为发现ref为[' + this.tableId + ']的组件, 无法调用查询');
                }
            },

            submit: function (fn) {
                this.$on('uisearchform.doSubmit', fn);
            },

            reset: function () {
                this.scope.$broadcast('uisearchform.reset');
            }
        });
        return SearchForm;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISelectControl',function(Ajax)  {

            //
            var UISelectControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UISelectControl, super$0);var proto$0={};

                function UISelectControl(s, e, a) {
                    this.className = 'Select';
                    this.formEl = e.find('Select');
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UISelectControl,super$0);UISelectControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UISelectControl,"configurable":true,"writable":true}});DP$0(UISelectControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);

                    //是否多选
                    if (this.attrs.multiple) {
                        this.formEl.prop('multiple', 'multiple');
                    }

                    //初始化数值
                    this.defaultValue = this.scope.value || this.formEl.find('option:eq(0)').val() || '';
                    if (!this.scope.model && this.defaultValue) {
                        this.scope.model = this.defaultValue;
                        this.val(this.defaultValue);
                    }

                    //远程加载数据
                    if (this.attrs.url) {
                        this.load(this.attrs.url);
                    }
                };

                proto$0.initEvents = function() {var this$0 = this;
                    super$0.prototype.initEvents.call(this);
                    this.scope.$watch('model', function(nv)  {
                        if (nv !== undefined) {
                            this$0.val(nv);
                            this$0.scope.change();
                        }
                        else
                            this$0.val(this$0.defaultValue);
                    });
                    this.formEl.change(function()  {
                        this$0.scope.model = this$0.formEl.val();
                        this$0.scope.$apply();
                    });
                };

                proto$0.render = function() {
                    if (this.init) {
                        this.formEl.selectpicker('refresh');
                    }
                    else {
                        this.formEl.selectpicker({
                            iconBase: 'fa',
                            tickIcon: 'fa-check'
                        });
                        this.init = true;
                    }
                };

                proto$0.val = function(val) {
                    super$0.prototype.val.call(this, val);
                    if (val)
                        this.render();
                };

                proto$0.load = function(url, value, isClean) {var this$0 = this;
                    return Ajax.get(url).then(function(responseData)  {
                        this$0.setData(responseData, isClean);
                        if (value) {
                            this$0.val(value);
                        }
                        else {
                            var val = self.val(),
                                m = /^\?.+:(.+)\s+\?$/.exec(val);
                            this$0.val(m ? m[1] : val);
                        }
                    });
                };

                proto$0.setData = function(data, isClean, dataName, dataValue) {var this$0 = this;
                    dataName = dataName || this.scope.dataKeyName;
                    dataValue = dataValue || this.scope.dataValueName;
                    if (isClean) {
                        this.formEl.html('');
                    }
                    if (_.isArray(data)) {
                        $.each(data, function(i, item)  {
                            this$0.formEl.append(this$0.toOption(item, dataName, dataValue));
                        });
                    }
                    else {
                        $.each(data, function(group, items)  {
                            var $optionGroup = this$0.toOptionGroup(group);
                            $.each(items, function(i, item)  {
                                $optionGroup.append(this$0.toOption(item, dataName, dataValue));
                            });
                            this$0.formEl.append($optionGroup);
                        });
                    }
                    this.reset();
                };

                proto$0.toOption = function(item, dataName, dataValue) {
                    var isString = _.isString(item),
                        itemName = isString ? item : item[dataName],
                        itemValue = isString ? item : item[dataValue];
                    var $option = $('<option/>').attr('value', itemName).html(itemValue),
                        renderHtml = this.scope.render($option, item);
                    if (renderHtml) {
                        $option.data('content', renderHtml);
                    }
                    $option.data('item', item);
                    return $option;
                };

                proto$0.toOptionGroup = function(name) {
                    var $option = $('<optgroup/>').attr('label', name);
                    return $option;
                };
            MIXIN$0(UISelectControl.prototype,proto$0);proto$0=void 0;return UISelectControl;})(UIFormControl);

            //
            return UISelectControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISpinnerControl', function()  {
            var UISpinnerControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UISpinnerControl, super$0);var proto$0={};
                function UISpinnerControl(s, e, a) {
                    this.className = 'Spinner';
                    this.formEl = e.find('input');
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UISpinnerControl,super$0);UISpinnerControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UISpinnerControl,"configurable":true,"writable":true}});DP$0(UISpinnerControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);
                };

                proto$0.initEvents = function() {var this$0 = this;
                    super$0.prototype.initEvents.call(this);
                    this.element.on('mousedown', '.spinner-up', function()  {return this$0._changeValue(true)});
                    this.element.on('mousedown', '.spinner-down', function()  {return this$0._changeValue(false)});
                    this.scope.$watch('model', function(n)  {
                        var cn = this$0._checkValue(n);
                        if (cn != n) {
                            this$0.scope.model = cn;
                        }
                    });
                };

                proto$0._changeValue = function(isAdd) {
                    var step = (this.attrs.step || 1) * 1,
                        val = this.val();
                    val = val !== undefined ? parseInt(val) : this.attrs.value;
                    val = val + (step * ( isAdd ? 1 : -1));
                    val = this._checkValue(val);
                    this.scope.model = val;
                    this.scope.$apply();
                    this.scope.change({val: val});
                };

                proto$0._checkValue = function(value) {
                    var min = (this.attrs.min || 0) * 1,
                        max = (this.attrs.max || Number.MAX_VALUE) * 1;
                    if (value > max) {
                        value = max;
                    }
                    if (value < min) {
                        value = min;
                    }
                    return value;
                };
            MIXIN$0(UISpinnerControl.prototype,proto$0);proto$0=void 0;return UISpinnerControl;})(UIFormControl);
            return UISpinnerControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISwitchControl', function()  {
            var UISwitchControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UISwitchControl, super$0);var proto$0={};
                function UISwitchControl(s, e, a) {
                    this.className = 'Switch';
                    this.formEl = e.find('input');
                    this.checkEl = this.formEl[0];
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UISwitchControl,super$0);UISwitchControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UISwitchControl,"configurable":true,"writable":true}});DP$0(UISwitchControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);
                    this.onValue = this.attrs.onValue || '1';
                    this.offValue = this.attrs.offValue || '0';
                    this.onText = this.attrs.onText || '开';
                    this.offText = this.attrs.offText || '关';
                };

                proto$0.initEvents = function() {
                    super$0.prototype.initEvents.call(this);
                };

                proto$0.render = function() {var this$0 = this;
                    this.formEl.bootstrapSwitch({
                        size: 'normal',
                        onText: this.onText,
                        offText: this.offText,
                        onSwitchChange: function(evt, state)  {
                            this$0._change(state);
                        }
                    });
                    this.formEl.bootstrapSwitch('state', this.attrs.value == this.onValue);
                    this.checkEl.checked = true;

                    this.scope.$watch('model', function(newValue)  {
                        if (newValue != this$0.val()) {
                            this$0.val(newValue);
                        }
                    });

                    if (!this.scope.model) {
                        var val = this.offValue;
                        this.scope.model = val;
                    }
                };

                proto$0.disabled = function(open) {
                    this.formEl.bootstrapSwitch('disabled', open == 'true');
                };


                proto$0.val = function(val) {
                    if (val !== undefined) {
                        this.formEl.bootstrapSwitch('state', val == this.onValue);
                        return this;
                    }
                    else {
                        return this.formEl.val();
                    }
                };

                proto$0._change = function(state) {
                    var v = state ? this.onValue : this.offValue;
                    this.val(v);
                    this.checkEl.checked = true;
                    this.scope.model = v;
                    this.scope.change({val: v});
                };
            MIXIN$0(UISwitchControl.prototype,proto$0);proto$0=void 0;return UISwitchControl;})(UIFormControl);
            return UISwitchControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UITagControl', function($q, Util, Ajax)  {
            var UIRemoteSelectControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIRemoteSelectControl, super$0);var proto$0={};
                function UIRemoteSelectControl(s, e, a) {
                    this.className = 'RemoteSelect';
                    this.selectValues = [];
                    this.selectItems = [];
                    super$0.call(this, s, e, a);
                }if(super$0!==null)SP$0(UIRemoteSelectControl,super$0);UIRemoteSelectControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIRemoteSelectControl,"configurable":true,"writable":true}});DP$0(UIRemoteSelectControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    super$0.prototype.init.call(this);
                };

                proto$0.initEvents = function(){var this$0 = this;
                    super$0.prototype.initEvents.call(this);

                    //选中
                    this.element.on('select2-selecting', function(evt)  {
                        if (evt.object.isNew && this$0.attrs.editable == 'false') {  //不可编辑, 只能选择
                            return false;
                        }
                        this$0.selectValues.push(evt.val);
                        this$0.selectItems.push(evt.object);
                        this$0.scope.model = this$0.selectValues;
                        this$0.scope.change({isAdd: true, val: evt.val, item: evt.object, vals: this$0.selectValues, items: this$0.selectItems});
                        return true;
                    });

                    //移除
                    this.element.on('select2-removing', function(evt)  {
                        this$0.selectValues = $.grep(this$0.selectValues, function (value) {
                            return value != evt.val;
                        });
                        this$0.selectItems = $.grep(this$0.selectItems, function (item) {
                            return item != evt.choice;
                        });
                        this$0.scope.model = this$0.selectValues;
                        this$0.scope.change({isAdd: false, val: evt.val, item: evt.object, vals: this$0.selectValues, items: this$0.selectItems});
                    });
                };

                proto$0.render = function() {
                    super$0.prototype.render.call(this);
                    var config = this._getConfig();
                    this.element.find('input').select2(config);
                };

                proto$0._getConfig = function() {
                    var selectOption = {
                        openOnEnter: false,
                        multiple: true,
                        createSearchChoice: $.proxy(this._createSearchChoice, this),
                        formatResult: $.proxy(this._formatResult, this),
                        formatSelection: $.proxy(this._formatResult, this),
                        id: $.proxy(this._formatId, this),
                        initSelection: $.proxy(this._initSelection, this),
                        query: $.proxy(this._filterData, this),
                        formatNoMatches: function () {
                            return '没有符合的数据';
                        },
                        formatInputTooShort: function (t, m) {
                            return '输入' + m + '个字符后开始查询';
                        },
                        formatSelectionTooBig: function (m) {
                            return '最大可以选中' + m + '个数据';
                        },
                        formatSearching: function () {
                            return '正在加载数据...';
                        },
                        formatAjaxError: function () {
                            return '加载数据失败';
                        }
                    };

                    if (this.attrs.minmum) { //输入几个字符以后才能搜索
                        selectOption.minimumInputLength = this.attrs.minmum;
                    }
                    if (this.attrs.maxSize) { //最大选中几个
                        selectOption.maximumSelectionSize = this.attrs.maxSize;
                    }
                    selectOption.closeOnSelect = false;
                    return selectOption;
                };

                proto$0.useParams = function(o) {
                    return $.extend(this.params, o || {}); //TODO: 额外查询参数
                };

                proto$0.loadData = function() {var this$0 = this;
                    var defer = $q.defer();
                    if (this.datas) {
                        defer.resolve(this.datas);
                    }
                    else {
                        Ajax.get(this.attrs.url, this.useParams()).then(function(r)  {
                            this$0.datas = r ? r.aaData || r : [];
                            $.each(this$0.datas, function (i, dd) { //遍历所有属性, 放入一个特殊变量, 用于后期查询使用
                                var s = [];
                                for (var k in dd) {
                                    s.push(k + '=' + (dd[k] || '').toString().toLowerCase());
                                }
                                dd.__string = s.join(',');
                            });
                            defer.resolve(this$0.datas);
                        });
                    }
                    return defer.promise;
                };

                proto$0._createSearchChoice = function(term, data) {
                    if ($(data).filter(function () {
                            return this.name.indexOf(term) === 0;
                        }).length === 0) {
                        return data.length <= 10 ? {id: term, name: term, isNew: true} : null; //最多10个
                    }
                };

                proto$0._filterData = function(o) {var this$0 = this;
                    var sfs = (this.attrs.search || '').toLowerCase().split(','),
                        keyword = o.term.toLowerCase();
                    this.loadData().then(function(rs)  {
                        var os = [];
                        $.each(rs, function(i, r)  {
                            var isC = false;
                            if (o.init) { //初始化, 那么只会根据
                                isC = this$0.attrs.multi ? o.term.indexOf(this$0.formatId(r)) != -1 : this$0.formatId(r) == o.term;
                            }
                            else { //根据属性过滤
                                if (sfs.length === 0 || sfs[0] === '') {
                                    isC = r.__string.indexOf(keyword) != -1;
                                }
                                else {   //针对特定属性
                                    $.each(sfs, function (ii, sf) {
                                        isC = (r[sf] || '').toString().toLowerCase().indexOf(keyword) != -1;
                                    });
                                }
                            }
                            if (isC) {
                                os.push(r);
                            }
                        });
                        o.callback({results: os});
                    });
                };

                proto$0._initSelection = function(element, callback) {
                    var self = this,
                        handler = function (data) {
                            if (self.attrs.multi !== undefined) {
                                callback(data.results);
                            }
                            else {
                                callback(data.results[0]);
                            }
                        };
                    if (self.isFocusInit) {
                        self.isFocusInit = false;
                        self.isInit = false;
                        handler({results: self.selectItems});
                    }
                    else if (element.val() !== undefined) {
                        self.isInit = false;
                        this.filterData({
                            term: element.val(),
                            init: true,
                            callback: handler
                        });
                    }
                    else if (self.isInit) {
                        self.isInit = false;
                        handler({results: []});
                    }
                };

                proto$0._formatId = function(o) {
                    return o[this.attrs.valueName || 'id'];
                };

                proto$0._formatResult = function(item, container, query) {
                    return item[this.attrs.labelName || 'name'];
                };

                proto$0.reset = function() {
                    this.selectItems = [];
                    this.selectValues = [];
                    this.inputElement.select2('val', '');
                };

                proto$0.val = function(vals) {
                    if (vals) {
                        this.inputElement.select2('val', vals);
                        if (this.attrs.multi) {
                            this.selectValues = vals;
                        }
                        else {
                            this.selectValues = [vals];
                        }
                        var values = ',' + this.selectValues.join(',') + ',',
                            self = this;
                        this.loadData().then(function (datas) {
                            self.selectItems = $.grep(datas, function (data) {
                                return values.indexOf(',' + self.formatId(data) + ',') != -1;
                            });
                        });
                    }
                    else {
                        if (this.attrs.multi) {
                            return this.selectValues;
                        }
                        else {
                            return this.selectValues[0];
                        }
                    }
                };

                proto$0.item = function() {
                    if (this.attrs.multi) {
                        return this.selectItems;
                    }
                    else {
                        return this.selectItems[0];
                    }
                };
            MIXIN$0(UIRemoteSelectControl.prototype,proto$0);proto$0=void 0;return UIRemoteSelectControl;})(UIFormControl);
            return UIRemoteSelectControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .provider('UIUploadControl', function()  {
            var domain, tokenUrl, maxSize,
                result = {
                    setDomain: function(_domain) {
                        domain = _domain
                    },

                    setTokenUrl: function(_tokenUrl) {
                        tokenUrl = _tokenUrl;
                    },

                    setMaxSize: function(_maxSize) {
                        maxSize = _maxSize;
                    },

                    $get: function() {
                        var UIUploadControl = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIUploadControl, super$0);var proto$0={};

                            function UIUploadControl(s, e, a) {
                                this.className = 'Upload';
                                super$0.call(this, s, e, a);
                            }if(super$0!==null)SP$0(UIUploadControl,super$0);UIUploadControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIUploadControl,"configurable":true,"writable":true}});DP$0(UIUploadControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                            proto$0.init = function() {
                                super$0.prototype.init.call(this);
                                this.$updateButton = this.element.find('button:eq(0)');
                                this.$removeButton = this.element.find('button:eq(1)');
                                this.$container = this.element.find('.ui-form-upload');
                                this.uploadButtonId = 'uiFormUploadButton' + new Date().getTime();
                                this.uploadContrainerId = 'uiFormUploadContainer' + new Date().getTime();
                                this.$updateButton.attr('id', this.uploadButtonId);
                                this.$container.attr('id', this.$container);
                            };

                            proto$0.render = function() {
                                super$0.prototype.render.call(this);
                                Qiniu.uploader({
                                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                                    browse_button: this.uploadButtonId,       //上传选择的点选按钮，**必需**
                                    uptoken_url: tokenUrl,
                                    domain: domain,
                                    unique_names: true,
                                    container: this.uploadContrainerId,           //上传区域DOM ID，默认是browser_button的父元素，
                                    max_file_size: maxSize,           //最大文件体积限制
                                    flash_swf_url: '/assets/js/plupload/js/Moxie.swf',  //引入flash,相对路径
                                    max_retries: 3,                   //上传失败最大重试次数
                                    dragdrop: true,                   //开启可拖曳上传
                                    drop_element: this.uploadContrainerId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                                    chunk_size: '1mb',                //分块上传时，每片的体积
                                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                                    init: {
                                        'FilesAdded': function (up, files) {
                                            plupload.each(files, function (file) {
                                                // 文件添加进队列后,处理相关的事情
                                            });
                                        },
                                        'BeforeUpload': function (up, file) {
                                            var a = 1;
                                            // 每个文件上传前,处理相关的事情
                                        },
                                        'UploadProgress': function (up, file) {
                                            var a = 1;
                                            // 每个文件上传时,处理相关的事情
                                        },
                                        'FileUploaded': function (up, file, info) {
                                            info = JSON.parse(info);
                                            info.name = file.name;
                                            info.url = domain + '/' + info.key;
                                            cb && cb(info);
                                            // 每个文件上传成功后,处理相关的事情
                                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                                            // {
                                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                            //    "key": "gogopher.jpg"
                                            //  }
                                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                                            // var domain = up.getOption('domain');
                                            // var res = parseJSON(info);
                                            // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                                        },
                                        'Error': function (up, err, errTip) {
                                            var a = 1;
                                            //上传出错时,处理相关的事情
                                        },
                                        'UploadComplete': function () {
                                            var a = 1;
                                            //队列文件处理完毕后,处理相关的事情
                                        },
                                        'Key': function (up, file) {
                                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                                            var key = "";
                                            // do something with key here
                                            return key
                                        }
                                    }
                                });
                            };
                        MIXIN$0(UIUploadControl.prototype,proto$0);proto$0=void 0;return UIUploadControl;})(UIFormControl);
                        return UIUploadControl;
                    }
                };
            return result;
        });
})();
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableCheckColumn', function (UITableColumnControl) {
        var UITableCheckColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableCheckColumnControl, super$0);var proto$0={};
            function UITableCheckColumnControl(s, e, a) {
                this.className = 'CheckColumn';
                super$0.call(this, s, e, a);
            }if(super$0!==null)SP$0(UITableCheckColumnControl,super$0);UITableCheckColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableCheckColumnControl,"configurable":true,"writable":true}});DP$0(UITableCheckColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
                this.$table = this.element.parents('table');
                this.$tableBody = this.$table.find('tbody');
            };

            proto$0.initEvents = function() {var this$0 = this;
                super$0.prototype.initEvents.call(this);
                this.scope.$emit('uitable.column.idname', this.attrs.name);
                this.scope.selectAllHandler = function(evt)  {
                    this$0._selectAllHandler(evt);
                };
            };

            proto$0.render = function(rowData) {var this$0 = this;
                var val = this.getValue(rowData);
                return $((("<input type=\"checkbox\" value=\"" + val) + "\"/>")).data('rowData', rowData).click(function(evt)  {
                    this$0._selectOneHandler(evt);
                });
            };

            proto$0._selectAllHandler = function(evt) {
                var isCheck = evt.target.checked;
                this.$tableBody.find('input[type=checkbox]').prop('checked', isCheck).uniform();
                this.scope.$emit('uitable.column.selectall', isCheck);
            };

            proto$0._selectOneHandler = function(evt) {
                var $target = $(evt.target);
                this.scope.$emit('uitable.column.selectone', {isCheck: evt.target.checked, rowData: $target.data('rowData'), value: $target.val()});
            };
        MIXIN$0(UITableCheckColumnControl.prototype,proto$0);proto$0=void 0;return UITableCheckColumnControl;})(UITableColumnControl);

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableCheckColumnControl($scope, $element, $attrs);
            },
            template: ("\
\n                <th>\
\n                    <input type=\"checkbox\" ng-click=\"selectAllHandler($event)\"/>\
\n                </th>\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableDateColumn', function (UITableColumnControl, Util) {
        var UITableDateColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableDateColumnControl, super$0);var proto$0={};
            function UITableDateColumnControl(s, e, a) {
                this.className = 'DateColumn';
                super$0.call(this, s, e, a);
            }if(super$0!==null)SP$0(UITableDateColumnControl,super$0);UITableDateColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableDateColumnControl,"configurable":true,"writable":true}});DP$0(UITableDateColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
                this.format = this.attrs.format || 'yyyy-MM-dd HH:mm:ss';
            };

            proto$0.render = function(rowData) {
                var val = this.getValue(rowData);
                if (val) {
                    val = Util.dateFormatStr(val, this.format);
                }
                return $('<div/>').html(val);
            };
        MIXIN$0(UITableDateColumnControl.prototype,proto$0);proto$0=void 0;return UITableDateColumnControl;})(UITableColumnControl);

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableDateColumnControl($scope, $element, $attrs);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                </th>'\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableImageColumn', function (UITableColumnControl) {
        var UITableImageColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableImageColumnControl, super$0);var proto$0={};
            function UITableImageColumnControl(s, e, a) {
                super$0.call(this, s, e, a);
            }if(super$0!==null)SP$0(UITableImageColumnControl,super$0);UITableImageColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableImageColumnControl,"configurable":true,"writable":true}});DP$0(UITableImageColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
            };

            proto$0.render = function(rowData) {
                var val = this.getValue(rowData),
                    placeholder = this.attrs.placeholder,  //默认图片
                    qiniu = this.attrs.qiniu; //七牛后缀
                if (val === undefined) {
                    val = placeholder;
                }
                if (val !== undefined && qiniu) {
                    val = val + qiniu;
                }
                return $('<img/>').attr('src', val).addClass(this.scope.imageCss);
            };
        MIXIN$0(UITableImageColumnControl.prototype,proto$0);proto$0=void 0;return UITableImageColumnControl;})(UITableColumnControl);

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@',
                imageCss: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableImageColumnControl($scope, $element, $attrs);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                </th>'\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableColumn', function (UITableColumnControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                return new UITableColumnControl($scope, $element, $attrs, $transclude);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                    <div style=\"display:none\" ng-transclude></div>\
\n                </th>'\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableOperationColumn', function (UITableColumnControl) {
        var UITableOperationColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableOperationColumnControl, super$0);var proto$0={};
            function UITableOperationColumnControl(s, e, a) {
                this.className = 'OperationColumn';
                super$0.call(this, s, e, a);
            }if(super$0!==null)SP$0(UITableOperationColumnControl,super$0);UITableOperationColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableOperationColumnControl,"configurable":true,"writable":true}});DP$0(UITableOperationColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
            };
        MIXIN$0(UITableOperationColumnControl.prototype,proto$0);proto$0=void 0;return UITableOperationColumnControl;})(UITableColumnControl);
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                return new UITableOperationColumnControl($scope, $element, $attrs, $transclude);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                </th>'\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableProgressColumn', function (UITableColumnControl) {
        var UITableProgressColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableProgressColumnControl, super$0);var proto$0={};
            function UITableProgressColumnControl(s, e, a) {
                this.className = 'ProgressColumn';
                super$0.call(this, s, e, a);
            }if(super$0!==null)SP$0(UITableProgressColumnControl,super$0);UITableProgressColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableProgressColumnControl,"configurable":true,"writable":true}});DP$0(UITableProgressColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
            };

            proto$0.render = function(rowData) {
                var val = this.getValue(rowData), level,
                    dom = this._getDom();
                val = val !== undefined ? val : 0;
                if (val <= 25)
                    level = 'progress-bar-danger';
                else if (val <= 50)
                    level = 'progress-bar-danger';
                else if (val <= 75)
                    level = 'progress-bar-info';
                dom.attr('title', val + '%').find('div').addClass(level).animate({width: val + '%'}).end();
                return dom;
            };

            proto$0._getDom = function() {
                return $(("\
\n                    <div style=\"border: 1px solid #57b5e3;\" class=\"progress progress-striped active\" role=\"progressbar\"style=\"margin-bottom:0px;\">\
\n                        <div class=\"progress-bar\"></div>\
\n                    </div>\
\n                "));
            };
        MIXIN$0(UITableProgressColumnControl.prototype,proto$0);proto$0=void 0;return UITableProgressColumnControl;})(UITableColumnControl);
        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableProgressColumnControl($scope, $element, $attrs);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                </th>'\
\n            ")
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .filter('emptyFilter', function () {
        return function (val, defaultV) {
            return val || defaultV || '-';
        };
    })
    .factory('UITableColumnControl', function (Message, $compile) {
        var UITableColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableColumnControl, super$0);var proto$0={};
            function UITableColumnControl($scope, $element, $attrs, $transclude) {
                super$0.call(this);
                this.scope = $scope;
                this.element = $element;
                this.attrs = $attrs;
                this.transclude = $transclude;
                this.hasTransclude = $transclude && $transclude().length > 0;
                this.className = this.className || 'Column';
                this.init();
                this.initEvents();
            }if(super$0!==null)SP$0(UITableColumnControl,super$0);UITableColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableColumnControl,"configurable":true,"writable":true}});DP$0(UITableColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {var this$0 = this;
                this.message = new Message('UITable' + this.className);
                this.sName = this.attrs.name || '';
                this.mTitle = this.attrs.head;
                this.bEditable = this.attrs.editable;
                this.bChecked = this.attrs.checked;
                this.mEditUrl = this.attrs.editUrl;
                this.mAttrs = this.attrs;
                this.sClass = this.attrs.css || '';
                this.sWidth = this.attrs.width || 'smart';
                this.bVisible = this.attrs.novisible === undefined;
                this.bSortable = this.attrs.sort !== undefined;
                this.mDataProp = function(rowData, type)  {
                    if (type != 'display') {
                        return '';
                    }
                    if (arguments.length == 3) {  //datatable会调用两次，第一个获取数据，第二次用获取的数据，渲染数据....
                        return arguments[2];
                    }
                    else {
                        var r = this$0.render(rowData, type);
                        var w = this$0.wrapperDisplay(r);
                        return w;
                    }
                };
                this.scope.$emit('uitable.column.complete', this);
            };

            proto$0.initEvents = function() {
            };

            proto$0.render = function(rowData) {
                if (this.hasTransclude) {
                    return this.getTransclude(rowData);
                }
                else {
                    var customRenderName = 'render' + name.charAt(0).toUpperCase() + name.substr(1);
                    if (this.scope[customRenderName]) {
                        return this.scope[customRenderName](rowData);
                    }
                    else {
                        return this.getValue(rowData);
                    }
                }
            };

            proto$0.getValue = function(rowData) {
                var name = this.sName, v;
                if (name && name.indexOf(".") != -1) {
                    var ns = name.split('.'), n;
                    v = rowData;
                    while ((n = ns.shift()) && v) {
                        v = v[n];
                    }
                }
                else if (name) {
                    v = rowData[name];
                }
                return v;
            };

            proto$0.getTransclude = function(rowData){
                var s = this.scope.$new();
                s.data = rowData;
                var $dom = $compile(this.element.find('div').html())(s);
                return $dom;
            };

            proto$0.wrapperDisplay = function(r) {
                r = r !== undefined ? r : '-'; //针对0或者false值
                if (r !== undefined && angular.isString(r)) {
                    r = $.trim(r);
                    r = r.length ? r : '-';
                    r = '<div>' + r + '</div>';
                }
                return r;
            };
        MIXIN$0(UITableColumnControl.prototype,proto$0);proto$0=void 0;return UITableColumnControl;})(ComponentEvent);

        return UITableColumnControl;
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableStateColumn', function (UITableColumnControl) {
        var UITableStateColumnControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableStateColumnControl, super$0);var proto$0={};
            function UITableStateColumnControl(s, e, a, t) {
                this.className = 'StateColumn';
                super$0.call(this, s, e, a, t);
            }if(super$0!==null)SP$0(UITableStateColumnControl,super$0);UITableStateColumnControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableStateColumnControl,"configurable":true,"writable":true}});DP$0(UITableStateColumnControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {
                super$0.prototype.init.call(this);
            };

            proto$0.render = function(rowData) {
                var val = this.getValue(rowData),
                    defaultValue = this.attrs.default,
                    $dom, $s = this.scope.$new();
                $s.data = rowData;
                this.transclude($s, function (clone) {
                    $dom = clone.filter('[state="' + val + '"]');
                    if ($dom.length === 0) { //用默认值
                        $dom = clone.filter('[state="' + defaultValue + '"]');
                    }
                    if ($dom.length === 0) { //还没有...
                        clone.forEach(function(dom)  {
                            if (dom.innerHTML && dom.innerHTML.indexOf(defaultValue) != -1) {
                                $dom = $(dom);
                            }
                        });
                    }
                });
                return $dom;
            };
        MIXIN$0(UITableStateColumnControl.prototype,proto$0);proto$0=void 0;return UITableStateColumnControl;})(UITableColumnControl);
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                return new UITableStateColumnControl($scope, $element, $attrs, $transclude);
            },
            template: ("\
\n                <th>\
\n                    {{head}}\
\n                </th>'\
\n            ")
        };
    })
;
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchForm', function (uiSearchFormFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                var ref = componentHelper.getComponentRef(element.parent().find('.ui-table'), '$table');

                //
                var searchForm = new uiSearchFormFactory(scope, element, attrs, ref),
                    thisRef = attrs.ref || '$searchForm';
                scope[thisRef] = searchForm;
                componentHelper.tiggerComplete(scope, thisRef, searchForm);
            },
            template: function (element, attrs) {
                var col = attrs.column || "11:1",
                    ref = attrs.ref || '$searchForm';
                var cc = col.split(':');
                return componentHelper.getTemplate('tpl.searchform', {
                    leftCol: cc[0],
                    rightCol: cc[1],
                    ref: ref
                });
            }
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormEditor', function (UIEditorControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UIEditorControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                       <script name=\"{{name}}\" type=\"text/plain\"></script>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>'\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDate', function (UIDateControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UIDateControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                       <input type=\"text\" class=\"form-control {{css}}\" name=\"{{name}}\" placeholder=\"{{placeholder}}\" ng-change=\"change({val: model})\" ng-model=\"model\" readonly=\"true\"/>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDateRange', function (UIDateRangeControl) {
        return {
            restrict: 'E',
            replace: true,
            link: function (s, e, a) {
                new UIDateRangeControl(s, e, a);
            },
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                fromModel: '=',
                toModel: '=',
                change: '&',
                help: '@'
            },
            template: ("\
\n               <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol}}\">\
\n                       <div class=\"input-date-range input-inline\">\
\n                           <div class=\"input-group\">\
\n                               <input type=\"text\" class=\"form-control\" name=\"{{fromName}}\" ng-model=\"fromModel\" value=\"{{fromValue}}\" readonly>\
\n                               <span class=\"input-group-addon\">至</span>\
\n                               <input type=\"text\" class=\"form-control\" name=\"{{toName}}\" ng-model=\"toModel\" value=\"{{toValue}}\" readonly>\
\n                           </div>\
\n                       </div>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormInput', function (UIInputControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                type: '@'
            },
            link: function (scope, element, attrs) {
                new UIInputControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                       <input type=\"{{type || 'text'}}\" class=\"form-control {{css}}\" name=\"{{name}}\" placeholder=\"{{placeholder}}\" ng-change=\"change({val: model})\" ng-model=\"model\"/>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>'\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormTextarea', function (componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude) {
                //
                var $textarea = element.find('textarea');
                scope.$on('uiform.reset', function () {
                    $textarea.val('');
                });

                //
                $textarea.html(transclude().text());

                //
                element.removeAttr('name').removeAttr('model').removeAttr('rows').removeAttr('cols');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.textarea', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  参数
//      p -- 省, 开关, 默认开, 可不填
//      c -- 市, 开关, 默认开, 可不填
//      s -- 区, 开关, 默认开, 可不填
//      a -- 地址, 开关, 默认关
//
//      s-name -- 区域的name
//      a-name -- 详细地址的name
//
//
//      p-value -- 省(当只要显示省的时候, 那就必须要填了)
//      c-value -- 市(当只要显示省和市区的时候, 那就必须要填了)
//      s-value -- 区域默认值
//      a-value -- 地址值
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormRegion', function (UIRegionControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                type: '@',
                mode: '@'
            },
            link: function(s, e, a)  {
                new UIRegionControl(s, e, a);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}} ui-form-region\">\
\n                        <input type=\"hidden\" name=\"{{name}}\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" name=\"province\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" name=\"city\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" name=\"area\"/>\
\n                        <input type=\"text\" class=\"input-medium form-control input-inline\" name=\"address\" ng-value=\"{{aValue}}\" placeholder=\"请输入详细地址\" />\
\n                        <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>'\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSelect', function (UISelectControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                multiple: '@',
                render: '&'
            },
            link: function (s, e, a) {
                new UISelectControl(s, e, a);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                    <label class=\"col-md-{{lcol}} control-label\">{{label}}</label>\
\n                    <div class=\"col-md-{{rcol}}\">\
\n                        <select class=\"form-control show-tick\" data-live-search=\"true\" data-style=\"{{buttonClass}}\" name=\"{{name}}\" title=\"{{placeholder || '请选择'}}\" ng-transclude></select>\
\n                        <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormTag', function (UITagControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                name: '@',
                model: '=',
                placeholder: '@',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UITagControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                       <input type=\"text\" class=\"form-control\" name=\"{{name}}\"/>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>\
\n            ")
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSpinner', function (UISpinnerControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function(s, e, a)  {
                new UISpinnerControl(s, e, a);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                       <div class=\"input-group\" style=\"width:150px;\">\
\n                           <div class=\"spinner-buttons input-group-btn\">\
\n                               <button type=\"button\" class=\"btn spinner-up blue\"><i class=\"fa fa-plus\"></i></button>\
\n                           </div>\
\n                           <input type=\"text\" class=\"form-control {{css}}\" name=\"{{name}}\" placeholder=\"{{placeholder}}\" ng-model=\"model\" readonly=\"true\"/>\
\n                           <div class=\"spinner-buttons input-group-btn\">\
\n                               <button type=\"button\" class=\"btn spinner-down red\"><i class=\"fa fa-minus\"></i></button>\
\n                           </div>\
\n                       </div>\
\n                        <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                    </div>\
\n               </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormSwitch', function (UISwitchControl) {
        return {
            restrict: 'E',
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                placeholder: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function(s, e, a)  {
                new UISwitchControl(s, e, a);
            },
            template: ("\
\n               <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}}\">\
\n                        <input type=\"checkbox\" class=\"form-control {{css}}\" name=\"{{name}}\" />\
\n                        <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>\
\n            ")
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormUpload', function (UIInputControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@'
            },
            link: function (scope, element, attrs) {
                new UIInputControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"form-group\">\
\n                   <label class=\"col-md-{{lcol || DefaultCol.l}} control-label\">{{label}}</label>\
\n                   <div class=\"col-md-{{rcol || DefaultCol.r}} ui-form-upload\">\
\n                       <div>\
\n                           <img class=\"{{css}}\"/>\
\n                       </div>\
\n                       <div class=\"btn-group\">\
\n                           <button type=\"button\" class=\"btn blue start\">\
\n                               <i class=\"fa fa-upload\"></i>\
\n                               <span>选择文件</span>\
\n                           </button>\
\n                           <button type=\"button\" class=\"btn red start\">\
\n                               <i class=\"fa fa-upload\"></i>\
\n                               <span>删除文件</span>\
\n                           </button>\
\n                       </div>\
\n                       <span ng-if=\"help\" class=\"help-block\">{{help}}</span>\
\n                   </div>\
\n               </div>'\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDate', function (UIDateControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                change: '&',
                label: '@',
                name: '@',
                css: '@',
                placeholder: '@'
            },
            link: function (s, e, a) {
                new UIDateControl(s, e, a);
            },
            template: ("\
\n                 <div class=\"input-inline search-item\">\
\n                    <div class=\"input-group\">\
\n                        <div ng-if=\"label\" class=\"input-group-addon\">{{label}}</div>\
\n                        <input class=\"form-control\" name=\"{{name}}\" placeholder=\"{{placeholder}}\" ng-model=\"model\" ng-change=\"change({val: model})\" readonly=\"true\"/>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDateRange', function (UIDateRangeControl) {
        return {
            restrict: 'E',
            replace: true,
            link: function (s, e, a) {
                new UIDateRangeControl(s, e, a);
            },
            scope: {
                css: '@',
                name: '@',
                fromModel: '=',
                toModel: '=',
                change: '&',
                label: '@'
            },
            template: ("\
\n                 <div class=\"input-inline search-item input-mlarge {{css}}\">\
\n                    <div class=\"input-group\">\
\n                        <input type=\"text\" readonly class=\"form-control\" name=\"{{fromName}}\" ng-model=\"fromModel\"/>\
\n                        <span class=\"input-group-addon\">{{label || '到'}}</span>\
\n                        <input type=\"text\" readonly class=\"form-control\" name=\"{{toName}}\" ng-model=\"toModel\"/>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInput', function (UIInputControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                change: '&',
                label: '@',
                name: '@',
                css: '@',
                placeholder: '@'
            },
            link: function (s, e, a) {
                new UIInputControl(s, e, a);
            },
            template: ("\
\n                 <div class=\"input-inline search-item\">\
\n                    <div class=\"input-group\">\
\n                        <div ng-if=\"label\" class=\"input-group-addon\">{{label}}</div>\
\n                        <input class=\"form-control\" name=\"{{name}}\" placeholder=\"{{placeholder}}\" ng-model=\"model\" ng-change=\"change({val: model})\"/>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchInputSelect', function (uiSelectFactory, uiInputFactory, componentHelper, msg) {
        var m = new msg('SearchInputSelect');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                //
                var hasName = attrs.selectName && attrs.inputName,
                    input = new uiInputFactory(scope, element, attrs),
                    select = new uiSelectFactory(scope, element, attrs);

                //
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchInputSelect', {
                    select: select,
                    input: input
                });

                //
                if (hasName) { //没有设置name, 那么当select的值变动的时候, 自动设置input的name为select的value
                }
                else if (!!!attrs.selectName && !!!attrs.inputName) {
                    select.change(function () {
                        input.attr('name', select.val());
                    });
                    input.attr('name', select.val());
                }
                else {
                    m.error('必须同时设置select-name和input-name, 要么不设置, 要么全设置');
                }

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                    input.reset();
                });
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input.select', attrs);
            }
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchRegion', function (UIRegionControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                change: '&',
                label: '@',
                name: '@',
                mode: '@'
            },
            link: function(s, e, a)  {
                if (a.mode === undefined || a.mode == 'a') { //区域查询不支持详细地址
                    a.mode = 's';
                }
                new UIRegionControl(s, e, a);
            },
            template: ("\
\n                <div class=\"input-inline search-item\">\
\n                    <div class=\"input-group ui-search-region\">\
\n                        <div ng-if=\"label\" class=\"input-group-addon\">{{label}}:</div>\
\n                        <input type=\"hidden\" name=\"{{name}}\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" name=\"province\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" style=\"left:-1px\" name=\"city\"/>\
\n                        <input type=\"text\" class=\"input-small form-control input-inline\" style=\"left:-2px\" name=\"area\"/>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchSelect', function (UISelectControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                label: '@',
                placeholder: '@',
                name: '@',
                css: '@',
                model: '=',
                change: '&',
                multiple: '@',
                render: '&'
            },
            link: function (s, e, a) {
                new UISelectControl(s, e, a);
            },
            template: ("\
\n                <div class=\"input-inline search-item\">\
\n                    <div class=\"input-group\">\
\n                        <div ng-if=\"label\" class=\"input-group-addon\">{{label}}</div>\
\n                        <select class=\"form-control show-tick\" data-live-search=\"true\" data-style=\"{{buttonClass}}\" name=\"{{name}}\" title=\"{{placeholder}}\" ng-transclude></select>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchTag', function (UITagControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: '@',
                name: '@',
                model: '=',
                placeholder: '@',
                change: '&'
            },
            link: function (scope, element, attrs) {
                new UITagControl(scope, element, attrs);
            },
            template: ("\
\n                <div class=\"input-large\">\
\n                    <div class=\"input-group\">\
\n                        <div ng-if=\"label\" class=\"input-group-addon\">{{label}}</div>\
\n                        <input class=\"form-control\" name=\"{{name}}\" />\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var UIStateButton = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIStateButton, super$0);var proto$0={};
        function UIStateButton(scope, element, attrs) {
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.message = new Message('uiStateButton');
        }if(super$0!==null)SP$0(UIStateButton,super$0);UIStateButton.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIStateButton,"configurable":true,"writable":true}});DP$0(UIStateButton,"prototype",{"configurable":false,"enumerable":false,"writable":false});

        proto$0.init = function() {var this$0 = this;
            if (!this.scope.clickHandler) {
                this.message.error('必须设置on-click属性');
            }
            this.element.click(function()  {
                this$0.disable(true);
                var result = this$0.scope.clickHandler();
                this$0.wait(result);
            });
        };

        proto$0.wait = function(result) {var this$0 = this;
            if (result && result.finally) {
                result.finally(function()  {return this$0.disable(false)});
            }
            else {
                this.disable(false);
            }
        };

        proto$0.disable = function(isD) {
            //
            if (this.scope.target) {
                Metronic[(("" + (isD ? '' : 'un')) + "blockUI")](this.scope.target);
            }

            //
            this.element.prop('disabled', isD);
        };
    MIXIN$0(UIStateButton.prototype,proto$0);proto$0=void 0;return UIStateButton;})(Event);

    angular.module('admin.component')
        .directive('uiStateButton', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    target: '@target',
                    clickHandler: '@click'
                },
                link: function (scope, element, attrs) {
                    var button = new UIStateButton(scope, element, attrs);
                    button.init();
                },
                template: ("\
\n                    <button type=\"button\" class=\"btn\" ng-transclude></button>\
\n                ")
            };
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('uiBreadcrumb', function (Util, Ajax) {

            var UIBreadcrumb = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIBreadcrumb, super$0);var proto$0={};
                function UIBreadcrumb(scope) {
                    this.scope = scope;
                    this.message = new Message('uiBreadcrumb');
                }if(super$0!==null)SP$0(UIBreadcrumb,super$0);UIBreadcrumb.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIBreadcrumb,"configurable":true,"writable":true}});DP$0(UIBreadcrumb,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {var this$0 = this;
                    if (this.scope.datas) {
                        this.handler(Util.toJSON(this.scope.datas));
                    }
                    else if (this.scope.url) {
                        Ajax.post(this.scope.url).then(function(datas)  {return this$0.handler(datas)});
                    }
                    else {
                        this.message.error("至少设置datas或者url来配置面包屑");
                    }
                };

                proto$0.handler = function(dataList) {
                    this.scope.items = (dataList || []).map(function(item)  {
                        return {name: item.name ? item.name : item, url: item.url ? item.url : ''};
                    });
                };
            MIXIN$0(UIBreadcrumb.prototype,proto$0);proto$0=void 0;return UIBreadcrumb;})(Event);

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    datas: '@',
                    url: '@'
                },
                link: function (scope) {
                    new UIBreadcrumb(scope).init();
                },
                template: ("\
\n                    <div class=\"page-bar\">\
\n                        <ul class=\"page-breadcrumb\">\
\n                            <li ng-repeat=\"item in items\">\
\n                                <a ng-href=\"item.url\" ng-bind=\"item.name\"></a>\
\n                                <i ng-if=\"!$last\" class=\"fa fa-angle-right\"></i>\
\n                            </li>\
\n                        </ul>\
\n                    </div>\
\n                ")
            };
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('uiContainer', function ($timeout, $controller, $injector) {

            var UIContainer = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIContainer, super$0);var proto$0={};

                function UIContainer(scope, element, $transclude) {
                    this.scope = scope;
                    this.element = element;
                    this.scope.$on('componentComplete', this.initHandler.bind(this));
                    this.content = $transclude(scope);
                }if(super$0!==null)SP$0(UIContainer,super$0);UIContainer.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIContainer,"configurable":true,"writable":true}});DP$0(UIContainer,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                proto$0.init = function() {
                    this.element
                        .show()
                        .append(this.content);

                    this.lazyInit();
                    return this;
                };

                proto$0.initEvents = function(){
                };

                proto$0.lazyInit = function() {var this$0 = this;
                    var ctrl = this.scope.controller;
                    $timeout(function()  {
                        // 全局定义
                        if (ctrl && window[ctrl]) {
                            var ctrlArgs = /\(([^\)]+)\)/.exec(window[ctrl].toString())[1],
                                args = {$scope: this$0.scope};
                            ctrlArgs = ctrlArgs.split(',');
                            for (var i = 1, arg; i < ctrlArgs.length; i++) {
                                arg = $.trim(ctrlArgs[i]);
                                args[arg] = $injector.get(arg);
                            }
                            $controller(window[ctrl], args);
                        }
                        //
                        else if (ctrl) {
                            $controller(ctrl, {$scope: this$0.scope});
                        }
                        this$0.scope.$emit('uicontainer.ready'); // 触发
                    });
                };

                proto$0.initHandler = function(evt, args) {
                    if (args) {
                        if (this.scope[args.ref]) {
                            this.scope[args.ref] = [].concat(this.scope[args.ref]);
                            this.scope[args.ref].push(args.component);
                        }
                        else {
                            this.scope[args.ref] = args.component;
                        }
                    }
                };
            MIXIN$0(UIContainer.prototype,proto$0);proto$0=void 0;return UIContainer;})(Event);

            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    controller: '@'
                },
                link: function (scope, element, attrs, ctrl, tranclude) {
                    new UIContainer(scope, element, tranclude)
                        .init()
                        .initEvents();
                },
                template: ("\
\n                    <div></div>\
\n                ")
            };
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var defaultConfig = {
            "bDestroy": true,
            "sDom": "<'table-scrollable't><'row ui-table-footer'<'col-md-3 col-sm-12'li>r<'col-md-7 col-sm-12'p>>",
            "bLengthChange": true,
            "bFilter": false,
            "bSort": true,
            "bAutoWidth": false,
            "bStateSave": true,
            "oLanguage": {
                "sProcessing": '<img src="http://7xi8np.com1.z0.glb.clouddn.com/assets/img/loading-spinner-grey.gif"/><span>&nbsp;&nbsp;正在查询.. .</span>',
                "sLengthMenu": "每页显示 _MENU_ 条",
                "sZeroRecords": "请选择条件后，点击搜索按钮开始搜索",
                "sInfo": "<label>当前第 _START_ - _END_ 条　共计 _TOTAL_ 条</label>",
                "sInfoEmpty": "没有符合条件的记录",
                "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
                "sSearch": "查询",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "尾页"
                }
            },
            "sPaginationType": "bootstrap_full_number",
            "aLengthMenu": [
                [10, 20, 30, 60],
                [10, 20, 30, 60]
            ],
            "bProcessing": true,
            "bServerSide": true
        },
        jumpTpl = ("\
\n            <div class=\"col-md-2\">\
\n                <div class=\"input-group\">\
\n                    <input type=\"text\" class=\"form-control\" placeholder=\"跳转页数\">\
\n                    <span class=\"input-group-btn\">\
\n                        <a href=\"javascript:;\" class=\"btn green\" style=\"font-size: 12px;\">Go</a>\
\n                    </span>\
\n                </div>\
\n            </div>\
\n        "),
        dataName = 'aaData',
        totalName = 'iTotalRecords',
        requestMethod = 'post',
        pageSizeName = 'pageSize',
        pageNumberName = 'pageNo';

    angular.module('admin.component')
        .provider('UITableControl', function () {
            return {

                setConfig: function(_config) {
                    defaultConfig = $.extend(true, defaultConfig, _config);
                },

                setResultName: function(_dataName, _totalName) {
                    dataName = _dataName;
                    totalName = _totalName;
                },

                setRequestMethod: function(_requestMethod) {
                    requestMethod = _requestMethod;
                },

                setPageName: function(_pageSizeName, _pageNumberName) {
                    pageSizeName = _pageNumberName;
                    pageNumberName = _pageNumberName;
                },

                $get: function (Ajax, Message, Util, AdminCDN) {
                    var UITableControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableControl, super$0);var proto$0={};
                        function UITableControl(scope, element, attrs) {
                            super$0.call(this);
                            this.element = element;
                            this.scope = scope;
                            this.attrs = attrs;
                            this.message = new Message('UITable');
                        }if(super$0!==null)SP$0(UITableControl,super$0);UITableControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableControl,"configurable":true,"writable":true}});DP$0(UITableControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                        proto$0.init = function() {var this$0 = this;
                            //
                            this.aoColumns = [];
                            this.bPaginate = this.attrs.nopage === undefined;
                            this.bInfo = this.bPaginate;
                            this.aaSorting = Util.toJSON(this.attrs.sort || '[]');
                            this.fnInitComplete = function()  {
                                this$0._buildJumpDom();
                            };
                            this.fnServerData = function(sSource, aoData, fnCallback)  {
                                setTimeout(function()  {
                                    this$0._fetchData(sSource, aoData, fnCallback);
                                }, 100);
                            };

                            //
                            this.idName = this.attrs.idName;
                            this.pageResult = {};
                            this.pageResultData = [];
                            this.selectValues = [];
                            this.selectItems = [];
                            this.instance = null;
                            this.searchParams = [];
                            this.pageSelectNum = [];
                            this.triggerComplete(this.scope, this.attrs.ref || '$table', this);
                        };

                        proto$0.initEvents = function() {var this$0 = this;
                            this.scope.$on('uitable.column.complete', function(evt, column)  {
                                this$0.aoColumns.push(column);
                            });
                            this.scope.$on('uitable.column.idname', function(evt, idName)  {
                                this$0.idName = idName;
                            });
                            this.scope.$on('uitable.column.selectall', function(evt, isAll)  {
                                if (isAll) {
                                    this$0.selectItems = this$0.pageResultData;
                                    this$0.selectValues = this$0.selectItems.map(function(item)  {return item[this$0.idName]});
                                }
                                else {
                                    this$0.selectItems = [];
                                    this$0.selectValues = [];
                                }
                            });
                            this.scope.$on('uitable.column.selectone', function(evt, obj)  {
                                if (obj.isCheck) {
                                    this$0.selectItems.push(obj.rowData);
                                    this$0.selectValues.push(obj.value);
                                }
                                else {
                                    var ii = _.indexOf(this$0.selectItems, obj.rowData);
                                    if (ii >= 0) {
                                        this$0.selectItems.splice(ii, 1);
                                        this$0.selectValues.splice(ii, 1);
                                    }
                                }
                            });
                            this.scope.$on('uitable.column.visable', function(evt, column)  {
                                var i = _.indexOf(this$0.aoColumns, column);
                                this$0.instance.fnSetColumnVis(i, column.bVisible, false);
                            });
                        };

                        proto$0.build = function() {var this$0 = this;
                            if ($.fn.dataTable) {
                                this._build();
                            }
                            else {
                                Ajax.getScript((("" + AdminCDN) + "/js/jquery.dataTables.min.js"))
                                    .then(function()  {return this$0._build()});
                            }
                        };

                        proto$0.jumpTo = function(page) {
                            if (/^\d+$/.test(page)) {
                                page = parseInt(page) - 1;
                            }
                            else if (page === undefined) {
                                page = this.getCurrentPage() - 1;
                            }
                            this.instance.fnPageChange(page !== undefined ? Math.abs(page) : "first");
                            return this;
                        };

                        proto$0.refresh = function(params, url) {
                            this.searchParams = params || this.searchParams;
                            this.url = url || this.url;
                            this.instance.fnPageChange(this.getCurrentPage() - 1);
                            return this;
                        };

                        proto$0.search = function(params, url) {
                            this.selectItems = [];
                            this.selectValues = [];
                            this.searchParams = params || this.searchParams;
                            this.url = url || this.url;
                            this.jumpTo(1);
                        };

                        proto$0.getCurrentPage = function() {
                            var setting = this.instance.fnSettings();
                            return Math.ceil(setting._iDisplayStart / setting._iDisplayLength) + 1;
                        };

                        proto$0.selectAll = function(isSelected) {
                            this.scope.$broadcast('uitable.column.selectall', isSelected);
                        };

                        proto$0._build = function() {
                            this.instance = this.element.find('table').dataTable($.extend({}, defaultConfig, this));
                            this.scope.$emit('uitable.complete', this);
                        };

                        proto$0._fetchData = function(sSource, aoData, fnCallback) {var this$0 = this;
                            if ((!this.attrs.url && !this.url) || this.attrs.manual !== undefined) {
                                delete this.attrs.manual;
                                fnCallback({aaData: [], iTotalRecords: 0, iTotalDisplayRecords: 0});
                            }
                            else {
                                var url = this.url || this.attrs.url;
                                this._buildPageParam(aoData);
                                Ajax[requestMethod](url, aoData)
                                    .then(function(data)  {
                                        var result = this$0._buildPageResult(data);
                                        this$0._beforeDataHandler(result);
                                        fnCallback(result);
                                        this$0._afterDataHandler(result);
                                    })
                                    .catch(function(data)  {
                                        this$0._errorDataHandler(data);
                                    })
                                    .finally(function()  {
                                    });
                            }
                        };

                        proto$0._beforeDataHandler = function(result) {
                            this.pageResult = result;
                            this.pageResultData = result.aaData;
                            if (this.bPaginate) {
                                this.selectItems = [];
                                this.selectValues = [];
                            }
                            this.scope.dataSuccess({result: result});
                        };

                        proto$0._afterDataHandler = function(result) {
                            this.element.find('input[type=checkbox]').uniform();
                        };

                        proto$0._errorDataHandler = function(result) {
                            this.scope.dateFail({result: result});
                        };

                        proto$0._buildPageResult = function(data) {
                            var result = {};
                            if ($.isArray(data)) {
                                result = {
                                    aaData: data,
                                    iTotalDisplayRecords: data.length,
                                    iTotalRecords: data.length
                                };
                            }
                            else {
                                result = {
                                    aaData: data[dataName],
                                    iTotalDisplayRecords: result[totalName],
                                    iTotalRecords: result[totalName]
                                };
                            }
                            return result;
                        };

                        proto$0._buildPageParam = function(searchParams) {
                            $.each(this.scope.initParams || {}, function(name, value)  {
                                searchParams.push({name: name, value: value});
                            });
                            $.each(this.searchParams || {}, function(name, value)  {
                                searchParams.push({name: name, value: value});
                            });
                            var start, size;
                            $.each(searchParams || {}, function(name, value)  {
                                if (name == 'iDisplayStart') {
                                    start = value;
                                }
                                else if (name == 'iDisplayLength') {
                                    size = value;
                                }
                            });
                            searchParams.push({name: pageNumberName, value: start / size});
                            searchParams.push({name: pageSizeName, value: size});
                        };

                        proto$0._buildJumpDom = function() {var this$0 = this;
                            if (!this.bPaginate) {
                                return;
                            }
                            var $div = this.element.find('.ui-table-footer'),
                                $form = $(jumpTpl),
                                $btn = $form.find('a'),
                                $input = $form.find('input');
                            $div.append($form);
                            $btn.click(function()  {
                                this$0.jumpTo($input.val());
                            });
                            $(document).keydown(function(evt)  {
                                if (evt.keyCode == 13) {
                                    this$0.refresh();
                                }
                            });
                        };
                    MIXIN$0(UITableControl.prototype,proto$0);proto$0=void 0;return UITableControl;})(ComponentEvent);

                    return UITableControl;
                }
            };
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTable', function (UITableControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                change: '&',  //选中的数据变动了
                jumpTo: '&', //点击跳转或者刷新
                onDataSuccess: '&', //数据获取成功
                onDateFail: '&', //数据获取失败
                initParams: '=' //查询参数
            },
            compile: function () {
                var uiTable = null;
                return {
                    pre: function (scope, element, attrs) {
                        uiTable = new UITableControl(scope, element, attrs);
                        uiTable.init();
                        uiTable.initEvents();
                    },
                    post: function () {
                        uiTable.build();
                    }
                };
            },
            template: ("\
\n                <div class=\"ui-table\">\
\n                    <table class=\"table table-striped table-bordered table-hover\">\
\n                        <thead>\
\n                            <tr role=\"row\" class=\"heading\" ng-transclude>\
\n                            </tr>\
\n                        </thead>\
\n                        <tbody></tbody>\
\n                    </table>\
\n                </div>'\
\n            ")
        };
    });

//------------------------------------------------------
//
//
// 依赖 qm.table.js
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UITableToolBarControl', function ($state) {
        var UITableToolBarControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITableToolBarControl, super$0);var proto$0={};
            function UITableToolBarControl(scope, element, attrs, transclude) {
                super$0.call(this);
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.table = null;
                this.isEdit = false;
                this.message = new Message('UITableToolBar');
                this.init();
                this.initEvents();
            }if(super$0!==null)SP$0(UITableToolBarControl,super$0);UITableToolBarControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITableToolBarControl,"configurable":true,"writable":true}});DP$0(UITableToolBarControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.init = function() {var this$0 = this;
                this.transclude(this.scope, function(dom)  {
                    this$0.element.find('.btn-group:eq(0)').append(dom);
                });
                this.scope.component = this;
                this.scope.editText = '开启';
                this.triggerComplete(this.scope, this.attrs.ref || '$tableToolbar', this);
            };

            proto$0.initEvents = function() {var this$0 = this;
                this.scope.$parent.$on('uitable.complete', function(evt, uiTable)  {
                    this$0.scope.table = uiTable;
                });
            };

            proto$0.toggleEdit = function() {
                this.isEdit = !this.isEdit;
                this.scope.editText = this.isEdit ? '关闭' : '开启';
                this.scope.$parent.$broadcast('uitable.column.edit', this.isEdit);
            };

            proto$0.doAddItem = function() {
                if (this.scope[this.attrs.add]) {
                    this.scope[this.attrs.add]();
                }
                else if (this.attrs.add && this.attrs.add.indexOf('/') != -1) {
                    if (this.attrs.addDialog) {
                        //TODO: 弹出框
                    }
                    else {
                        $state.go(this.attrs.add);
                    }
                }
                else {
                    this.message.error('点击添加数据按钮，但是没有设置地址, 请在add="地址"');
                }
            };

            proto$0.doDelItems = function() {
                var table = this.scope.table,
                    selectValues = table.selectValues;
                if (this.scope[this.attrs.del]) {
                    this.scope[this.attrs.del](selectValues);
                }
                else {
                    if (this.attrs.del) {
                        if (selectValues.length > 1) {
                            ajax.remove(this.attrs.del, {ids: selectValues.join(',')}).then(function()  {
                                table.refresh();
                            });
                        }
                        else {
                            ajax.remove(this.attrs.del + '/' + selectValues[0]).then(function()  {
                                table.refresh();
                            });
                        }
                    }
                    else {
                        this.message.error('点击删除数据按钮，但是没有设置地址, 请在del="地址"');
                    }
                }
            };

            proto$0.isShow = function(index, column) {
                if (column.className == 'CheckColumn' || column.className == 'OperationColumn') {
                    return false;
                }
                return true;
            };

            proto$0.toggleColumn = function(evt, column) {
                column.bVisible = !column.bVisible;
                this.scope.$parent.$broadcast('uitable.column.visable', column);
            };
        MIXIN$0(UITableToolBarControl.prototype,proto$0);proto$0=void 0;return UITableToolBarControl;})(ComponentEvent);
        return UITableToolBarControl;
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiToolBarTable', function (UITableToolBarControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                editable: '@',
                add: '@',
                del: '@',
                tip: '@'
            },
            controller: function($scope, $element, $attrs, $transclude)  {
                new UITableToolBarControl($scope, $element, $attrs, $transclude);
            },
            template: ("\
\n                <div class=\"ui-toolbar table-toolbar\">\
\n                    <div class=\"btn-group pull-left\">\
\n                        <button ng-if=\"editable\" type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"component.toggleEdit()\"><i class=\"fa fa-edit\"></i> <span ng-bind=\"editText\"></span>快速编辑</button>&nbsp;&nbsp;\
\n                        <button ng-if=\"add\" type=\"button\" class=\"btn btn-sm btn-primary\" ng-click=\"component.doAddItem()\"><i class=\"fa fa-plus-circle\"></i> 新增{{tip}}</button>&nbsp;&nbsp;\
\n                        <button ng-if=\"del\" type=\"button\" ng-class=\"{'btn-danger': table.selectItems.selectValues.length > 0}\" class=\"btn btn-sm\" ng-disabled=\"table.selectItems.length==0\" ng-click=\"component.doDelItem()\"><i class=\"fa fa-times-circle\"></i> 删除{{tip}}</button>&nbsp;&nbsp;\
\n                    </div>\
\n\
\n                    <span ng-show=\"table.selectItems.length > 0\" class=\"table-toolbar-tip fadeInRight\">您已选择 <strong ng-bind=\"selectItems.length\"></strong> 个{{tip}}，支持翻页选择多个{{tip}}。</span>\
\n\
\n                    <div class=\"btn-group pull-right\">\
\n                        <a class=\"btn default btn-sm\" href=\"#\" data-hover=\"dropdown\"><i class=\"fa fa-table\"></i></a>\
\n                        <div class=\"dropdown-menu dropdown-checkboxes pull-right\">\
\n                            <label ng-repeat=\"column in table.aoColumns\" ng-if=\"component.isShow($index, column)\" style=\"cursor:pointer\" >\
\n                                <div class=\"checker\">\
\n                                    <span ng-class=\"{checked: column.bVisible}\">\
\n                                        <input type=\"checkbox\" ng-click=\"component.toggleColumn($event, column)\">\
\n                                    </span>\
\n                                </div>\
\n                                <span ng-bind=\"column.mTitle\"/>\
\n                            </label>\
\n                         </div>\
\n                    </div>\
\n                    <div style=\"clear:both\"></div>\
\n                </div>\
\n            ")
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var requestMethod = 'post',
        idName = 'id',
        pidName = 'pid',
        labelName = 'name',
        defaultConfig = {
            check: {enable: true},
            edit: {enable: false},
            data: {
                key: {name: "name", childs: "childs", title: "name"},
                simpleData: {enable: true, idKey: "id", pIdKey: "pid", rootPId: "0"}
            }
        };

    angular.module('admin.component')
        .provider('UITreeControl', function () {
            var result = {

                setDataName: function(_idName, _labelName, _pidName) {
                    defaultConfig.data.simpleData.idKey = idName = _idName;
                    defaultConfig.data.simpleData.pIdKey = pidName = _pidName;
                    defaultConfig.data.key.name = labelName = _labelName;
                },

                setRequestMethod: function(_requestMethod) {
                    requestMethod = _requestMethod;
                },

                $get: function(AdminCDN, Ajax, $compile) {
                    var UITreeControl = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UITreeControl, super$0);var proto$0={};
                        function UITreeControl(scope, element, attrs, transclude) {
                            super$0.call(this);
                            this.element = element;
                            this.treeElement = element.find('ul');
                            this.scope = scope;
                            this.attrs = attrs;
                            this.treeNodeBtnMap = {};
                            this.transclude = transclude;
                            this.message = new Message('UITree');
                            this.init();
                            this.initEvents();
                        }if(super$0!==null)SP$0(UITreeControl,super$0);UITreeControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UITreeControl,"configurable":true,"writable":true}});DP$0(UITreeControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

                        proto$0.init = function() {var this$0 = this;
                            this.treeElement.attr('id', 'uiTree' + new Date().getTime());
                            this.callback = {
                                beforeClick: function(treeId, treeNode, treeNodeId)  {return this$0.scope.onBeforeClick({treeNode: treeNode})},
                                onClick: function(evt, treeId, treeNode, treeNodeId)  {return this$0.scope.onClick({treeNode: treeNode})},
                                beforeCheck: function(treeId, treeNode)  {return this$0.scope.onBeforeCheck({treeNode: treeNode})},
                                onCheck: function(evt, treeId, treeNode)  {return this$0.scope.onCheck({treeNode: treeNode})}
                            };
                            this.view = {
                                addHoverDom: function(treeId, treeNode)  {return this$0._onMouseEnterTreeNode(treeNode)},
                                removeHoverDom: function(treeId, treeNode)  {return this$0._onMouseOverTreeNode(treeNode)}
                            };
                            this.triggerComplete(this.scope, this.attrs.ref || '$tree', this);
                        };

                        proto$0.initEvents = function() {var this$0 = this;
                            this.scope.$watch('filter', function(val)  {
                                this$0._filter(val);
                            });
                            this.scope.onAddHandler = function(evt)  {return this$0._onAddHandler($(evt.target).parent().data('treeNode'))};
                            this.scope.onEditHandler = function(evt)  {return this$0._onEditHandler($(evt.target).parent().data('treeNode'))};
                            this.scope.onRemoveHandler = function(evt)  {return this$0._onRemoveHandler($(evt.target).parent().data('treeNode'))};
                        };

                        proto$0.build = function() {var this$0 = this;
                            if ($.fn.ztree) {
                                this.load();
                            }
                            else {
                                Ajax.getScript((("" + AdminCDN) + "/js/zTree_v3/js/jquery.ztree.all-3.5.min.js"))
                                    .then(function()  {return this$0.load()});
                            }
                        };

                        proto$0.load = function(params, url) {var this$0 = this;
                            url = url || this.attrs.url;
                            if (url) {
                                return Ajax[requestMethod](url, params || {})
                                    .then(function(r)  {
                                        this$0.scope.onDataSuccess({result: r});
                                        this$0.setData(r);
                                    })
                                    .catch(function(r)  {
                                        this$0.scope.onDataFail({result: r});
                                        this$0.setData(r);
                                    });
                            }
                            else {
                                this.message.error('未设置url, 无法请求');
                            }
                        };

                        proto$0.setData = function(resData) {
                            resData = resData || [];
                            if (this.attrs.root !== undefined) {
                                var rootData = {open: true, type: 1};
                                rootData[idName] = this.attrs.rootId || '0';
                                rootData[labelName] = this.attrs.root || '根';
                                resData.push(rootData);
                            }
                            this.instance = $.fn.zTree.init(this.treeElement, $.extend({}, defaultConfig, this), resData);
                        };

                        proto$0._filter = function(filterText) {
                        };

                        proto$0._onMouseEnterTreeNode = function(treeNode) {var this$0 = this;
                            if (this.treeNodeBtnMap[treeNode.id]) {
                                this.treeNodeBtnMap[treeNode.id].show();
                            }
                            else {
                                var scope = this.scope.$new(),
                                    $dom = this.element.find('>span').clone(true);
                                scope.treeNode = treeNode;
                                this.transclude(scope, function($dom2)  {
                                    $dom.data('treeNode', treeNode);
                                    $dom.append($dom2).show();
                                    $("#" + treeNode.tId + "_span").append($dom);
                                    this$0.treeNodeBtnMap[treeNode.id] = $dom;
                                });
                            }
                        };

                        proto$0._onMouseOverTreeNode = function(treeNode) {
                            if (this.treeNodeBtnMap[treeNode.id]) {
                                this.treeNodeBtnMap[treeNode.id].hide();
                            }
                        };

                        proto$0._onAddHandler = function(treeNode) {
                            this.message.success('点击了新增');
                        };

                        proto$0._onEditHandler = function(treeNode) {
                            this.message.success('点击了新增');
                        };

                        proto$0._onRemoveHandler = function(treeNode) {
                            this.message.success('点击了删除');
                        };
                    MIXIN$0(UITreeControl.prototype,proto$0);proto$0=void 0;return UITreeControl;})(ComponentEvent);
                    return UITreeControl;
                }
            };
            return result;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTree', function (UITreeControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                onBeforeClick: '&',
                onClick: '&',
                onBeforeCheck: '&',
                onDataSuccess: '&',
                onDataFail: '&',
                onCheck: '&',

                onAdd: '@',
                onEdit: '@',
                onRemove: '&',

                checked: '=',
                filter: '='
            },
            compile: function () {
                var uiTree = null;
                return {
                    pre: function (s, e, a, c, t) {
                        uiTree = new UITreeControl(s, e, a, t);
                        uiTree.init();
                        uiTree.initEvents();
                    },
                    post: function () {
                        uiTree.build();
                    }
                };
            },
            template: ("\
\n                <div>\
\n                    <ul class=\"ztree ui-tree\"></ul>\
\n                    <span style=\"display:none\">\
\n                        <span ng-if=\"onAdd\" class=\"button add\" ng-click=\"onAddHandler($event)\"></span>\
\n                        <span ng-if=\"onEdit\" class=\"button edit\" ng-click=\"onEditHandler($event)\"></span>\
\n                        <span ng-if=\"onRemove\" class=\"button remove\" ng-click=\"onRemoveHandler($event)\"></span>\
\n                    </span>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiRegionTree', function (UITreeControl, uiRegionHelper) {

        var UIRegionTreeControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIRegionTreeControl, super$0);var proto$0={};
            function UIRegionTreeControl(s, e, a, t) {
                super$0.call(this, s, e, a, t);
            }if(super$0!==null)SP$0(UIRegionTreeControl,super$0);UIRegionTreeControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIRegionTreeControl,"configurable":true,"writable":true}});DP$0(UIRegionTreeControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});

            proto$0.load = function() {var this$0 = this;
                uiRegionHelper.getDataList(this.attrs.mode || 's')
                    .then(function(data)  {return this$0.setData(data)});
            };
        MIXIN$0(UIRegionTreeControl.prototype,proto$0);proto$0=void 0;return UIRegionTreeControl;})(UITreeControl);


        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                onBeforeClick: '&',
                onClick: '&',
                onBeforeCheck: '&',
                onDataSuccess: '&',
                onDataFail: '&',
                onCheck: '&',

                onAdd: '@',
                onEdit: '@',
                onRemove: '&',

                checked: '=',
                filter: '='
            },
            compile: function () {
                var uiTree = null;
                return {
                    pre: function (s, e, a, c, t) {
                        uiTree = new UIRegionTreeControl(s, e, a, t);
                        uiTree.init();
                        uiTree.initEvents();
                    },
                    post: function () {
                        uiTree.build();
                    }
                };
            },
            template: ("\
\n                <div>\
\n                    <ul class=\"ztree ui-tree\"></ul>\
\n                    <div style=\"display:none\">\
\n                        <span ng-if=\"onAdd\" class=\"button add\" ng-click=\"onAddHandler(treeNode)\"></span>\
\n                        <span ng-if=\"onEdit\" class=\"button edit\" ng-click=\"onEditHandler(treeNode)\"></span>\
\n                        <span ng-if=\"onRemove\" class=\"button remove\" ng-click=\"onRemoveHandler(treeNode)\"></span>\
\n                    </div>\
\n                </div>\
\n            ")
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin', ['admin.service', 'admin.filter', 'admin.component', 'ui.router'])
        .constant('AdminCDN', 'http://localhost:63342/AngularAdminSrc/output/assets')
        .config(function(AdminCDN, AjaxProvider, MessageProvider, UIEditorControlProvider, UIUploadControlProvider, UITableControlProvider, UITreeControlProvider)  {

            //
            // ajax 默认返回处理
            //
            AjaxProvider.setSuccessHandler(function(result)  {return result.type == 1 ? result.data : null});
            AjaxProvider.setFailHandler(function(result)  {return result.type != 1 ? result.data : null});

            //
            // 通知位置
            //
            MessageProvider.setPosition('bottom', 'right');

            //
            // 百度编辑器的库地址
            //
            UIEditorControlProvider.setUrl((("" + AdminCDN) + "/js/ueditor/ueditor.config.js"), (("" + AdminCDN) + "/js/ueditor/ueditor.all.js"));

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

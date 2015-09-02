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
var ComponentEvent = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;function ComponentEvent() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(ComponentEvent, super$0);if(super$0!==null)SP$0(ComponentEvent,super$0);ComponentEvent.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ComponentEvent,"configurable":true,"writable":true}});DP$0(ComponentEvent,"prototype",{"configurable":false,"enumerable":false,"writable":false});var proto$0={};

    proto$0.triggerComplete = function(scope, ref, component) {
        scope[ref] = component;
        scope.$emit('componentComplete', {ref: ref, component: component});
    };
MIXIN$0(ComponentEvent.prototype,proto$0);proto$0=void 0;return ComponentEvent;})(Event);


angular.module('admin.component', [])
    .service('componentHelper', function ($templateCache) {

        /**
         * 组件已经挂载
         * @param $scope
         * @param ref
         * @param target
         */
        this.tiggerComplete = function ($scope, ref, target) {
            $scope[ref] = target;
            $scope.$emit('componentComplete', {ref: ref, component: target});
        };

        /**
         * 获取组件的ref
         * @param element
         * @param defaultRef
         * @returns {*}
         */
        this.getComponentRef = function (element, defaultRef) {
            var ref = element.attr('ref') || defaultRef;
            return ref;
        };

        /**
         * 获取模板
         */
        this.getTemplate = function (key, context) {
            var htmlTxt = $templateCache.get(key),
                template = Handlebars.compile(htmlTxt);
            return template(context);
        };

        /**
         *
         */
        this.setTemplate = function (key, template) {
            $templateCache.put(key, template);
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
        this.message = new Message('Input');
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

    var UIInputControl = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(UIInputControl, super$0);

        function UIInputControl(s, e, a) {
            this.className = 'Input';
            this.formEl = e.find('input');
            super$0.call(this, s, e, a);
        }if(super$0!==null)SP$0(UIInputControl,super$0);UIInputControl.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":UIInputControl,"configurable":true,"writable":true}});DP$0(UIInputControl,"prototype",{"configurable":false,"enumerable":false,"writable":false});
    ;return UIInputControl;})(UIFormControl);


    angular.module('admin.component')
        .factory('UIInputControl', function()  {return UIInputControl});
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiRegionHelper', function ($q, logger, msg) {
        var m = new msg('UiRegionHelper'),
            requestQueue = [],

            isInitDataMaping = false,
            isInitDataMap = false,
            dataMapUrl = 'http://pic.ofcard.com/themes/common/region/China_Region_Last.js',
            dataMap,

            isInitDataList = false,
            dataList,


            isInitTreeData = false,
            strandardTreeData,
            allTreeData,
            rootId = '086',
            getSubDataList = function (pid, placeholder, $el, isRequire) {
                if (isRequire && pid === undefined) {
                    logger.error(placeholder + '的pid为空');
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
                            logger.error('....区域数据读取不到了。。');
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

                        /*
                         var c = target.pid != rootId ? allTreeData[target.pid] : null;
                         var p = c && c.pid != rootId ? allTreeData[c.pid] : null;

                         var provinceId = undefined, cityId = undefined, streetId = undefined;
                         if (c && p){    //sid是区域
                         provinceId = p.id;cityId = c.id;streetId = sid;
                         }
                         else if(c){ //sid是市
                         provinceId = c.id;cityId = sid;streetId = 0;
                         }
                         else{  //sid是省
                         provinceId = sid;cityId = 0;streetId = 0;
                         }
                         self.getProvince($pel);
                         self.getCity(provinceId, $cel);
                         self.getStreet(cityId, $sel);
                         setTimeout(function () {
                         provinceId && $pel && $pel.select2('val', provinceId);
                         cityId && $cel && $cel.select2('val', cityId);
                         streetId && $sel && $sel.select2('val', streetId);
                         });
                         d.resolve([target, c, p]);
                         */

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
                        .then(function(data){
                            self.$pDom.select2(self.toProvinceData(data));
                            if(p){
                                self.$pDom.select2('val', p.id);
                                self.$pDom.val(p[self.valueType]);
                                return uiRegionHelper.getCity(p.id);
                            }
                            else{
                                return null;
                            }
                        })
                        .then(function(data){
                            if(data){
                                self.$cDom.select2(self.toCityData(data));
                                if(c){
                                    self.$cDom.select2('val', c.id);
                                    self.$cDom.val(c[self.valueType]);
                                    return uiRegionHelper.getStreet(c.id);
                                }
                                else{
                                    return null;
                                }
                            }
                        })
                        .then(function(data){
                            if(data){
                                self.$sDom.select2(self.toStreetData(data));
                                if(s){
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
                if(this.attrs.aValue){
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
                    if(evt.val){
                        uiRegionHelper.getCity(evt.val).then(function (data) {
                            self.$cDom.select2(self.toCityData(data));
                            self.$sDom.select2(self.toStreetData());
                        });
                        this.$pDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else{
                        this.reset();
                    }
                }.bind(this));

                //
                this.$cDom.change(function (evt) {
                    if(evt.val){
                        uiRegionHelper.getStreet(evt.val).then(function (data) {
                            self.$sDom.select2(self.toStreetData(data));
                        });
                        this.$cDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else{
                        this.$sDom.select2(this.toStreetData());
                        this.$cDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));

                //
                this.$sDom.change(function (evt) {
                    if(evt.val){
                        this.$sDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else{
                        this.$sDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));
            },

            toProvinceData: function(data){
                return {data: data || [], allowClear: true, placeholder: '请选择省'};
            },

            toCityData: function(data){
                return {data: data || [], allowClear: true, placeholder: '请选择市'};
            },

            toStreetData: function(data){
                return {data: data || [], allowClear: true, placeholder: '请选择区'};
            },

            reset: function () {
                this.$inputDom.val('');
                this.$pDom.val('').select2('val', '');
                this.$cDom.val('').select2(this.toCityData());
                this.$sDom.val('').select2(this.toStreetData());
            }
        });
        return function(s, e, a, c, t){
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
                    val = this._changeValue(val);
                    this.scope.model = val;
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
                        this$0.scope.change({val: evt.val, item: evt.object, vals: this$0.selectValues, items: this$0.selectItems});
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
                        this$0.scope.change({val: evt.val, item: evt.object, vals: this$0.selectValues, items: this$0.selectItems});
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
angular.module('admin.component')
    .factory('uiMultiSelectFactory', function ($q, ajax, logger, msg, util, Event, ValueService) {
        var m = new msg('MultiSelect'),
            MultiSelect = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.inputElement = element.find('input');
                this.attrs = attrs;

                //
                this.isInit = true;

                //
                this.selectValues = [];  //选中的值
                this.selectItems = [];   //选中的数据
                this.datas = undefined;

                //
                var self = this,
                    selectOption = {
                        openOnEnter: false,
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

                if (attrs.multi !== undefined) {  //开启多选, select元素不能开启
                    selectOption.multiple = true;
                }
                if (attrs.url !== undefined) { //开启远程查询
                    if (attrs.multi !== undefined) {
                        selectOption.createSearchChoice = $.proxy(self.createSearchChoice, self);
                    }
                    selectOption.query = $.proxy(self.filterData, self);
                    selectOption.initSelection = $.proxy(self.initSelection, self);
                    selectOption.id = $.proxy(self.formatId, self);
                    selectOption.formatSelection = $.proxy(self.formatResult, self);
                    selectOption.formatResult = $.proxy(self.formatResult, self);
                }
                if (attrs.minmum) { //输入几个字符以后才能搜索
                    selectOption.minimumInputLength = attrs.minmum;
                }
                if (attrs.maxSize) { //最大选中几个
                    selectOption.maximumSelectionSize = attrs.maxSize;
                }

                selectOption.closeOnSelect = false;


                //构造对象
                this.inputElement.select2(selectOption);

                //初始化值
                this.initValue();
                this.initEvents();
            };

        //
        MultiSelect.prototype = {

            /**
             * 初始化值
             */
            initValue: function () {
                var ngModel = this.attrs.model,
                    self = this;
                //
                if (this.attrs.multi !== undefined && this.attrs.setCheck) {
                    this.loadData().then(function () {
                        self.selectItems = [];
                        self.selectValues = [];
                        $.each(self.datas, function (i, data) {
                            if ((',' + self.attrs.setCheck + ',').indexOf(',' + data.id + ',') != -1) {
                                self.selectItems.push(data);
                                self.selectValues.push(data.id);
                            }
                        });
                        self.isFocusInit = true;
                        self.val(self.selectValues);
                    });
                }

                //
                if (!ngModel) {
                    return;
                }
                var v = ValueService.get(this.scope, ngModel);
                if (v) {
                    this.element.select2('val', v);
                }
                else {
                    var _this = this;
                    var r = this.scope.$watch(ngModel, function (n) {
                        if (n) {
                            _this.element.select2('val', n);
                            r();
                        }
                    });
                }
            },

            initEvents: function () {
                var self = this;
                this.element.on('select2-selecting', function (evt) {
                    if (evt.object.isNew && this.attrs.editable == 'false') {
                        return false;
                    }

                    if (this.attrs.multi !== undefined) {
                        this.selectValues.push(evt.val);
                        this.selectItems.push(evt.object);
                    }
                    else {
                        this.selectValues = [evt.val];
                        this.selectItems = [evt.object];
                    }
                    this.$emit('uiSelect.doSelect', this.selectValues, this.selectItems);
                    if (this.attrs.model) {
                        ValueService.set(this.scope, this.attrs.model, this.attrs.multi !== undefined ? this.selectValues : this.selectValues[0]);
                    }
                    return true;
                }.bind(this));
                this.element.on('select2-removing', function (evt) {
                    this.selectValues = $.grep(this.selectValues, function (value) {
                        return value != evt.val;
                    });
                    this.selectItems = $.grep(this.selectItems, function (item) {
                        return item != evt.choice;
                    });
                    this.$emit('uiSelect.doRemove', this.selectValues, this.selectItems);
                }.bind(this));

                //
                this.element.on('change', function (evt) {
                    if (evt.added) {
                        this.$emit('uiSelect.doAdd', evt.added, self.attrs.tag);
                    }
                    if (evt.removed) {
                        this.$emit('uiSelect.doDel', evt.removed, self.attrs.tag);
                    }
                }.bind(this));
            },

            /**
             *
             * @param term
             * @param data
             */
            createSearchChoice: function (term, data) {
                if ($(data).filter(function () {
                        return this.name.indexOf(term) === 0;
                    }).length === 0) {
                    return data.length <= 10 ? {id: term, name: term, isNew: true} : null; //最多10个
                }
            },


            /**
             * 加载远程数据
             * @param o
             */
            useParams: function (o) {
                return $.extend(this.params, o || {}); //TODO: 额外查询参数
            },

            /**
             *  TODO: 目前没考虑错误的处理
             */
            loadData: function () {
                var self = this,
                    d = $q.defer();
                if (self.datas) {
                    d.resolve(self.datas);
                }
                else {
                    ajax.post(this.attrs.url, this.useParams).then(function (r) {
                        self.datas = r ? r.aaData || r : [];
                        $.each(self.datas, function (i, dd) { //遍历所有属性, 放入一个特殊变量, 用于后期查询使用
                            var s = [];
                            for (var k in dd) {
                                s.push(k + '=' + (dd[k] || '').toString().toLowerCase());
                            }
                            dd.__string = s.join(',');
                        });
                        d.resolve(self.datas);
                    });
                }
                return d.promise;
            },

            /**
             * 过滤
             * @param o
             */
            filterData: function (o) {
                var self = this,
                    sfs = (this.attrs.search || '').toLowerCase().split(','),
                    keyword = o.term.toLowerCase();
                this.loadData().then(function (rs) {
                    var os = [];
                    $.each(rs, function (i, r) {
                        var isC = false;
                        if (o.init) { //初始化, 那么只会根据
                            isC = self.attrs.multi ? o.term.indexOf(self.formatId(r)) != -1 : self.formatId(r) == o.term;
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
            },

            /**
             * 反向查找选中的items
             * @param element
             * @param callback
             */
            initSelection: function (element, callback) {
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
            },

            /**
             * 选中的值
             * @param o
             */
            formatId: function (o) {
                return o[this.attrs.valueName || 'id'];
            },

            /**
             * 如何显示数据
             * @param item
             */
            formatResult: function (item, container, query) {
                return item[this.attrs.labelName || 'name'];
            },

            /**
             * 清空数据
             */
            reset: function () {
                this.selectItems = [];
                this.selectValues = [];
                this.inputElement.select2('val', '');
            },

            /**
             *
             * @param v
             */
            val: function (vals) {
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
            },

            item: function () {
                if (this.attrs.multi) {
                    return this.selectItems;
                }
                else {
                    return this.selectItems[0];
                }
            },

            /**
             *
             */
            render: function () {
                this.element.change();
            }
        };

        return function (scope, element, attrs) {
            return new MultiSelect(scope, element, attrs);
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
    .directive('uiFormRegion', function (uiRegionService, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiRegionService,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.region', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
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
\n                        <select class=\"form-control show-tick\" data-live-search=\"true\" data-style=\"{{buttonClass}}\" name=\"{{name}}\" title=\"{{placeholder}}\" ng-transclude></select>\
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
    .directive('uiSearchRegion', function (uiRegionService, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiRegionService,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.region', attrs);
            }
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
    .directive('uiSearchRemoteSelect', function (uiMultiSelectFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                var select = uiMultiSelectFactory(scope, element, $.extend({multi: true}, attrs));
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchRemoteSelect', select);

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.searchform.userselect.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchUserSelect', function (uiMultiSelectFactory, componentHelper, userConfig) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var select = uiMultiSelectFactory(scope, element, $.extend({}, userConfig, attrs));
                componentHelper.tiggerComplete(scope, attrs.ref || '$searchUserSelect', select);

                //
                scope.$on('uisearchform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.userselect.input', attrs);
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
                    clickFnName: '@onClick'
                },
                link: function (scope, element, attrs) {
                    var button = new UIStateButton(scope, element, attrs);
                    button.init();
                },
                template: ("\
\n                    <button type=\"button\" class=\"btn\" ng-transclude ng-click=\"clickHandler()\"></button>\
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
                    new UIContainer(scope, element, tranclude).init();
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
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin', ['admin.service', 'admin.filter', 'admin.component'])
        .config(function(AjaxProvider, MessageProvider)  {

            //
            // ajax 默认返回处理
            //
            AjaxProvider.setSuccessHandler(function(result)  {return result.type == 1 ? result.data : null});
            AjaxProvider.setFailHandler(function(result)  {return result.type != 1 ? result.data : null});

            //
            // 通知位置
            //
            MessageProvider.setPosition('bottom', 'right');
        });
})();

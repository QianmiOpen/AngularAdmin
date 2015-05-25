/*! zk - v0.0.1 - 2015-05-25 */
(function(){
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
angular.module('admin.filter')
    .filter('safeFilter', function ($sce) {
        return function (p) {
            return $sce.trustAsHtml(p);
        };
    });
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
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('uiDialog', function (msg, $compile, $q, $controller, $timeout, Event) {

        var m = new msg('Dialog'),
            Dialog = function (url, scope, ctrlName, resolve) {
                Event.call(this);
                this.url = url;
                this.ctrlName = ctrlName;
                this.scope = scope.$new();
                this.scope.dialog = this;
                this.resolve = $.extend(resolve || {}, {$scope: this.scope});
                this.start();
            };

        Dialog.prototype = {

            /**
             * 快捷增加关闭事件
             * @param fn
             */
            onClose: function (fn) {
                this.$on('hidden.bs.modal', fn);
            },

            /**
             * 开始弹出
             */
            start: function () {
                var $dom = $('<div/>').hide().appendTo(document.body),
                    defer = $q.defer();
                $dom.load(this.url, function (html) {
                    var $e = this.build(html);
                    $dom.remove(); //
                    defer.resolve($e);
                }.bind(this));
                this.result = defer.promise;
            },

            /**
             * 创建
             * @param html
             */
            build: function (html) {
                var angularDomEl = angular.element(html),
                    e = $compile(angularDomEl)(this.scope);

                //
                this.element = e;
                this.element.one('hidden.bs.modal', function () {
                    this.$emit('uiDialog.doHide');
                    this.element.remove();
                    $('.modal-backdrop').remove();
                    this.scope.$destroy();
                }.bind(this));
                this.element.one('shown.bs.modal', function () {
                    if (this.ctrlName) {
                        $timeout(function () {
                            try{
                                $controller(window[this.ctrlName] || this.ctrlName, this.resolve);
                            }
                            catch (e){
                                console.error('加载controller失败')
                            }
                        }.bind(this));
                    }
                    this.$emit('uiDialog.doShow');
                }.bind(this));

                //
                this.element.modal({
                    "keyboard": true,
                    "show": true
                });
                this.scope.$apply();
            },

            close: function () {
                if (this.element) {
                    this.element.modal('hide');
                }
            }
        };

        return {
            load: function (url, ctrlName, scope, reslove) {
                return new Dialog(url, ctrlName, scope, reslove);
            },

            //
            show: function () {
            }
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableChooseFactory', function (msg, uiEditableCommonFactory, uiSelectFactory) {
        var m = new msg('EditableChoose'),
            EditableChoose = function (element, attrs, option, other) {
                this.selectData = other;
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableChoose.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'select';
                this.option.source = this.selectData;
            },

            render: function($form){
                this.select = uiSelectFactory($form, {});
            }
        });
        return function (element, attrs, option, other) {
            return new EditableChoose(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------

jQuery.fn.editable.defaults.inputclass = 'form-control';
jQuery.fn.editable.defaults.ajaxOptions = {
    type: 'post',
    dataType: 'json'
};
angular.module('admin.service')
    .factory('uiEditableCommonFactory', function (msg, util) {
        var m = new msg('EditableCommon'),
            EditableCommon = function (element, attrs, option) {
                this.element = $(element);
                this.name = option.name;
                this.rule = option.rule;
                this.attrs = attrs;
                this.isRender = false;

                //
                this.option = $.extend(true, option, {
                    emptytext: '-',
                    placement: 'right',
                    mode: 'popup',
                    doAfter: function(){
                        if(this.render && !this.isRender){
                            this.isRender = true;
                            this.render.call(this, this.element.data('editableContainer').$form);
                        }
                    }.bind(this),
                    validate: this.validation.bind(this),
                    success: function (json, value) {
                        json = json || {};
                        if (json.result == 'ok') {
                            return true;
                        }
                        else {
                            msg.error(json.msg);
                            return false;
                        }
                    }
                });

                //
                this.beforeRender();

                //
                this.element.editable(this.option);

                //
                this.afterRender();
            };
        EditableCommon.prototype = {
            beforeRender: function(){},
            afterRender: function(){},

            validation: function(val){
                var inputVal = this.element.data('editableContainer').$form.find('[name="' + this.name + '"]').val();
                val = inputVal != undefined ? inputVal : val;
                if (this.rule) {
                    return util.checkValueUseRules(this.name, val, this.rule);
                }
                return null;
            },

            show: function(){
                this.element.editable('toggleDisabled');
                return this;
            },
            hide: function(){
                this.element.editable('toggleDisabled');
                return this;
            }
        };
        return EditableCommon;
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableImageFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableImage'),
            EditableImage = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableImage.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
            }
        });
        return function (element, attrs, option, other) {
            return new EditableImage(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableDateInputFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableDateInput'),
            EditableDateInput = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableDateInput.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
                this.option.tpl = $('<input type="text" readonly>').datetimepicker({
                    language: 'zh-CN',
                    format: this.attrs.format || "YYYY-MM-DD"
                });
            }
        });
        return function (element, attrs, option, other) {
            return new EditableDateInput(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableInputFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableInput'),
            EditableInput = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableInput.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
            }
        });
        return function (element, attrs, option, other) {
            return new EditableInput(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableRegionFactory', function (msg, uiEditableCommonFactory, $compile, $rootScope) {
        var m = new msg('EditableRegion'),
            EditableRegion = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableRegion.prototype = $.extend({}, uiEditableCommonFactory.prototype, {

            /**
             *
             */
            beforeRender: function () {
                this.option.display = function (value, sourceData) {
                    var container = this.element.data('editableContainer');
                    if (container) {
                        var $form = container.$form.find('form');
                        var nvs = $form.serializeArray();
                        var province = "";
                        var city = "";
                        $.each(nvs, function (i, item) {
                            if (item['name'] == 'province') {
                                province = item['value'];
                            }
                            if (item['name'] == 'city') {
                                city = item['value'];
                            }
                        });
                    }
                }.bind(this);

                this.option.clear = false;
                this.option.params = function (params) {
                    var $form = this.element.data('editableContainer').$form.find('form'),
                        nvs = $form.serializeArray();
                    $.each(nvs, function (i, item) {
                        params[item['name']] = item['value'];
                    });
                    params.value = params[params.name];
                    return params;
                }.bind(this);

                this.option.validateChange = function () {
                    var $form = this.element.data('editableContainer').$form.find('form'),
                        nvs = $form.serializeArray();
                    var noChange = true;
                    $.each(nvs, function (i, item) {
                        if (item['name'] == this.option.name) {
                            noChange = this.option.value == item['value'];
                        }
                    });
                    return noChange;
                }.bind(this);
            },

            render: function($form){
                var angularDomEl = angular.element('<ui-search-region s-value="' + this.option.value + '" s-name="' + this.option.name + '" mode="text"></ui--search-region>'),
                    e = $compile(angularDomEl)($rootScope.$new(true));
                $form.find('.editable-input').html('').append(e);
            }
        });
        return function (element, attrs, option, other) {
            return new EditableRegion(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableUserFactory', function (msg, uiEditableCommonFactory, uiMultiSelectFactory, userConfig) {
        var m = new msg('EditableUser'),
            EditableUser = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableUser.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {

                this.option.type = 'text';
                this.option.doAfter = function () {
                    var $element = this.data('editableContainer').$form.find('input');
                    this.select = uiMultiSelectFactory({}, $element, userConfig);
                }.bind(this);


                this.option.display = function (value, sourceData) {
                    var $this = $(this),
                        container = $this.data('editableContainer');
                    if (container) {
                        var item = $(container.$form.find('input')[1]).data('uiSelect.data');
                        item && $this.html(item.name);
                    }
                };


                this.option.clear = false;
            }
        });
        return function (element, attrs, option, other) {
            return new EditableUser(element, attrs, option, other);
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('CascadeFactory', function (msg, Event) {
        var m = new msg('CascadeFactory'),
            T = {
                U: 'url',
                C: 'callback'
            },
            CascadeFactory = function(){
                this.levelList = [];
                Event.call(this);
            };
        CascadeFactory.prototype = {

            addUrl: function(url, paramName){
                return this.addUrlByIndex(-1, url, paramName);
            },

            addUrlByIndex: function(index, url, paramName){
                paramName = paramName || 'id';
                this.levelList.push({
                    url: url,
                    type: T.U,
                    paramName: paramName
                });
                return this;
            }
        };
        return CascadeFactory;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('Event', function () {
        return function () {
            this.listenerMap = {};
            this.$on = function (evtName, fn) {
                var list = this.listenerMap[evtName] || [];
                list.push(fn);
                this.listenerMap[evtName] = list;
            };
            this.$emit = function (evtName) {
                var list = this.listenerMap[evtName] || [],
                    args = Array.prototype.slice.call(arguments, 1);
                $.each(list, function (index, fn) {
                    fn.apply(this, args);
                }.bind(this));
            };
        };
    });
(function () {
    if (!window.Handlebars) {
        return;
    }

    Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    Handlebars.registerHelper('sif', function (v1, operator, v2, options) {
        switch (operator) {
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('logger', function () {
        var c = window.console;
        return {
            debug: function (m) {
                if (c) {
                    c.debug ? c.debug(m) : c.log(m);
                }
            },
            info: function (m) {
                if (c) {
                    c.info ? c.info(m) : c.log(m);
                }
            },
            error: function (m) {
                if (c) {
                    c.error ? c.error(m) : c.log(m);
                }
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

//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('PaginationFactory', function (Event, ajax) {
        var P = function (url, index, size, pageLimit, dataName, totalName) {
            this.url = url;
            this.pageIndex = parseInt(index || 0);
            this.pageSize = parseInt(size || 10);
            this.maxPage = 0;
            this.pageLimit = parseInt(pageLimit || 10);
            this.dataName = dataName || 'data';
            this.totalName = totalName || 'total';
            Event.call(this);
        };
        P.prototype = {

            /**
             *
             * @returns {*}
             */
            load: function () {
                var self = this;
                return ajax
                    .post(this.url, {pageIndex: this.pageIndex, pageSize: this.pageSize})
                    .then(function (r) {
                        return self.analyze(r);
                    });
            },

            /**
             *
             */
            analyze: function (r) {
                var total = r[this.totalName],
                    to, s, e, pageList = [];
                this.maxPage = Math.ceil(total / this.pageSize);
                to = this.maxPage - (this.pageIndex + this.pageLimit);
                if (to >= 0) { //够放
                    s = this.pageIndex;
                    e = s + this.pageLimit;
                }
                else { //不够放,往前移动
                    s = this.pageIndex - Math.abs(to);
                    s = s < 0 ? 0 : s;
                    e = this.pageIndex + (this.pageLimit - Math.abs(to));
                }
                //
                //if(s - 1 >= 0 && e != this.maxPage){
                //    s--;
                //    e--;
                //}

                //
                for(var i = s; i < e; i++){
                    pageList.push({
                        index: i + 1,
                        current: i == this.pageIndex
                    });
                }
                return $.extend(r, {
                    dataList: r[this.dataName],
                    pageList: pageList,
                    isFirst: this.pageIndex == 0,
                    isLast: this.pageIndex == this.maxPage - 1
                })
            },

            /**
             *
             * @returns {*}
             */
            prePage: function () {
                this.pageIndex--;
                this.pageIndex = this.pageIndex < 0 ? 0 : this.pageIndex;
                return this.getPage(this.pageIndex);
            },

            /**
             *
             */
            nextPage: function () {
                this.pageIndex++;
                this.pageIndex = this.pageIndex > this.maxPage - 1 ? (this.maxPage - 1) : this.pageIndex;
                return this.getPage(this.pageIndex);
            },

            /**
             *
             */
            firstPage: function () {
                return this.getPage(0);
            },

            /**
             *
             */
            lastPage: function () {
                return this.getPage(this.maxPage);
            },

            /**
             *
             * @param pageIndex
             */
            getPage: function (pageIndex) {
                this.pageIndex = pageIndex;
                return this.load();
            }
        };
        return P;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('ShortcutFactory', function ($window, $timeout) {
        var keyboardManagerService = {};

        var defaultOpt = {
            'type': 'keydown',
            'propagate': false,
            'inputDisabled': false,
            'target': $window.document,
            'keyCode': false
        };

        //
        keyboardManagerService.keyboardEvent = {}
        keyboardManagerService.bind = function (label, callback, opt) {
            var fct, elt, code, k;
            opt = angular.extend({}, defaultOpt, opt);
            label = label.toLowerCase();
            elt = opt.target;
            if (typeof opt.target == 'string') elt = document.getElementById(opt.target);

            fct = function (e) {
                e = e || $window.event;

                //表单输入框放弃
                if (opt['inputDisabled']) {
                    var elt;
                    if (e.target) elt = e.target;
                    else if (e.srcElement) elt = e.srcElement;
                    if (elt.nodeType == 3) elt = elt.parentNode;
                    if (elt.tagName == 'INPUT' || elt.tagName == 'TEXTAREA') return;
                }

                // 找按键
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                var character = String.fromCharCode(code).toLowerCase();

                if (code == 188) character = ",";
                if (code == 190) character = ".";

                var keys = label.split("+");
                var kp = 0;
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
                var modifiers = {
                    shift: {
                        wanted: false,
                        pressed: e.shiftKey ? true : false
                    },
                    ctrl: {
                        wanted: false,
                        pressed: e.ctrlKey ? true : false
                    },
                    alt: {
                        wanted: false,
                        pressed: e.altKey ? true : false
                    },
                    meta: { //Meta is Mac specific
                        wanted: false,
                        pressed: e.metaKey ? true : false
                    }
                };
                for (var i = 0, l = keys.length; k = keys[i], i < l; i++) {
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
                    $timeout(function () {
                        callback(e);
                    }, 1);

                    if (!opt['propagate']) {
                        e.cancelBubble = true;
                        e.returnValue = false;

                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return false;
                    }
                }

            };
            keyboardManagerService.keyboardEvent[label] = {
                'callback': fct,
                'target': elt,
                'event': opt['type']
            };
            if (elt.addEventListener) elt.addEventListener(opt['type'], fct, false);
            else if (elt.attachEvent) elt.attachEvent('on' + opt['type'], fct);
            else elt['on' + opt['type']] = fct;
        };
        keyboardManagerService.unbind = function (label) {
            label = label.toLowerCase();
            var binding = keyboardManagerService.keyboardEvent[label];
            delete(keyboardManagerService.keyboardEvent[label]);
            if (!binding) return;
            var type = binding['event'],
                elt = binding['target'],
                callback = binding['callback'];
            if (elt.detachEvent) elt.detachEvent('on' + type, callback);
            else if (elt.removeEventListener) elt.removeEventListener(type, callback, false);
            else elt['on' + type] = false;
        };
        return keyboardManagerService;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('util', function ($rootScope, $compile, $filter, $parse, $q) {
        return {

            /**
             *
             * @param date
             * @param format
             * @returns {*}
             */
            dateFormatStr: function (date, format) {
                return $filter('date')(date || new Date, format);
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
                isCompleteRemove = isCompleteRemove != undefined ? isCompleteRemove : true;
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
                return (new Function("return " + str))();
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
angular.module('admin.service')
    .factory('ValueService', function ($parse) {
        return {
            set: function (scope, express, value) {
                var getter = $parse(express);
                getter.assign(scope, value);
                if (!scope.$$phase) {
                    scope.$apply();
                }
            },

            get: function (scope, express) {
                var getter = $parse(express);
                return getter(scope);
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
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiStateButton', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctr, transclude) {
                var c = transclude().text(),
                    clickHandlerName = attrs;
                element.html(c);
                if(clickHandlerName){
                    element.click(function(){
                        element.prop('disabled', true);
                        var r = scope[clickHandlerName]();
                        if(r.finally){
                            r.finally(function(){
                                element.prop('disabled', false);
                            });
                        }
                        else{
                            element.prop('disabled', false);
                        }
                    });
                }
            },
            template: 'tpl.button.state'
        };
    });
/**
 *
 */
angular.module('admin.component')
    .directive('uiAreaChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                var chart = new uiChartFactory(scope, element, attrs);
                chart.setType('line');
            },
            templateUrl: 'tpl.chart'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiBubbleChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                var chart = new uiChartFactory(scope, element, attrs);
                chart.setType('line');
            },
            templateUrl: 'tpl.chart'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiColumnChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                new uiChartFactory(scope, element, attrs);
            },
            templateUrl: 'tpl.chart.column'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiLineChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            link: function (scope, element, attrs) {
                new uiChartFactory(scope, element, attrs);
            },
            templateUrl: 'tpl.chart.line'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiMixedChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            link: function (scope, element, attrs) {
                new uiChartFactory(scope, element, attrs);
            },
            templateUrl: 'tpl.chart.line'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiPieChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function (scope, element, attrs) {
                var factory = new uiChartFactory(scope, element, attrs);
                factory.setData = function (data) {
                    this.config.series = [{
                        type: 'pie',
                        data: data.map(function (d) {
                            for (var k in d) {
                                return [k, d[k]];
                            }
                        })
                    }];
                    this.build();
                };
            },
            templateUrl: 'tpl.chart.pie'
        };
    });

/**
 *
 */
angular.module('admin.component')
    .directive('uiScatterChart', function (uiChartFactory) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            link: function(scope, element, attrs){
                var chart = new uiChartFactory(scope, element, attrs);
                chart.setType('line');
            },
            templateUrl: 'tpl.chart'
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
    .factory('uiChartFactory', function (componentHelper, msg, Event, ajax) {
        var m = new msg('Chart'),
            Chart = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.elementTarget = element.find('div');
                this.attrs = attrs;
                this.instance = null;
                this.xAxisName = this.attrs.xaxis;
                this.categories = this.attrs.categories ? this.attrs.categories.split(',') : [];
                this.pageData = null;
                this.config = {
                    title: {},
                    subtitle: {},
                    chart: {},
                    xAxis: {},
                    yAxis: {},
                    legend: {},
                    series: {}
                };
                this.init();
            };

        //
        Chart.prototype = {

            /**
             *
             */
            init: function () {
                this.config.title.text = this.attrs.title || '';
                this.config.subtitle.text = this.attrs.subTitle || '';
                this.config.chart.type = this.attrs.type;

                if (this.attrs.url) {
                    this.refresh(this.attrs.url);
                }
                componentHelper.tiggerComplete(this.scope, this.attrs.ref || ('$' + this.attrs.type + 'chart'), this);
            },

            /**
             *
             * @param url
             * @param params
             */
            refresh: function (url, params) {
                var self = this;
                ajax.post(url, params || {}).then(function (data) {
                    self.setData(data);
                });
            },

            /**
             *
             * @param type
             */
            setType: function (type) {
                this.config.chart.type = type;
                if (this.instance) {
                    this.instance.redraw();
                }
            },

            /**
             * 设置分组值
             */
            setCategories: function (categories, isClean) {
                this.categories = isClean ? categories : this.categories.concat(categories);
                if (this.pageData) {
                    this.setData(this.pageData);
                }
            },

            /**
             *
             * @param data
             */
            setXAxisData: function (data) {
                if (this.instance) {
                    this.instance.xAxis[0].setCategories(data, false);
                }
                else {
                    this.config.xAxis.categories = data;
                }
            },

            /**
             *
             */
            setData: function (data) {
                var self = this,
                    c = [],
                    r = [];

                //
                this.pageData = data;

                //遍历数据
                $.each(data, function (i, item) {
                    if (self.xAxisName) {
                        c.push(item[self.xAxisName] || '');
                    }
                    self.dataToSeriesData(item, r);
                });

                //
                this.setXAxisData(c);

                //
                if (this.instance) {
                    this.instance.series = r;
                    this.instance.redraw();
                }
                else {
                    this.config.series = r;
                    this.build();
                }
            },

            /**
             *
             */
            dataToSeriesData: function (data, r) {
                r = r || [];
                $.each(this.categories, function (j, category) { //遍历组字段
                    var v = data[category],
                        o = r[j] || {name: category, data: []};
                    o.data.push(v);
                    r[j] = o;
                });
            },

            /**
             *
             */
            build: function () {
                console.info(this.config);
                this.instance = this.elementTarget.highcharts(this.config);
            }
        };
        return Chart;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiBreadcrumb', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function (el, attrs) {
                var dataList = attrs.data.split(','),
                    h = [];
                for (var i = 0; i < dataList.length; i++) {
                    var data = dataList[i].split(':');
                    h.push([
                        '<li>',
                            '<a href="' + (data[1] || '#') + '">' + data[0] + '</a>',
                            i != dataList.length - 1 ? '<i class="fa fa-angle-right"></i>' : '',
                        '</li>'
                    ].join(''));
                }
                return [
                    '<div class="page-bar">',
                        '<ul class="page-breadcrumb">',
                            h.join(''),
                        '</ul>',
                    '</div>'
                ].join('')
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
    .directive('uiContainer', function ($timeout, $controller, $injector) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            controller: function ($scope, $attrs, $element, $transclude) {
                $scope.$on('componentComplete', function (evt, o) {
                    if (o) {
                        $scope[o.ref] = o.component;
                    }
                });
                if($attrs.sameScope != undefined){
                    $element.append($transclude($scope));
                }
            },
            link: function (scope, element, attrs) {
                element.show();
                $timeout(function(){
                    if (attrs.controller && window[attrs.controller]) {
                        var ctrlArgs = /\(([^\)]+)\)/.exec(window[attrs.controller].toString())[1],
                            args = {$scope: scope};
                        ctrlArgs = ctrlArgs.split(',');
                        for (var i = 1, arg; arg = $.trim(ctrlArgs[i]); i++) {
                            args[arg] = $injector.get(arg);
                        }
                        $controller(window[attrs.controller], args);
                    }
                    else if(attrs.controller){
                        $controller(attrs.controller, {$scope: scope});
                    }
                    else {
                        scope.$emit('uicontainer.ready'); // 触发
                    }
                });
            },
            template: function (elemet, attrs) {
                if(attrs.sameScope != undefined){
                    return '<div></div>';
                }
                else{
                    return '<div ng-transclude></div>';
                }
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
    .directive('uiFormItem', function (componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, controller, tranclude) {
                element.find('>div').append(tranclude(scope))
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
    .directive('uiForm', function (uiFormFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            transclude: true,
            compile: function () {
                var form = null;
                return {
                    pre: function (scope, element, attrs, controller, transclude) {
                        form = new uiFormFactory(scope, element, attrs, transclude(scope));
                        form.layout();
                        var ref = attrs.ref || '$form';
                        scope[ref] = form;
                        componentHelper.tiggerComplete(scope, ref, form);
                    },
                    post: function () {
                        setTimeout(function(){
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
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormDate', function (uiDateFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateFactory,
            template: function (element, attrs) {
                //
                var format = [],
                    cc = (attrs.col || defaultCol).split(':');
                if(attrs.mode){
                    if (!attrs.mode || attrs.mode.indexOf('date') != -1)
                        format.push('YYYY-MM-DD');
                    if (!attrs.mode || attrs.mode.indexOf('time') != -1)
                        format.push('HH:mm:ss');
                }
                else{ //兼容老属性
                    if (!attrs.date)
                        format.push('YYYY-MM-DD');
                    if (!attrs.time)
                        format.push('HH:mm:ss');
                }
                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1],
                    other: [
                        {key: 'data-date-format', val: format.join(' ')},
                        {key: 'readonly', val: ''}
                    ]
                }, attrs));
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
    .directive('uiFormDateRange', function (uiDateRangeService, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateRangeService,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input.daterange', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
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
    .directive('uiFormInput', function (uiInputFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiInputFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
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
    .directive('uiFormSelect', function (uiSelectFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSelectFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.select', $.extend({
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
    .directive('uiFormMultiSelect', function (util, uiSelectFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSelectFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.select', $.extend({
                    isMulti: true,
                    leftCol: cc[0],
                    rightCol: cc[1],
                    other: [
                        {key: 'multiple', val: ''},
                        {key: 'title', val: attrs.tip || '请选择'}
                    ]
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
    .directive('uiFormRemoteSelect', function (uiMultiSelectFactory, componentHelper, tagConfig, defaultCol) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                var select = uiMultiSelectFactory(scope, element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$formUserSelect', select);

                //
                scope.$on('uiform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
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
    .directive('uiFormTagSelect', function (uiMultiSelectFactory, componentHelper, tagConfig, defaultCol, msg, ajax) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs) {

                //
                var select = uiMultiSelectFactory(scope, element, $.extend({}, tagConfig, attrs, {
                    url: tagConfig.url + attrs.classify,
                    multi: true
                }));
                componentHelper.tiggerComplete(scope, attrs.ref || '$formTagSelect', select);

                //
                var classifyId = attrs.classify,
                    manual = attrs.manual != undefined,
                    usercode = attrs.usercode; //分类ID

                //
                select.setUserCode = function(uc){
                    usercode = uc;
                };
                select.setClassify = function(c){
                    classifyId = c;
                };

                //
                scope.$on('uiform.reset', function () {
                    select.reset();
                });


                if(!manual){
                    select.$on('uiSelect.doAdd', function(addObj, tag){
                        ajax.post('/sysconfig/tag/rel/add', {name: addObj.name, classify: classifyId, id: addObj.isNew ? '': addObj.id, usercode: usercode}).then(function(data){
                            addObj.id = data;
                            delete addObj.isNew;
                            msg.success('添加成功');
                        });
                    });
                    select.$on('uiSelect.doDel', function(delObj, tag){
                        if(!delObj.isNew){ //新的
                            ajax.post('/sysconfig/tag/rel/del', {name: delObj.name, classify: classifyId, id: delObj.id, usercode: usercode}).then(function(){
                                msg.success('删除成功');
                            });
                        }
                    });
                }

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
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
    .directive('uiFormUserSelect', function (uiMultiSelectFactory, componentHelper, userConfig, defaultCol) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                var select = uiMultiSelectFactory(scope, element, $.extend({}, userConfig, attrs));
                componentHelper.tiggerComplete(scope, attrs.ref || '$formUserSelect', select);

                //
                scope.$on('uiform.reset', function () {
                    select.reset();
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
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
    .directive('uiFormSpinner', function (uiSpinnerFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: uiSpinnerFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.spinner', $.extend({
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
    .directive('uiFormSwitch', function (uiSwitchFactory, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSwitchFactory,
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.switch', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
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
    .directive('uiSearchDate', function (uiDateFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateFactory,
            template: function (element, attrs) {
                var format = [];
                if(attrs.mode){
                    if (!attrs.mode || attrs.mode.indexOf('date') != -1)
                        format.push('YYYY-MM-DD');
                    if (!attrs.mode || attrs.mode.indexOf('time') != -1)
                        format.push('HH:mm:ss');
                }
                else{ //兼容老属性
                    if (!attrs.date)
                        format.push('YYYY-MM-DD');
                    if (!attrs.time)
                        format.push('HH:mm:ss');
                }
                return componentHelper.getTemplate('tpl.searchform.input', $.extend({
                    other: [
                        {key: 'data-date-format', val: format.join(' ')},
                        {key: 'readonly', val: ''}
                    ]
                }, attrs));
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
    .directive('uiSearchDateRange', function (uiDateRangeService, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiDateRangeService,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.daterange', attrs);
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
    .directive('uiSearchInput', function (uiInputFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: uiInputFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
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
    .directive('uiSearchNumberInput', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element) {
                //
                var $input = element.find('input');
                scope.$on('uisearchform.reset', function () {
                    $input.val('');
                });
                $input.onkeyup(function(evt){
                    var v = this.value;
                    v = v.replace(/[^\d]/g, '');
                    this.value = v;
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
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
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchSelect', function (uiSelectFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSelectFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', attrs);
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
    .directive('uiSearchMultiSelect', function (uiSelectFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: uiSelectFactory,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.select', $.extend({
                    isMulti: true,
                    other: [
                        {key: 'multiple', val: ''},
                        {key: 'title', val: attrs.tip || '请选择'}
                    ]
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
/**
 * 表单控件
 */
angular.module('admin.component')
    .factory('uiFormControl', function (msg, Event, componentHelper) {
        var FormControl = function (scope, element, attrs) {
            if (!scope) {
                return;
            }
            Event.call(this);
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.name = attrs.name;
            this.isSearchControl = element.parents('.ui-search-form').length > 0;
            this.formPrefix = this.isSearchControl ? '$search' : '$form';
            this.formResetEventName = this.isSearchControl ? 'uisearchform.reset' : 'uiform.reset';
            this._init();
            this._cleanElement();
            this.render();
            this._complete();
        };
        FormControl.prototype = {

            /**
             *
             */
            _init: function () {
            },

            /**
             *
             * @private
             */
            _cleanElement: function () {
                this.element.removeAttr('name').removeAttr('model').removeAttr('readonly').removeAttr('disabled');
            },

            /**
             *
             * @private
             */
            _complete: function () {
                componentHelper.tiggerComplete(this.scope, this.attrs.ref || '$' + this.formPrefix + this.className, this);
                this.resetListener = this.scope.$on(this.formResetEventName, function () {
                    this.reset();
                }.bind(this));
            },

            /**
             *
             */
            disabled: function(){
            },

            /**
             *
             */
            render: function () {
            },

            /**
             *
             */
            destroy: function () {
                delete this.listenerMap;
                this.resetListener();
            },

            /**
             *
             */
            reset: function () {
            },

            /**
             *
             * @param fn
             */
            change: function (fn) {
                this.$on('change', fn);
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
            }
        };
        return FormControl;
    });
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiDateFactory', function (msg, uiFormControl, util) {
        var m = new msg('Date'),
            InputDate = function (scope, element, attrs) {
                this.className = 'Date';
                this.inputElement = element.find('input');
                this.format = null;
                this.default = attrs.value;
                this.dateMode = attrs.mode ? attrs.mode.indexOf('date') != -1 : true;
                this.timeMode = attrs.mode ? attrs.mode.indexOf('time') != -1 : true;
                uiFormControl.apply(this, arguments);
            };
        InputDate.prototype = $.extend(new uiFormControl(), {

            _init: function () {
                var format = [];
                if (this.dateMode)
                    format.push('yyyy-MM-dd');
                if (this.timeMode)
                    format.push('HH:mm:ss');
                this.format = format.join(' ');
                this.val(this.default);
            },

            /**
             *
             */
            render: function () {
                this.inputElement.datetimepicker({
                    language: 'zh-CN',
                    pickDate: this.dateMode,
                    useCurrent: false,
                    pickTime: this.timeMode,
                    useSeconds: this.timeMode
                });
                return this;
            },

            /**
             *
             */
            reset: function () {
                this.inputElement.val('');
                return this;
            },

            /**
             *
             * @param fn
             */
            change: function (fn) {
                this.inputElement.change(fn);
                return this;
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
                if (v != undefined) {
                    this.inputElement.val(v ? util.dateFormatStr(v, this.format) : '');
                    return this;
                }
                else {
                    return this.inputElement.val();
                }
            }
        });
        return function (s, e, a, c, t) {
            return new InputDate(s, e, a, c, t);
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
    .value('uiDateRangeDefaultRange', {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
        '最近7天': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
        '最近30天': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')],
        '当前月': [moment().startOf('month'), moment().endOf('month')],
        '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
        '最近六个月': [moment().subtract('days', 182).startOf('day'), moment().endOf('day')]
    })
    .value('uiDateRangeDefaultConfig', {
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
    })
    .factory('uiDateRangeService', function (msg, uiDateRangeDefaultConfig, uiDateRangeDefaultRange, uiFormControl) {
        var m = new msg('DateRange'),
            DateRange = function (scope, element, attrs) {
                this.className = 'DateRange';
                this.element = element;
                this.startDateElement = element.find('.input-group').find('input:first');
                this.endDateElement = element.find('.input-group').find('input:last');
                this.attrs = attrs;

                this.hasDefaultDateRange = !!this.attrs.range;
                this.isDateTimeMode = attrs.mode != 'date' || attr.time != undefined;
                this.format = attrs.format || (this.isDateTimeMode ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
                var dateRange = uiDateRangeDefaultRange[this.attrs.range] || [];
                this.defaultStartDate = attrs.fromValue || dateRange[0];
                this.defaultEndDate = attrs.toValue || dateRange[1];
                this.limit = attrs.limit;
                uiFormControl.apply(this, arguments);
            };
        DateRange.prototype = $.extend(new uiFormControl(), {
            _init: function () {
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
            },

            render: function () {
                this.element.find("div").daterangepicker(this.config, function (start, end) {
                    start = start ? start.format(this.format) : "";
                    end = end ? end.format(this.format) : "";
                    this.startDateElement.val(start);
                    this.endDateElement.val(end);
                    this.$emit('change', this, start, end);
                }.bind(this));
            },

            reset: function () {
                this.startDateElement.val('');
                this.endDateElement.val('');
            },

            val: function (sv, ev) {
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
            }
        });
        return function(s, e, a, c, t){
            return new DateRange(s, e, a, c, t);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
(function () {
    angular.module('admin.component')
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
                    column = parseInt(column != undefined ? column : this.column);
                    if (column > 1) {
                        var eachColumn = 12 / column,
                            $body = this.element.find(' > div'),
                            doms = []; //没列占多少
                        $body.html();
                        for (var i = 0, dom; dom = this.formItems[i]; i++) { //过滤一下
                            if (dom.innerHTML != undefined) {
                                if (dom.type == 'hidden') {
                                    $body.append(dom);
                                }
                                else {
                                    doms.push(dom);
                                }
                            }
                        }
                        for (var i = 0; i < doms.length; i = i + column) {
                            var $rowDom = $('<div/>').addClass('row'),
                                tempI = i,
                                tempColumn = i,
                                other = [];
                            while (tempColumn < tempI + column && doms[tempColumn]) {
                                var dom = doms[tempColumn];
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
                            $.each(other, function (i, dom) {
                                $body.append(dom);
                            });
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
                    if (isJson == true) {
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
})(jQuery);
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .constant('uiInputMaskMap', {
        'backcard': '9999 9999 9999 9999'
    })
    .factory('uiInputFactory', function (msg, uiInputMaskMap, uiFormControl) {
        var m = new msg('Input'),
            Input = function (scope, element, attrs) {
                this.inputElement = element.find('input');
                this.attrs = attrs;
                this.mask = attrs.mask || uiInputMaskMap[attrs.type];
                uiFormControl.apply(this, arguments);
            };
        Input.prototype = $.extend(new uiFormControl(), {

            render: function () {
                if (this.mask && $.fn.inputmask) {
                    this.inputElement.inputmask(this.mask);
                }
                this.element.removeAttr('type');
            },

            reset: function () {
                this.inputElement.val('');
            },

            disabled: function (open) {
                this.attr('disabled', open);
            },

            attr: function (k, v) {
                if (v) {
                    this.inputElement.attr(k, v);
                }
                else {
                    return this.inputElement.attr(k);
                }
            },

            val: function (v) {
                if (v != undefined) {
                    this.inputElement.val(v);
                    return this;
                }
                else {
                    return this.inputElement.val();
                }
            }
        });
        return function (s, e, a, c, t) {
            return new Input(s, e, a, c, t);
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
    .factory('uiRegionHelper', function ($q, logger, msg) {
        var m = new msg('UiRegionHelper'),
            requestQueue = [],

            isInitDataMaping = false,
            isInitDataMap = false,
            dataMapUrl = 'http://pic.ofcard.com/themes/common/region/China_Region_Last.js',
            dataMap = undefined,

            isInitDataList = false,
            dataList = undefined,


            isInitTreeData = false,
            strandardTreeData = undefined,
            allTreeData = undefined,
            rootId = '086',
            getSubDataList = function (pid, placeholder, $el, isRequire) {
                if (isRequire && pid == undefined) {
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
                        var provinceId, cityId, streetId;
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
                                var p = allTreeData[target.pid];
                                provinceId = p.id;
                                cityId = sid;
                                self.getProvince($pel);
                                self.getCity(p.id, $cel);
                                self.getStreet(cityId, $sel);
                                d.resolve([null, target, p]);
                                break;
                            //区的话, 取他的市和省
                            case 's':
                                var c = allTreeData[target.pid];
                                var p = allTreeData[c.pid];
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
                return {data: data || [], allowClear: true, placeholder: '请选择省'}
            },

            toCityData: function(data){
                return {data: data || [], allowClear: true, placeholder: '请选择市'}
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
angular.module('admin.component')
    .factory('uiSelectFactory', function (msg, ajax, uiFormControl, ValueService) {
        var m = new msg('Select'),
            Select = function (scope, element, attrs) {
                this.selectElement = element.find('select');
                this.dataKeyName = attrs.keyName || 'key';
                this.dataValueName = attrs.valueName || 'text';
                this.defaultResetValue = attrs.isMulti ? '' : (this.selectElement.find('option:eq(0)')[0] ? this.selectElement.find('option:eq(0)').val() : '');
                this.model = attrs.model;
                this.init = false;
                uiFormControl.apply(this, arguments);
            };
        Select.prototype = $.extend(new uiFormControl(), {

            _init: function () {
                var self = this;
                if (this.model) {

                    //监听一下model的变化
                    this.watch = this.scope.$watch(this.model, function (newValue) {
                        if (newValue != undefined)
                            this.val(newValue);
                        else
                            this.val(this.defaultResetValue);
                    }.bind(this));

                    //如果model没有值, 默认选择第一个
                    if (!ValueService.get(this.scope, this.model)) {
                        var val = this.attrs.value ? this.attrs.value : this.defaultResetValue;
                        ValueService.set(this.scope, this.model, val);
                    }
                }

                //远程加载数据
                if (this.attrs.url) {
                    this.load(this.attrs.url);
                }

                if (!this.model && this.attrs.value) {
                    this.val(this.attrs.value);
                }
                this.element.removeAttr('value');
            },

            load: function (url, value, isClean) {
                var self = this;
                return ajax.post(url).then(function (responseData) {
                    self.setData(responseData, isClean);
                    if (value) {
                        self.val(value);
                    }
                    else{
                        var val = self.val(),
                            m = /^\?.+:(.+)\s+\?$/.exec(val);
                        self.val(m ? m[1] : val);
                    }
                });
            },

            /**
             *
             */
            disabled: function (open) {
                this.selectElement.prop('disabled', open);
                this.render();
            },

            /**
             *
             */
            render: function () {
                if (this.init) {
                    this.selectElement.selectpicker('refresh');
                }
                else {
                    this.selectElement.selectpicker({
                        iconBase: 'fa',
                        tickIcon: 'fa-check'
                    });
                    this.init = true;
                }
            },

            /**
             *
             * @param data
             * @param isClean
             */
            setData: function (data, isClean, dataName, dataValue) {
                dataName = dataName || this.dataKeyName;
                dataValue = dataValue || this.dataValueName;
                if (isClean) {
                    this.selectElement.html('');
                }
                if ($.isArray(data)) {
                    $.each(data, function (i, item) {
                        this.selectElement.append(this.toOption(item, dataName, dataValue));
                    }.bind(this));
                }
                else {
                    $.each(data, function (group, items) {
                        var $optiongroup = this.toOptionGroup(group);
                        $.each(items, function (i, item) {
                            $optiongroup.append(this.toOption(item, dataName, dataValue))
                        }.bind(this));
                        this.selectElement.append($optiongroup);
                    }.bind(this));
                }
                this.reset();
            },

            /**
             *
             * @param item
             * @param dataName
             * @param dataValue
             * @returns {*|jQuery}
             */
            toOption: function (item, dataName, dataValue) {
                var isString = angular.isString(item),
                    itemName = isString ? item : item[dataName],
                    itemValue = isString ? item : item[dataValue];
                var $option = $('<option/>').attr('value', itemName).html(itemValue);
                this.$emit('uiselect.onOption', $option, item);
                $option.data('item', item);
                return $option;
            },

            /**
             *
             * @param name
             * @returns {*|jQuery}
             */
            toOptionGroup: function (name) {
                var $option = $('<optgroup/>').attr('label', name);
                return $option;
            },

            /**
             *
             */
            reset: function () {
                this.selectElement.val(this.defaultResetValue);
                this.render();
            },

            /**
             *
             * @param fn
             */
            change: function (fn) {
                this.selectElement.change(fn);
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
                if (v != undefined) {
                    this.selectElement.val(v);
                    this.render();
                    return this;
                }
                else {
                    return this.selectElement.val();
                }
            }
        });
        return function (s, e, a, c, t) {
            return new Select(s, e, a, c, t);
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
    .constant('userConfig', {
        url: '/sysconfig/orguser/select',
        labelName: 'name',
        valueName: 'staffno'
    })
    .constant('tagConfig', {
        url: '/sysconfig/tag/list?classify=',
        labelName: 'name',
        valueName: 'id'
    })
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

                if (attrs.multi != undefined) {  //开启多选, select元素不能开启
                    selectOption.multiple = true;
                }
                if (attrs.url != undefined) { //开启远程查询
                    if (attrs.multi != undefined) {
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
                if (this.attrs.multi != undefined && this.attrs.setCheck) {
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

                    if (this.attrs.multi != undefined) {
                        this.selectValues.push(evt.val);
                        this.selectItems.push(evt.object);
                    }
                    else {
                        this.selectValues = [evt.val];
                        this.selectItems = [evt.object];
                    }
                    this.$emit('uiSelect.doSelect', this.selectValues, this.selectItems);
                    if (this.attrs.model) {
                        ValueService.set(this.scope, this.attrs.model, this.attrs.multi != undefined ? this.selectValues : this.selectValues[0]);
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
                            if (sfs.length == 0 || sfs[0] == '') {
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
                        if (self.attrs.multi != undefined) {
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
                else if (element.val() != undefined) {
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
    .factory('uiSpinnerFactory', function (msg, uiFormControl, ValueService) {
        var m = new msg('Spinner'),
            Spinner = function (scope, element, attrs) {
                this.inputElement = element.find('input');
                this.spinner = null;
                uiFormControl.apply(this, arguments);
            };
        Spinner.prototype = $.extend(new uiFormControl(), {

            render: function () {
                this.spinner = this.element.spinner(this.attrs);
                if (this.attrs.model) {
                    if (this.attrs.value) {
                        ValueService.set(this.scope, this.attrs.model, this.attrs.value);
                    }
                    this.element.on('changed', function () {
                        ValueService.set(this.scope, this.attrs.model, this.val());
                        this.$emit('change', this.val())
                    }.bind(this));

                    this.scope.$watch(this.attrs.model, function(newValue){
                        if(newValue != this.val()){
                            this.val(newValue == undefined ? '0' : newValue);
                        }
                    }.bind(this));
                }
            },

            change: function (fn) {
                this.$on('change', fn);
            },

            reset: function () {
                this.inputElement.val('');
            },

            disabled: function (open) {
                this.attr('disabled', open);
            },

            attr: function (k, v) {
                if (v) {
                    this.inputElement.attr(k, v);
                }
                else {
                    return this.inputElement.attr(k);
                }
            },

            val: function (v) {
                if (v != undefined) {
                    this.inputElement.val(v);
                    return this;
                }
                else {
                    return this.inputElement.val();
                }
            }
        });
        return function (s, e, a, c, t) {
            return new Spinner(s, e, a, c, t);
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
    .factory('uiSwitchFactory', function (msg, uiFormControl, ValueService) {
        var m = new msg('Switch'),
            Switch = function (scope, element, attrs) {
                this.inputElement = element.find('input');
                this.onValue = attrs.onValue || 'on';
                this.offValue = attrs.offValue || 'off';
                this.attrs = attrs;
                this.model = attrs.model;
                uiFormControl.apply(this, arguments);
            };
        Switch.prototype = $.extend(new uiFormControl(), {

            render: function () {
                if ($.fn.bootstrapSwitch) {
                    this.inputElement.bootstrapSwitch({
                        size: 'small',
                        onSwitchChange: this.onChangeHandler.bind(this)
                    });

                    //初始值
                    this.inputElement.bootstrapSwitch('state', this.attrs.value == this.onValue);
                }
                this.inputElement[0].checked = true;

                if(this.model){
                    this.scope.$watch(this.model, function(newValue){
                        if(newValue != this.val()){
                            this.val(newValue);
                        }
                    }.bind(this));

                    //如果model没有值, 默认选择offvalue
                    if(!ValueService.get(this.scope, this.model)){
                        var val = this.offValue;
                        ValueService.set(this.scope, this.model, val || this.offValue);
                    }
                }
            },

            onChangeHandler: function (evt, state) {
                var v = state ? this.onValue : this.offValue;
                this.inputElement.val(v);
                this.inputElement[0].checked = true;
                this.$emit('change');
                if(this.model){
                    ValueService.set(this.scope, this.model, v);
                }
            },

            reset: function () {
                this.inputElement.val();
            },

            disabled: function (open) {
                this.inputElement.bootstrapSwitch('disabled',open=='true');
            },


            val: function (val) {
                if (val != undefined) {
                    this.inputElement.bootstrapSwitch('state', val == this.onValue);
                    return this;
                }
                else {
                    return this.inputElement.val();
                }
            }
        });
        return function(s, e, a, c, t){
            return new Switch(s, e, a, c, t);
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
    .factory('uiTabFactory', function (msg, ajax, Event, $compile) {
        var m = new msg('Tab'),
            Tab = function (scope, element, attrs) {
                Event.call(this);
                this.element = element;
                this.contentElement = element.find('.tab-content');
                this.default = parseInt(attrs.default || 0);
                this.attrs = attrs;
                this.scope = scope;
                this.activeItem = null;
                this.items = [];
            };
        Tab.prototype = {

            /**
             *
             */
            init: function () {
                this.showAtIndex(this.default);
            },

            /**
             *
             */
            change: function (fn) {
                this.$on('change', fn);
            },

            /**
             *
             */
            remove: function (fn) {
                this.$on('remove', fn);
            },

            /**
             *
             * @returns {*|Tab.contentElement}
             */
            getContainer: function () {
                return this.contentElement;
            },

            /**
             *
             */
            showAtItem: function (tabItem) {
                if (!tabItem) {
                    return;
                }

                //
                if (this.activeItem) {
                    this.activeItem.active(false).hide();
                }

                //
                var container = this.getContainer();
                tabItem.active(true).show().then(function (content) {
                    if (content.parent().length == 0) {
                        container.append(content);
                    }
                    content.show();
                });

                //
                this.$emit('change', tabItem, tabItem.getIndex());

                //
                this.activeItem = tabItem;
                return this;
            },

            /**
             *
             * @param index
             */
            showAtIndex: function (index) {
                this.showAtItem(this.items[index]);
            },

            /**
             *
             * @param tabItem
             */
            addItem: function (tabItem) {
                tabItem.index = this.items.length;
                this.items.push(tabItem);
                tabItem.onActive(this.onActiveHandler.bind(this));
                tabItem.onRemove(this.onRemoveHandler.bind(this));
            },

            /**
             *
             */
            onActiveHandler: function (tabItem) {
                this.showAtItem(tabItem);
            },

            /**
             *
             */
            onRemoveHandler: function (tabItem, index) {
                this.items.splice(index, 1);
                if (this.activeItem == tabItem) {
                    var preIndex = index - 1,
                        nextIndex = index;
                    if (preIndex >= 0 && preIndex <= this.items.length - 1) {
                        this.showAtIndex(preIndex);
                    }
                    else if (nextIndex >= 0 && nextIndex < this.items.length - 1) {
                        this.showAtIndex(nextIndex);
                    }
                }
                //
                this.$emit('remove', tabItem, tabItem.getIndex());
            },

            /**
             * 新增简单tab
             */
            addTab: function (head, content, active) {
                var h = [
                        '<ui-tab-item head="' + head + '">',
                        content,
                        '</ui-tab-item>'
                    ],
                    $e = $(h.join(''));
                this.element.find('ul').append($e);
                $compile($e)(this.scope);
                if (active) {
                    this.showAtIndex(this.items.length - 1);
                }
            }
        };
        return function (scope, element, attrs) {
            return new Tab(scope, element, attrs);
        };
    });
angular.module('admin.component')
    .directive('uiTab', function (uiTabFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs) {
                        tab = uiTabFactory(scope, element, attrs);
                        var ref = attrs.ref || '$tab';
                        scope[ref] = tab;
                        componentHelper.tiggerComplete(scope, ref, tab);
                    },
                    post: function () {
                        tab.init();
                    }
                };
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab', attrs);
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
    .factory('uiTabItemFactory', function ($compile, msg, ajax, Event) {
        var m = new msg('TabItem'),
            TabItem = function (scope, element, attrs, $content) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.content = $content ? this.wrapperContent($content) : null;
                this.elementTitle = element.find('span');
                this.attrs = attrs;
                this.scope = scope;
                this.items = [];
                this.dropdown = element.parent().hasClass('dropdown-menu');
            };
        TabItem.prototype = {

            /**
             *
             */
            onClickHandler: function () {
                this.$emit('uitabitem.active', this);
            },

            /**
             *
             */
            onRemoveHandler: function (evt) {
                var index = this.getIndex();
                if (this.content) {
                    this.content.remove();
                }
                if (this.element) {
                    this.element.remove();
                }
                this.$emit('uitabitem.remove', this, index);
                delete this.listenerMap;
                evt.stopPropagation();
            },

            /**
             *
             * @param fn
             */
            onActive: function (fn) {
                this.$on('uitabitem.active', fn);
            },

            /**
             *
             */
            onRemove: function (fn) {
                this.$on('uitabitem.remove', fn);
            },

            /**
             *
             * @param isActive
             */
            active: function (isActive) {
                var $dom = null;
                if (this.dropdown) {
                    $dom = this.element.parent().parent();
                }
                else {
                    $dom = this.element;
                }
                $dom[isActive ? 'addClass' : 'removeClass']('active');
                return this;
            },

            /**
             *
             */
            wrapperContent: function (c) {
                return $('<div/>').addClass('tab-pane fade').append(c);
            },

            /**
             *
             */
            hide: function () {
                if (this.content) {
                    this.content.removeClass('active in').hide();
                }
                return this;
            },

            /**
             *
             */
            title: function(t){
                if(t){
                    this.elementTitle.html(t);
                }
                else{
                    return this.elementTitle.html();
                }
            },

            /**
             *
             */
            show: function () {
                var defer = $.Deferred();
                if (this.content) {
                    defer.resolve(this.content);
                }
                else if (this.attrs.url) {
                    $.get(this.attrs.url, function (r) {
                        this.content = $compile(this.wrapperContent(r))(this.scope);
                        defer.resolve(this.content);
                    }.bind(this));
                }
                return defer.promise().then(function (c) {
                    c.addClass('active in');
                    return c;
                });
            },

            /**
             *
             */
            getIndex: function () {
                return this.element.index();
            }
        };
        return function (scope, element, attrs, $content) {
            return new TabItem(scope, element, attrs, $content);
        };
    });
angular.module('admin.component')
    .directive('uiTabItem', function (uiTabItemFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var tabRef = componentHelper.getComponentRef($element.parent(), '$tab'),
                    uiTabItem = uiTabItemFactory($scope, $element, $attrs, $transclude($scope));
                $scope.$tabItem = uiTabItem;
                $scope[tabRef].addItem(uiTabItem);
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab.item', $.extend({
                    tabRef: componentHelper.getComponentRef(element.parent(), '$tab'),
                    index: element.index()
                }, attrs));
            }
        };
    });

angular.module('admin.component')
    .directive('uiTabListItem', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab.list.item', $.extend({
                    tabRef: componentHelper.getComponentRef(element.parent(), '$tab')
                }, attrs));
            }
        };
    });

angular.module('admin.component')
    .directive('uiTabRemoteItem', function (uiTabItemFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: function ($scope, $element, $attrs) {
                var tabRef = componentHelper.getComponentRef($element.parent(), '$tab'),
                    uiTabItem = uiTabItemFactory($scope, $element, $attrs);
                $scope.$tabItem = uiTabItem;
                $scope[tabRef].addItem(uiTabItem);
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.tab.item', $.extend({
                    tabRef: componentHelper.getComponentRef(element.parent(), '$tab'),
                    index: element.index()
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
    .factory('uiMenuFactory', function (msg, ajax, Event) {
        var m = new msg('Menu'),
            Menu = function (scope, element, attrs) {
                Event.call(this);
                this.element = element;
                this.attrs = attrs;
                this.scope = scope;
                this.activeItem = null;
                this.init();
            };
        Menu.prototype = {

            /**
             *
             */
            init: function () {
                this.scope.activeItem = null;
                this.scope.menuItems = [];
                this.scope.onClickHandler = this.onClickHandler.bind(this);
                if (this.attrs.url) {
                    this.setUrl(this.attrs.url);
                }
            },

            /**
             *
             * @param url
             */
            setUrl: function (url) {
                ajax.get(url).then(function(data){
                    this.setData(data);
                }.bind(this));
            },

            /**
             *
             */
            setData: function (menuItems) {
                this.scope.menuItems = menuItems;
            },

            /**
             *
             * @param menuItem
             */
            onClickHandler: function(menuItem){
                if(this.scope.activeItem){
                    this.scope.activeItem.active = false;
                }
                this.scope.activeItem = menuItem;
                this.scope.activeItem.active = true;
            }
        };
        return function (s, e, a, c, t) {
            return new Menu(s, e, a, c, t);
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
    .directive('uiMenu', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element) {
                element.find(' li a').click(function (evt) {
                    var $a = $(evt.target);
                    $a.parent().parent().find('li').removeClass('active');
                    $a.parent().parent().find('.arrow').removeClass('open');

                    $a.parent().addClass('active');
                    $a.find('.arrow').addClass('open');
                });

                //
                var $a = element.find('a[href="' + window.location.hash + '"]');
                $a = $a.length > 0 ? $a : element.find('a[href="' + window.location.hash.replace(/\/[^\/]+$/, '') + '"]');
                $a.parents('li').each(function(i, li){
                    var $li = $(li);
                    $li.addClass('active');
                    $li.find(' > a .arrow').addClass('open');
                });
            },
            templateUrl: 'tpl.menu'
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
    .controller('uiPortalController', function ($scope, $attrs, $element, util, ajax, msg) {


        var m = new msg('Portal');


        //
        var hasCompleteSize = 0;
        $scope.$on('portletComplete', function (evt, portlet) {
            if (++hasCompleteSize >= portletSize) { //全部加载完毕, 开始走起
                var $originNext;
                $element.sortable({
                    connectWith: ".portlet-container",
                    items: ".portlet-container",
                    opacity: 0.8,
                    coneHelperSize: true,
                    placeholder: 'portlet-sortable-placeholder',
                    forcePlaceholderSize: true,
                    tolerance: "pointer",
                    helper: "clone",
                    tolerance: "pointer",
                    forcePlaceholderSize: !0,
                    helper: "clone",
                    cancel: ".portlet-sortable-empty, .portlet-fullscreen", // cancel dragging if portlet is in fullscreen mode
                    revert: 250, // animation in milliseconds
                    start: function(b, c){
                        $originNext = c.item.next().next(); //第一个next是他拖动后的虚拟狂
                    },
                    stop: function (b, c) {
                        var $item = c.item,
                            $newNext = $item.next(),
                            portlet = $item.data('portlet');
                        //
                        var i = $newNext ? $newNext.index() : null;
                        while($newNext.length > 0){
                            $newNext.data('portlet') && ($newNext.data('portlet').col = i++);
                            $newNext = $newNext.next();
                        }

                        //
                        var o = $originNext ? $originNext.index() : null;
                        while($originNext.length > 0){
                            $originNext.data('portlet') && ($originNext.data('portlet').col = o++);
                            $originNext = $newNext.next();
                        }

                        //
                        portlet.row = $item.parent().index();
                        portlet.col = $item.index();

                        $scope.storePortlets();

                        //放在最后面
                        $element.find('.portlet-sortable-empty').each(function(index, dom){
                            var $dom = $(dom);
                            $dom.appendTo($dom.parent());
                        });
                    }
                });
            }
        });


        $scope.storePortlets = function () {
            var cookieValue = {};
            $.each(portlets, function (index, portlet) {
                cookieValue[portlet.url] = {row: portlet.row, col: portlet.col};
            });
            $.cookie(cookieKey, JSON.stringify(cookieValue));
        }

        //
        var portletSize, portlets;
        var cookieKey = $attrs.store || 'portal';
        $scope.setPortlets = function (pp) {
            var cookieValue = util.toJSON($.cookie(cookieKey) || '{}'),
                remainPortlets = []; //未分配的portlet

            //
            hasCompleteSize = 0;
            portletSize = pp.length;
            portlets = pp;

            //
            $.each(portlets, function (index, portlet) {
                var cPortlet = cookieValue[portlet.url], //从cookie取用户自定义的
                    row = cPortlet ? cPortlet.row : portlet.row,
                    col = cPortlet ? cPortlet.col : portlet.col;
                if (row < $scope.columns.length) { //够放
                    $scope.setPortlet(row, col, portlet);
                }
                else { //不够放, 后面排队去
                    remainPortlets.push(portlet);
                }
            });

            //放剩余的
            $.each(remainPortlets, function (index, portlet) {
                $scope.setPortlet(index, portlet.col, portlet);
            });

            //
            $scope.resetColumns();

            //设置到cookie
            this.storePortlets();
        };
        $scope.setPortlet = function (row, col, portlet) {
            var columnSize = $scope.columns.length;
            row = row % columnSize;
            col = col;
            portlet.row = row;
            portlet.col = col;
            $scope.columns[row][col] = portlet;
        };

        $scope.resetColumns = function () {
            var r = [];
            for (var i = 0; i < $scope.columns.length; i++) {
                r.push([]);
            }
            $.each($scope.columns, function (row, columns) {
                $.each(columns, function(col, column){
                    if(column){
                        column.col = r[row].length;
                        r[row].push(column);
                        var p = r[row][col - 1];
                        p && (p.next = column); //设置下一个
                    }
                });
            });
            $scope.columns = r;
        };


        //计算多少列
        $scope.columns = [];
        var column = $attrs.column || 2;
        $scope.eachColumn = 12 / column;
        for (var i = 0; i < column; i++) {
            $scope.columns.push([]);
        }

        //
        if ($attrs.url) {
            ajax.get($attrs.url).then(function (responseData) {
                $scope.setPortlets(responseData);
            });
        }
        else {
            $scope.setPortlets([
                {url: '/static/portlet/portlet-1.jsp', row: 0, col: 0},
                {url: '/static/portlet/portlet-2.jsp', row: 0, col: 1},
                {url: '/static/portlet/portlet-3.jsp', row: 1, col: 0},
                {url: '/static/portlet/portlet-4.jsp', row: 1, col: 1},
                {url: '/static/portlet/portlet-5.jsp', row: 1, col: 2}
            ]);
            //m.error('必须设置url去获取portlet信息');
        }
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortal', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'uiPortalController',
            templateUrl: 'tpl.portal'
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
    .directive('uiPortletAction', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'tpl.portal.portlet.action'
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
    .directive('uiPortletActionPagination', function (PaginationFactory) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var url = attrs.url,
                    pageIndex = attrs.pageIndex,
                    pageSize = attrs.pageSize,
                    pageLimit = attrs.pageLimit,
                    pageDataName = attrs.pageDataName,
                    pageTotalName = attrs.pageTotalName,
                    init = false,
                    paginationFactory = new PaginationFactory(url, pageIndex, pageSize, pageLimit, pageDataName, pageTotalName),
                    handler = function (r) {
                        $.extend(scope, r);
                    };

                //
                scope.setUrl = function (url) {
                    paginationFactory.url = url;
                };

                //
                scope.load = function (index) {
                    index--;
                    if (index != paginationFactory.pageIndex || !init) {
                        init = true;
                        paginationFactory.getPage(index).then(handler);
                    }
                };
                scope.loadFirst = function (isForce) {
                    if(!scope.isFirst || isForce){
                        paginationFactory.prePage().then(handler);
                    }
                };
                scope.loadLast = function (isForce) {
                    if(!scope.isLast || isForce){
                        paginationFactory.nextPage().then(handler);
                    }
                };

                //
                scope.load(1);
            },
            templateUrl: 'tpl.portal.portlet.action.pagination'
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
    .directive('uiPortletActionSearch', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                if (attrs.onEnter) {
                    element.keydown(function (evt) {
                        if (evt.keyCode == 13 && scope[attrs.onEnter]) {
                            scope[attrs.onEnter](element.val());
                        }
                    });
                }
            },
            template: function (el, attrs) {
                return componentHelper.getTemplate('tpl.portal.portlet.action.search', attrs);
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
    .directive('uiPortletActionTab', function (uiTabFactory, componentHelper, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs) {
                        tab = uiTabFactory(scope, element, attrs);
                        tab.getContainer = function(){
                            return element.parents('.portlet').find('.portlet-body');
                        };
                        scope[attrs.ref] = tab;
                    },
                    post: function(){
                        if(tab.items.length > 0){
                            $timeout(function(){
                                tab.showAtIndex(0);
                            });
                        }
                    }
                };
            },
            template: function (el, attrs) {
                attrs.ref = attrs.ref || '$portletActionTab' + (new Date().getTime());
                return componentHelper.getTemplate('tpl.portal.portlet.action.tab', attrs);
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
    .directive('uiPortlet', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var $content = $transclude($scope),
                    $toolbar = $content.filter('.portlet-tool-bar');
                if ($toolbar.length == 0) {
                    $.each($content, function (i, c) {
                        if (c.nodeName.indexOf('UI-PORTLET-ACTION') != -1) {
                            $toolbar = $(c);
                            return false;
                        }
                    });
                }
                $element.find('.portlet-body').append($content);
                if ($toolbar.length != 0) {
                    $toolbar.insertAfter($element.find('.caption'));
                }

                componentHelper.tiggerComplete($scope, $attrs.ref || '$portlet', $scope);
            },
            template: function (el, attrs) {
                return componentHelper.getTemplate('tpl.portal.portlet', attrs);
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
    .controller('uiPortletContainerController', function ($scope, $attrs, $element) {
        $element.data('portlet', $scope.portlet).load($scope.portlet.url, function(){
            $scope.$emit('portletComplete');
        });
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletContainer', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'uiPortletContainerController',
            templateUrl: 'tpl.portal.portlet.container'
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
    .directive('uiTableCheckColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('tableCheckColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {
                $attrs.checked = true;
                var $dom = $element.find('input'),
                    ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    name = $attrs.name;

                //
                $dom.click(function (evt) {
                    var isChecked = evt.target.checked;
                    $scope[ref].selectAllHandler(isChecked, name);
                    evt.stopPropagation();
                });
                $scope.$on('uitable.selectAllChecked', function (evt, isAll) {
                    $dom[0].checked = isAll;
                    $.fn.uniform && $dom.uniform();
                });

                //
                var render = function (rowData) {

                    //判断之前是否被选过
                    var isContainValue = $scope[ref].containItem(rowData);
                    if (isContainValue) {
                        $scope[ref].pageSelectNum.push(true);
                    }
                    else{
                        $scope[ref].pageSelectNum.push(false);
                    }

                    //
                    $scope.$on('uitable.selectAll', function (evt, isAll) {
                        $dom[0].checked = isAll;
                        $.fn.uniform && $dom.uniform();
                    });

                    //
                    var $dom = $('<input type="checkbox" pk="' + rowData[name] + '"/>').val(rowData[name]).click(function (evt) {
                        $scope[ref].selectOneHandler(evt.target.checked, $attrs.name, rowData);
                        evt.stopPropagation();
                    });

                    //
                    $dom[0].checked = isContainValue;
                    return $dom;
                };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
                    $scope[ref].idName = name;
                }
                else {
                    m.error('uiTableCheckColumn必须放在uiTable里面');
                }
            },
            templateUrl: 'tpl.table.column.checked'
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
    .directive('uiTableDateColumn', function (uiTableColumnService, uiEditableDateInputFactory, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs, util) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    format = $attrs.format || 'yyyy-MM-dd HH:mm:ss',
                    name = $attrs.name,
                    render = function (rowData) {
                        var val = rowData[name];
                        if (val) {
                            val = util.dateFormatStr(val, format);
                        }
                        return $('<div/>').html(val);
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render, uiEditableDateInputFactory), $attrs.index);
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
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
    .directive('uiTableImageColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('TableImageColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {

                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    placeholder = $attrs.placeholder || 'http://usr.im/110x30?text=What',
                    name = $attrs.name,
                    styleWidth = $attrs.imageWidth,
                    styleHeight = $attrs.imageHeight,
                    render = function (rowData) {
                        var val = rowData[name];
                        val = val != undefined ? val : placeholder;
                        return $('<img/>').attr('src', val).css({width: styleWidth, height: styleHeight});
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
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
    .directive('uiTableColumn', function (uiTableColumnService, componentHelper, msg, $injector) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    hasTransclude = $transclude().length > 0,
                    name = $attrs.name || '',
                    render = function (rowData) {
                        if (hasTransclude) {
                            var $doms = null;
                            $transclude($scope.$new(), function (c, s) {
                                s.data = rowData;
                                $doms = c;
                            });
                            return $doms;
                        }
                        else {
                            var customRenderName = 'render' + name.charAt(0).toUpperCase() + name.substr(1),
                                v = rowData[name];
                            if ($scope[customRenderName]) {
                                return $scope[customRenderName](rowData);
                            }
                            return v != undefined ? $('<div/>').html(v) : v;
                        }
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    var editor = null;
                    if ($attrs.editable != undefined) {
                        var editorName = 'uiEditable' + $attrs.editable.charAt(0).toUpperCase() + $attrs.editable.substring(1) + 'Factory';
                        try {
                            editor = $injector.get(editorName);
                        }
                        catch (e) {
                            editor = $injector.get('uiEditableInputFactory');
                        }
                    }
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render, editor), $attrs.index);
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
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
    .directive('uiTableOperationColumn', function (uiTableColumnService, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    render = function (rowData) {
                        var $doms = null;
                        $transclude($scope.$new(), function (c, s) {
                            s.data = rowData;
                            $doms = c;
                        });
                        return $doms;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                attrs.head = attrs.head || '操作';
                return componentHelper.getTemplate('tpl.table.column', attrs);
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
    .constant('uiTableProgressColumnTpl', [
        '<div style="border: 1px solid #57b5e3;" class="progress progress-striped active" role="progressbar"style="margin-bottom:0px;">',
        '<div class="progress-bar"></div>',
        '</div>'
    ].join(''))
    .directive('uiTableProgressColumn', function (uiTableColumnService, componentHelper, uiTableProgressColumnTpl, msg) {
        var m = new msg('TableProgressColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {

                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    name = $attrs.name,
                    render = function (rowData) {
                        var val = rowData[name],
                            level = 'progress-bar-success';
                        val = val != undefined ? val : 0;
                        if (val <= 25)
                            level = 'progress-bar-danger';
                        else if (val <= 50)
                            level = 'progress-bar-danger';
                        else if (val <= 75)
                            level = 'progress-bar-info';

                        var $d = $(uiTableProgressColumnTpl).attr('title', val + '%').find('div').addClass(level).animate({width: val + '%'}).end();
                        return $d;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
                }
                else {
                    m.error('uiTableProgressColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
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
    .filter('emptyFilter', function () {
        return function (val, defaultV) {
            return val || defaultV || '-';
        };
    })
    .factory('uiTableColumnService', function (msg) {
        var m = new msg('TableColumnService');
        return function (tableId, $scope, $attrs, render, editorFactory, editorConfig) {
            var columnConfig = {

                //自定义的属性
                sName: $attrs.name || '',
                mTitle: $attrs.head,
                bEditable: $attrs.editable,
                bChecked: $attrs.checked,
                mEditUrl: $attrs.editUrl,
                mAttrs: $attrs,

                //原生的属性
                sClass: $attrs.css || '',
                sWidth: $attrs.width || 'smart',
                bVisible: $attrs.novisible === undefined,
                bSortable: $attrs.sort !== undefined,
                mDataProp: function (aData, type) {
                    //
                    if (type != 'display') {
                        return '';
                    }
                    //datatable会调用两次，第一个获取数据，第二次用获取的数据，渲染数据....
                    if (arguments.length == 3) {
                        return arguments[2];
                    }
                    else {
                        var r = render ? render.apply(this, arguments) : aData[$attrs.name];

                        //针对字符串, 如果为空, 返回'-'
                        r = r != undefined ? r : '-'; //针对0或者false值
                        if (r != undefined && angular.isString(r)) {
                            r = $.trim(r);
                            r = r.length ? r : '-';
                            r = '<div>' + r + '</div>';
                        }

                        //
                        if ($attrs.editable != undefined) {
                            if (editorFactory) {
                                var edit = null,
                                    option = {
                                        url: $scope[tableId].editUrl,
                                        title: $attrs.head,
                                        pk: $scope[tableId].getIdByData(aData),
                                        name: $attrs.name,
                                        rule: $scope[tableId].getRuleByName($attrs.name),
                                        value: aData[$attrs.name]
                                    };
                                $scope.$on('uitable.editabled', function (evt, isEdit) {
                                    if (isEdit && edit) {
                                        edit.show();
                                    }
                                    else if (isEdit) {
                                        edit = editorFactory(r, $attrs, option, editorConfig);
                                    }
                                    else {
                                        edit.hide();
                                    }
                                });
                            }
                            else {
                                //m.error($attrs.name + '没有编辑器, 无法编辑');
                            }
                        }

                        //
                        return r;
                    }
                }
            };
            return columnConfig;
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
    .directive('uiTableStateColumn', function (uiTableColumnService, uiEditableChooseFactory, componentHelper, msg) {
        var m = new msg('tableColumn');
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    tpl = $attrs.tpl,
                    name = $attrs.name,
                    defaultValue = $attrs.default,
                    render = function (rowData) {
                        var val = rowData[name],
                            $dom = null;
                        if (tpl) {
                        }
                        else {
                            $transclude(function (clone) {
                                $dom = clone.filter('[state="' + val + '"]');
                                if ($dom.length == 0) { //用默认值
                                    $dom = clone.filter('[state="' + defaultValue + '"]');
                                }
                                if ($dom.length == 0) { //还没有...
                                    for (var i = 0, c; c = clone[i]; i++) {
                                        if (c.innerHTML && c.innerHTML.indexOf(defaultValue) != -1) {
                                            $dom = $(c);
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                        return $dom.length > 0 ? $dom : null;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    var choosableData = [];
                    $transclude().each(function (i, dom) {
                        var $dom = $(dom),
                            key = $dom.attr('state'),
                            val = $dom.html();
                        if (key && val) {
                            choosableData.push({value: key, text: val});
                        }
                    });
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render, uiEditableChooseFactory, choosableData), $attrs.index);
                }
                else {
                    m.error('uiTableColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
            }
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//  创建Table的委托对象, 目前使用datatable作为第三方库, 方法和其他差不多
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiTableEditableFactory', function (msg) {
        var m = new msg('TableEditable'),
            TableEditable = function () {
                this.editUrl = this.attrs.editUrl || '';
                this.editUrl = this.editUrl + (this.editUrl.indexOf('?') == -1 ? '?' : '&') + 'idName=' + this.attrs.idName;
                this.editFormName = this.attrs.formName;
                this.editRuleMap = {};
                if (this.editFormName) {
                    $.getJSON('/validator?cm=' + this.editFormName, function (rules) {
                        this.editRuleMap = rules;
                    }.bind(this));
                }
                else if (this.editUrl) {
                    //m.error('开始编辑模式, 但是未提供form-name校验数据的地址');
                }

                this.toggleEdit = function (isEdit) {
                    this.scope.$broadcast('uitable.editabled', isEdit);
                };
                this.getRuleByName = function (name) {
                    return this.editRuleMap[name] || {};
                };
            };

        /**
         *
         */
        return TableEditable;
    })
;
//-----------------------------------------------------------------------------------------------
//
//
//  创建Table的委托对象, 目前使用datatable作为第三方库, 方法和其他差不多
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiTableFactory', function (uiTableDelegate, uiTableEditableFactory, util, logger, ajax, msg, Event, $compile) {
        var m = new msg('table'),
            Table = function (scope, element, attrs) {
                Event.call(this);
                this.columns = [];
                this.nopageMode = attrs.nopage !== undefined;
                this.idName = attrs.idName;
                this.pageResult = {};
                this.selectValues = [];
                this.selectItems = [];
                this.instance = null;
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.searchParams = null;
                this.pageSelectNum = [];
                uiTableEditableFactory.call(this);
            };

        Table.prototype = {

            /**
             * 初始化
             */
            initTable: function () {
                this.instance = uiTableDelegate(this, this.element, this.attrs, this.columns);
                this.element.on('click', 'tr', function (evt) {
                    //if(evt.target.nodeName == 'TR' || evt.target.nodeName == 'TD'){
                    //    var $tr = $(this);
                    //    $tr.find('td:eq(0) input[type="checkbox"]').click();
                    //    $tr.toggleClass('selected');
                    //}
                });
            },

            /**
             *
             */
            initEvnet: function () {
            },

            /**
             * 新增列
             * @param column
             */
            setColumn: function (column, index){
                index = parseInt(index);
                if(index && !isNaN(index)){
                    this.columns.splice(index, 0, column);
                }
                else{
                    index = this.columns.length;
                    this.columns.push(column);
                }
                if (this.instance) {
                    var setting = this.instance.fnSettings(),
                        headers = setting.aoHeader[0],
                        th = this.element.find('th').eq(index)[0],
                        columns = setting.aoColumns;
                    column.fnGetData = column.mDataProp;
                    column = $.extend({}, columns[columns.length - 1], column);
                    headers.splice(index, 0, {cell: th, unique: true});
                    columns.splice(index, 0, column);
                }
                $.each(this.columns, function(i, c){
                    c.mIndex = i;
                });
            },

            /**
             *
             * @param head
             * @param name
             */
            addColumn: function (head, name, index) {
                var def = '<ui-table-column head="' + head + '" name="' + name + '" data-index="' + index + '"></ui-table-column>';
                this.addCustomColumn(def, index);
            },

            /**
             *
             * @param head
             * @param name
             * @param render
             */
            addCustomColumn: function (def, index) {
                var $tr = this.element.find('tr:eq(0)'),
                    $th = index == undefined ? $tr.find('th:last-child') : $tr.find('th:eq(' + index + ')'),
                    $def = $(def);
                $def.insertAfter($th);
                $compile($def)(this.scope);
            },

            /**
             *
             */
            removeColumnAtIndex: function (index) {
                this.element.find('tr:eq(0) th:eq(' + index + ')').remove();
                var setting = this.instance.fnSettings();
                setting.aoHeader[0].splice(index, 1);
                setting.aoColumns.splice(index, 1);
                this.columns.splice(index, 1);
            },

            /**
             * 获取rowData
             * @param rowIndex
             * @returns {*}
             */
            getDataAtIndex: function (rowIndex) {
                return this.pageResult.aaData ? this.pageResult.aaData[rowIndex] : null;
            },

            /**
             * 获取rowData的id
             * @param rowIndex
             * @returns {*}
             */
            getIdByIndex: function (rowIndex) {
                var d = this.getDataAtIndex(rowIndex);
                return this.getIdByData(d);
            },

            /**
             *
             */
            getIdByData: function (d) {
                return d ? d[this.idName] : null;
            },

            /**
             * 是否包含该item
             */
            containItem: function (rowData) {
                var id = rowData[this.idName];
                for (var i = 0; i < this.selectValues.length; i++) {
                    if (this.selectValues[i] === id) {
                        return true;
                    }
                }
                return false;
            },

            /**
             *
             * @param columnIndex
             * @returns {Array}
             */
            getDomsByColumnIndex: function (columnIndex) {
                var doms = [];
                this.element.find('tr:gt(0)').each(function (index, tr) {
                    doms.push($('td', tr).eq(columnIndex));
                });
                return doms;
            },

            /**
             * 获取rowData的主键
             * @param rowIndex
             * @returns {*}
             */
            getIdByIndex: function (rowIndex) {
                var rowData = this.getDataAtIndex(rowIndex),
                    pk = rowData ? rowData[this.idName] : null;
                return pk;
            },

            /**
             * 预处理数据
             * @param result
             */
            beforeDataHandler: function (result) {
                this.pageResult = result;
                if (this.nopageMode) {
                    this.selectItems = [];
                }
                this.pageSelectNum = [];
                this.$emit('uitable.dataSuccess', result);
            },

            /**
             * 预处理完以后
             * @param result
             */
            afterDataHandler: function (result) {
                if ($.fn.uniform) {
                    this.element.find('input[type=checkbox]').uniform();
                }

                var sn = 0,
                    trs = this.element.find('tr:gt(0)');
                $.each(this.pageSelectNum, function (i, isSelect) {
                    if (isSelect) {
                        sn++;
                        //$(trs[i]).addClass('selected');
                    }
                });

                this.scope.$broadcast('uitable.selectAllChecked', this.pageResult.aaData && sn == this.pageResult.aaData.length && sn != 0);
                this.$emit('uitable.renderSuccess', result);
            },

            /**
             * 数据获取报错
             * @param json
             */
            errorDataHandler: function (json) {
                this.$emit('uitable.dataFail', json);
            },

            /**
             * 刷新
             * @param params
             * @param url
             */
            refresh: function (params, url) {
                this.searchParams = params || this.searchParams;
                this.url = url || this.url;
                this.instance.fnPageChange(this.getCurrentPage() - 1);
                this.$emit('uitable.refreshData');
            },

            /**
             * 跳转
             * @param index
             */
            jumpTo: function (index) {
                if (/^\d+$/.test(index)) {
                    index = parseInt(index) - 1;
                }
                else if (index == undefined) {
                    index = this.getCurrentPage() - 1;
                }
                this.instance.fnPageChange(index != undefined ? Math.abs(index) : "first");
                this.$emit('uitable.refreshData');
            },

            /**
             * 获取当前页
             * @returns {null}
             */
            getCurrentPage: function () {
                var setting = this.instance.fnSettings();
                return Math.ceil(setting._iDisplayStart / setting._iDisplayLength) + 1;
            },

            /**
             * 查询, 设置条件, 返回第一页, 当查询的时候要去除所有选中的项目
             * @param params
             * @param url
             */
            search: function (params, url) {
                this.$emit('uitable.beforeSearch');
                this.selectItems = [];
                this.selectValues = [];
                this.searchParams = params || this.searchParams;
                this.url = url || this.url;
                this.jumpTo(1);
            },

            /**
             *
             */
            items: function (items, idName) {
                idName = idName || this.idName;
                var self = this;
                this.selectItems = items;
                this.selectValues = $.map(this.selectItems, function (selectItem) {
                    var pk = selectItem[idName],
                        $cDom = self.element.find('[pk="' + pk + '"]').attr('checked', true);
                    return pk;
                });
            },

            /**
             * 清空所有选中的行
             * @param isAll true是所有选中的包括跨页, false是当前页面所有选中的
             */
            cleanSelect: function (isAll) {
                if (isAll) {
                    this.selectItems = [];
                    this.selectValues = [];
                }
                else {
                    this.selectAllHandler(false);
                }
            },

            /**
             * 全选
             * @param isChecked
             * @param idName
             */
            selectAllHandler: function (isChecked, idName) {
                idName = idName || this.idName;
                var pageDatas = this.pageResult.aaData || [],
                    call = function () {
                        if (isChecked) {
                            //this.element.find('tr:gt(0)').addClass('selected');
                            this.selectItems = this.selectItems.concat($.grep(pageDatas, function (data) {
                                return !this.containItem(data);
                            }.bind(this)));
                        }
                        else {
                            //this.element.find('tr:gt(0)').removeClass('selected');
                            this.selectItems = $.grep(this.selectItems, function (item) {
                                for (var i = 0; i < pageDatas.length; i++) {
                                    if (pageDatas[i][this.idName] == item[this.idName]) {
                                        return false;
                                    }
                                }
                                return true;
                            }.bind(this));
                        }
                        this.selectValues = $.map(this.selectItems, function (selectItem) {
                            return selectItem[idName];
                        });
                        this.scope.$broadcast('uitable.selectAll', isChecked);
                    }.bind(this);
                if (!this.scope.$$phase) {
                    this.scope.$apply(call);
                }
                else {
                    call();
                }
            },

            /**
             * 单选
             * @param isChecked
             * @param idName
             * @param rowData
             */
            selectOneHandler: function (isChecked, idName, rowData) {
                idName = idName || this.idName;
                this.scope.$apply(function () {
                    if (isChecked) {
                        this.selectItems.push(rowData);
                        this.selectValues.push(rowData[idName]);
                    }
                    else {
                        for (var i = 0, item; item = this.selectItems[i]; i++) {
                            if (item[idName] == rowData[idName]) {
                                this.selectItems.splice(i, 1);
                                this.selectValues.splice(i, 1);
                                break;
                            }
                        }
                    }
                    this.scope.$broadcast('uitable.selectAllChecked', this.selectItems.length == this.pageResult.aaData.length && this.selectItems.length != 0);
                }.bind(this));
            },

            /**
             * 清空状态
             */
            cleanState: function () {
                if (this.attrs.stateKey) {
                    ajax.post('/dataTable/stateClean', {sStateKey: this.attrs.stateKey}).then(function () {
                        m.success("表格缓存信息更新成功！");
                        setTimeout('window.location.href = window.location.href;', 1000);
                    });
                } else {
                    m.error("该表格没有设置缓存！");
                }
            }
        };

        /**
         *
         */
        return function (scope, element, attrs) {
            return new Table(scope, element, attrs);
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTable', function (uiTableFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,

            compile: function () {
                var uiTable = null;
                return {
                    pre: function (scope, element, attrs) {
                        var ref = attrs.ref || '$table';
                        uiTable = uiTableFactory(scope, element, attrs);
                        scope[ref] = uiTable;
                        componentHelper.tiggerComplete(scope, ref, uiTable);
                    },
                    post: function () {
                        uiTable.initTable();
                    }
                };
            },
            templateUrl: 'tpl.table'
        };
    });

//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .provider('uiTableDelegate', function () {

        return {
            $get: function (util, ajax, logger) {
                return function (table, element, attrs, columns) {
                    var sStateKey = attrs.stateKey,  //属性state-key  需要唯一设计，每张表都要设置没有默认值，建议url以"_"分割，不要过长
                        sQuerySortStr = "", //查询出的排序字符串字段
                        instance = $(element.find('table')).dataTable({
                            "bDestroy": true,
                            "sDom": "<'table-scrollable't><'row'<'col-md-3 col-sm-12'li>r<'col-md-7 col-sm-12'p>>", // defaukt datatable without  horizobtal scroll
                            "bPaginate": attrs.nopage === undefined,
                            "bLengthChange": true,
                            "bFilter": false,
                            "bSort": true,
                            "bInfo": attrs.nopage === undefined,
                            "bAutoWidth": false,
                            "bStateSave": true,//保存条件等状态在cookie里
                            "aoColumns": columns,
                            "aaSorting": util.toJSON(attrs.sort || '[]'),
                            'fnInitComplete': function () {
                                if (attrs.nopage != undefined) {
                                    return;
                                }
                                try {
                                    var $div = this.parent().parent().find('div.row'),
                                        $form = $([
                                            '<div class="col-md-2">',
                                            '<div class="input-group">',
                                            '<input type="text" class="form-control" placeholder="跳转页数">',
                                            '<span class="input-group-btn">',
                                            '<a href="javascript:;" class="btn green" style="font-size: 12px;">Go</a>',
                                            '</span>',
                                            '</div>',
                                            '</div>'
                                        ].join('')),
                                        handler = function () {
                                            var val = $input.val();
                                            if (/\d+/.test(val)) {
                                                table.jumpTo(val);
                                            }
                                            else {
                                                $input.val('');
                                            }
                                        },
                                        $btn = $form.find('a'),
                                        $input = $form.find('input');
                                    //
                                    $div.append($form);

                                    //
                                    $btn.click(handler);
                                    $(document).keydown(function (evt) {
                                        if (evt.keyCode == 13) {
                                            handler();
                                        }
                                        evt.stopImmediatePropagation();
                                    });
                                }
                                catch (e) {
                                    logger.error(e);
                                }
                            },
                            "fnServerData": function (sSource, aoData, fnCallback) {
                                if ((!attrs.url && !table.url) || attrs.manual != undefined) {
                                    delete attrs.manual;
                                    fnCallback({aaData: [], iTotalRecords: 0, iTotalDisplayRecords: 0});
                                    return;
                                }

                                //请求参数
                                var url = table.url || attrs.url;

                                //
                                if (table.searchParams) {
                                    var s = [];
                                    if ($.isArray(table.searchParams)) {
                                        s = table.searchParams;
                                    }
                                    else {
                                        $.each(table.searchParams, function (k, v) {
                                            s.push({name: k, value: v});
                                        });
                                    }
                                    aoData = aoData.concat(s);
                                }

                                //
                                ajax.post(url, aoData)
                                    .then(function (result) {
                                        if ($.isArray(result)) {
                                            result = {
                                                aaData: result,
                                                iTotalDisplayRecords: result.length,
                                                iTotalRecords: result.length
                                            };
                                        }
                                        else if(attrs.nameData && attrs.nameTotal){
                                            result = {
                                                aaData: result[attrs.nameData],
                                                iTotalDisplayRecords: result[attrs.nameTotal],
                                                iTotalRecords: result[attrs.nameTotal]
                                            }
                                        }
                                        table.beforeDataHandler(result);
                                        fnCallback(result);
                                        table.afterDataHandler(result);
                                    }, function (json) {
                                        table.errorDataHandler(json);
                                    })
                                    .finally(function (json) {
                                        table.$emit('uitable.requestComplete');
                                    });
                            },
                            "fnStateLoadParams": function (oSettings, oData) {
                            },
                            "fnStateLoad": function (oSettings, oData) {
                                var r = undefined;
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    $.ajax({
                                        url: '/dataTable/stateLoad',
                                        data: {sStateKey: sStateKey},
                                        type: 'POST',
                                        dataType: 'json',
                                        cache: false,
                                        async: false,
                                        timeout: 1000,
                                        success: function (json) {
                                            if (json.result == 'ok' && json.data != null && json.data != '') {
                                                r = json.data;
                                                sQuerySortStr = r.aaSorting.toString() + r.abVisCols.toString() + r.iLength;
                                            }
                                        }
                                    });
                                }
                                return r;
                            },
                            "fnStateSaveParams": function (oSettings, oData) {
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    oData.sStateKey = sStateKey;
                                    oData.oSearch = "";
                                    oData.aoSearchCols = "";
                                    oData.iStart = 0;
                                }
                            },
                            "fnStateSave": function (oSettings, oData) {
                                if (typeof (sStateKey) != 'undefined' && sStateKey.length > 0) {
                                    var sNowSortStr = oData.aaSorting.toString() + oData.abVisCols.toString() + oData.iLength;
                                    if (sQuerySortStr != sNowSortStr) {
                                        ajax.post('/dataTable/stateSave', {data: JSON.stringify(oData)}).then(function () {
                                            sQuerySortStr = sNowSortStr;
                                        });
                                    }
                                }
                            },
                            "oLanguage": {
                                "sProcessing": '<img src="/static/img/loading-spinner-grey.gif"/><span>&nbsp;&nbsp;正在查询...</span>',
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
                        });
                    return instance;
                };
            }
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
    .factory('uiTableToolBarFactory', function (msg, ajax, $injector) {
        var m = new msg('TableToolBar'),
            TableToolBar = function ($scope, tableId, $element, $attrs) {
                this.scope = $scope;
                this.element = $element;
                this.tableId = tableId;
                this.attrs = $attrs;
                this.blank = ',' + ($attrs.blank || '') + ',';
                this.isEdit = false;
                this.editText = '开启';
            };
        TableToolBar.prototype = {
            isShow: function (index, columnConfig) {
                return this.blank.indexOf(',' + index + ',') == -1 && !columnConfig.bChecked;
            },
            toggleColumn: function (evt, column) {
                column.bVisible = !column.bVisible;
                if (this.scope[this.tableId]) {
                    this.scope[this.tableId].instance.fnSetColumnVis(column.mIndex, column.bVisible, false);
                }
                evt.stopPropagation();
            },
            toggleEdit: function () {
                this.isEdit = !this.isEdit;
                this.editText = this.isEdit ? '关闭' : '开启';
                this.scope[this.tableId].toggleEdit(this.isEdit);
            },
            getHideBeforeIndex: function (index) {
                var css = this.instance.fnSettings().aoColumns;
                var num = 0;
                for (var i = 0; i < index; i++) {
                    if (css[i].bVisible)
                        num++;
                }
                return num;
            },
            doAddItem: function () {
                if (this.scope.addItem) {
                    this.scope.addItem();
                }
                else {
                    if (this.attrs.add) {
                        $injector.get('$state').go(this.attrs.add);
                    }
                    else {
                        m.error('点击添加数据按钮，但是没有设置地址, 请在add="地址"');
                    }
                }
            },
            doDelItem: function (values) {
                if (this.scope.delItem) {
                    this.scope.delItem(values);
                }
                else {
                    if (this.attrs.add) {
                        if (values.length > 1) {
                            ajax.remove(this.attrs.del, {ids: values.join(',')}).then(function () {
                                this.scope[this.tableId].refresh();
                            }.bind(this));
                        }
                        else {
                            ajax.remove(this.attrs.del + '/' + values[0]).then(function () {
                                this.scope[this.tableId].refresh();
                            }.bind(this));
                        }
                    }
                    else {
                        m.error('点击删除数据按钮，但是没有设置地址, 请在del="地址"');
                    }
                }
            }
        };
        return function ($scope, tableId, $element, $attrs) {
            return new TableToolBar($scope, tableId, $element, $attrs);
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
    .directive('uiToolBarTable', function (uiTableToolBarFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                element.find('[data-hover="dropdown"]').dropdownHover();

                //
                var tableRef = componentHelper.getComponentRef(element.parent().find('.ui-table'), '$table'),
                    ref = attrs.ref || '$tableToolBar',
                    toolbar = uiTableToolBarFactory(scope, tableRef, element, attrs);
                scope[ref] = toolbar;
                componentHelper.tiggerComplete(scope, ref, toolbar);
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.toolbar.table', {
                    editable: attrs.editable != undefined,
                    add: attrs.add != undefined,
                    del: attrs.del != undefined,
                    table: componentHelper.getComponentRef(element.parent().find('ui-table'), '$table'),
                    ref: componentHelper.getComponentRef(element, '$tableToolBar'),
                    tip: attrs.tip || '数据',
                    deltip: attrs.deltip || '删除'
                });
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
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attrs) {
                var content = attrs.tooltip,
                    title = attrs.title,
                    placement = attrs.placement || (title ? 'right' : 'top');

                //如果有标题有内容, 那么使用popup over
                if (title) {
                    element.popover({
                        title: title,
                        content: content,
                        placement: placement,
                        trigger: 'hover'
                    });
                }
                //否则使用tooltip
                else {
                    element.tooltip({
                        title: content,
                        placement: placement
                    });
                }
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
    .factory('uiTreeFactory', function (ajax, uiTreeConfig, uiRegionHelper, logger, util, msg, Event) {
        var m = new msg('Tree'),
            Tree = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.attrs = attrs;
                this.instance = null;
                this.selectItems = [];
                this.selectValues = [];
                this.treeNodeBtns = [];
                this.searchModel = attrs.searchModel;
                this.searchMode = attrs.searchMode;
                this.checkedValues = (attrs.setCheck || '').split(',');
                this.init();
            };

        //
        Tree.prototype = {

            /**
             *
             */
            init: function () {
                if (this.attrs.region != undefined) { //是否是树形区域
                    uiRegionHelper.getDataList(this.attrs.region || 's').then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else if (this.attrs.url) {
                    ajax.post(this.attrs.url).then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else {
                    //說明是手動拉
                }

                //
                if (this.attrs.onAdd != undefined) {
                    this.addTreeNodeBtn('新增', 'add', this.onTreeNodeAddClickHandler.bind(this));
                }
                if (this.attrs.onEdit != undefined) {
                    this.addTreeNodeBtn('编辑', 'edit', this.onTreeNodeEditClickHandler.bind(this));
                }
                if (this.attrs.onDel != undefined) {
                    this.addTreeNodeBtn('删除', 'remove', this.onTreeNodeDelClickHandler.bind(this));
                }

                //
                if (this.searchModel) {
                    var self = this;
                    this.scope.$watch(this.searchModel, function (nv) {
                        if (nv != undefined) {
                            self.filter(nv);
                        }
                    });
                }
            },

            /**
             *
             */
            refresh: function (params, url) {
                url = url || this.attrs.url;
                if (url) {
                    return ajax.post(url, params || {}).then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else {
                    m.error('未设置url, 无法请求');
                }
            },

            /**
             *
             */
            filter: function (filterText) {
                if (!this.dataList) //没数据, 玩个毛~
                    return;
                var searchList = this.dataList;
                if (filterText) {
                    filterText = filterText.toLowerCase();
                    var self = this;
                    searchList = [];
                    $.each(this.dataList, function (dataIndex, data) {
                        if (data.name.toLowerCase().indexOf(filterText) != -1) {
                            searchList = searchList.concat(self.getHierarchyDataById(data.id));
                        }
                    });
                    var r = [],
                        m = {};
                    $.each(searchList, function (index, data) {
                        if (!m[data.id]) {
                            r.push(data);
                        }
                        m[data.id] = data;
                    });
                    searchList = r;
                }
                this.setData(searchList, null, true);
                this.expandAll(true);
            },

            /**
             *
             * @param label
             * @param className
             * @param handler
             */
            addTreeNodeBtn: function (label, className, handler) {
                this.addTreeNodeBtnAtIndex(this.treeNodeBtns.length, label, className, handler);
            },

            /**
             *
             * @param label
             * @param className
             * @param handler
             */
            addTreeNodeBtnAtIndex: function (index, label, className, handler) {
                this.treeNodeBtns.splice(index, 0, {
                    label: label,
                    className: className,
                    handler: handler
                });
            },

            /**
             *
             */
            onTreeNodeAddClickHandler: function (treeNode) {
                var handlerName = this.attrs.onAdd;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-add, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            onTreeNodeDelClickHandler: function (treeNode) {
                var handlerName = this.attrs.onDel;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-del, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            onTreeNodeEditClickHandler: function (treeNode) {
                var handlerName = this.attrs.onEdit;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-edit, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            setData: function (resData, pid, isFilter) {
                //
                resData = resData.menuTreeList || resData || [];
                if (!!!isFilter) {
                    this.dataList = resData;
                    this.dataMap = {};
                    $.each(resData, function (nn, data) {
                        this.dataMap[data.id] = data;
                    }.bind(this));
                }
                if (this.attrs.root != undefined) {
                    var rootLabel = this.attrs.root || '根目录',
                        rootId = this.attrs.rootId || '0';
                    resData.push({"id": rootId, "open": "true", "pid": null, "name": rootLabel, "type": "1"});
                }

                //
                this.$emit('dataSuccess', resData);

                //
                this.instance = $.fn.zTree.init(this.element, uiTreeConfig(this), resData);
                this.expand(pid);
                if (this.checkedValues) {
                    this.checked(this.checkedValues);
                }
                var r = $.grep(resData, function (data) {
                    return data.checked + '' == 'true';
                });
                this.item(this.selectItems.concat(r));
            },

            /**
             * 获取层级关系
             */
            getHierarchyById: function (id) {
                var r = [],
                    node = this.getById(id);
                if (node) {
                    r.push(node);
                    while (node = node.getParentNode()) {
                        r.unshift(node);
                    }
                }
                return r;
            },

            /**
             *
             * @param id
             */
            getHierarchyDataById: function (id) {
                var r = [],
                    node = this.getDataById(id);
                if (node) {
                    r.push(node);
                    while (node = this.getDataById(node.pid)) {
                        r.unshift(node);
                    }
                }
                return r;
            },

            /**
             *
             * @param id
             * @returns {*}
             */
            getById: function (id) {
                return this.instance.getNodeByParam('id', id);
            },

            /**
             *
             */
            getDataById: function (id) {
                return this.dataMap[id];
            },

            /**
             * 展开
             * @param pid
             */
            expand: function (level) {
                level = level || this.attrs.expand;
                if (level == 'all') {
                    this.expandAll(true);
                    return;
                }
                if (level == undefined) {
                    return;
                }
                var instance = this.instance,
                    root = instance.getNodes()[0],
                    expandInternal = function (n, l) {
                        if (n && n.children && l-- > 1) {
                            for (var i = 0; i < n.children.length; i++) {
                                instance.expandNode(n.children[i], true, false, false); //打开下级
                                expandInternal(n.children[i], l);
                            }
                        }
                    };

                if (level == 1) { //只打开自己
                    instance.expandNode(root, true, false, false);
                }
                else {
                    expandInternal(root, level);
                }
            },

            /**
             *
             */
            expandAll: function (isExpand) {
                this.instance.expandAll(isExpand);
            },

            /**
             *
             * @param id
             */
            expandById: function (id) {
                var findNodes = this.getById(id);
                if (findNodes) {
                    this.instance.expandNode(findNodes, true, false, false);
                }
                else {
                    m.error('未找到id为[' + id + ']的节点, 无法展开');
                }
            },

            /**
             *
             * @param cs
             */
            checked: function (cs, isClean) {
                if (isClean) {
                    this.selectItems = [];
                    this.selectValues = [];
                }
                var r = [];
                for (var i = 0, c; i < cs.length; i++) {
                    c = cs[i];
                    if (c) {
                        var node = this.instance.getNodeByParam("id", c, null);
                        if (node) {
                            this.instance.checkNode(node, true, true);
                            r.push(node);
                        }
                    }
                }
                this.item(r);
            },

            /**
             *
             */
            item: function (item) {
                if (item) {
                    this.selectItems = item;
                    this.selectValues = $.map(this.selectItems, function (item) {
                        return item.id;
                    });
                }
                else {
                    return this.selectItems;
                }
            },

            /**
             *
             */
            val: function () {
                //NOT SUPPORTED
            },

            /**
             *  清空选中
             */
            cleanChecked: function () {
                var self = this;
                $.each(this.selectItems, function (i, selectItem) {
                    var node = self.instance.getNodeByParam("id", selectItem.id, null);
                    self.instance.checkNode(node, false, true);
                });
            },

            /**
             * 设置选中的数据
             * @param data
             */
            setSelectData: function (data) {
                this.selectItems = data;
                this.selectValues = $.map(this.selectItems, function (item) {
                    return item.id;
                });
            }
        };
        return function (scope, element, attrs) {
            return new Tree(scope, element, attrs);
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
    .directive('uiTree', function (uiTreeFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                var uiTree = uiTreeFactory(scope, element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$tree', uiTree);
            },
            template: function (element, attrs) {
                attrs.treeId = (new Date).getTime();
                return '<ul id="tree' + attrs.treeId + '" class="ztree" style="width:100%; overflow:auto;"></ul>';
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
    .provider('uiTreeConfig', function () {

        var defaultConfig = {
            check: {enable: true},
            edit: {enable: false},
            data: {
                key: {name: "name", childs: "childs", title: "name"},
                simpleData: {enable: true, idKey: "id", pIdKey: "pid", rootPId: "0"}
            },
            view: {addHoverDom: null, removeHoverDom: null},
            callback: {beforeClick: null, onClick: null, onCheck: null}
        };

        var defaultBtnBuilder = function (treeNodeBtnClass, treeNode) {
            var $span = $("#" + treeNode.tId + "_span");
            var $spanBtn = $("<span class='button'></span>").addClass(treeNodeBtnClass.className).attr('title', treeNodeBtnClass.label).click(function (evt) {
                treeNodeBtnClass.handler(treeNode);
                evt.stopPropagation();
            });
            $span.append($spanBtn);
            return {
                show: function () {
                    $spanBtn.show();
                },
                hide: function () {
                    $spanBtn.hide();
                }
            };
        };


        var Config = function (tree) {
            $.extend(this, defaultConfig);
            this.tree = tree;

            //
            this.check.enable = tree.attrs.check != 'false';
            this.edit.enable = tree.attrs.edit == 'true';

            //
            this.callback = {
                beforeClick: this.call.bind(this, 'onBeforeClick'),
                onClick: this.call.bind(this, 'onClick'),
                beforeCheck: this.call.bind(this, 'onBeforeCheck'),
                onCheck: this.onCheck.bind(this)
            };

            this.view = {
                addHoverDom: this.onMouseEnterHandler.bind(this),
                removeHoverDom: this.onMouseLeaveHandler.bind(this)
            };

            this.treeNodeBtnMap = {};
        };
        Config.prototype = {

            /**
             *
             * @param treeId
             * @param treeNode
             */
            onMouseEnterHandler: function (treeId, treeNode) {
                this.treeNodeBtnMap[treeNode.id] = this.treeNodeBtnMap[treeNode.id] || {};
                var treeNodeBtnInstances = this.treeNodeBtnMap[treeNode.id],  //所有这个treenode实例
                    treeNodeBtnClasses = this.tree.treeNodeBtns;  //这个tree正对treenode可以创建的扩展按钮
                $.each(treeNodeBtnClasses, function (index, treeNodeBtnClass) { //遍历, 如果创建过了就显示，没创建过就创建
                    var treeNodeBtnInstance = treeNodeBtnInstances[treeNodeBtnClass.label];
                    if (!treeNodeBtnInstance) {
                        treeNodeBtnInstance = defaultBtnBuilder(treeNodeBtnClass, treeNode);
                        treeNodeBtnInstances[treeNodeBtnClass.label] = treeNodeBtnInstance;
                    }
                    treeNodeBtnInstance.show();
                });
            },

            /**
             *
             * @param treeId
             * @param treeNode
             */
            onMouseLeaveHandler: function (treeId, treeNode) {
                $.each(this.treeNodeBtnMap[treeNode.id] || {}, function (index, treeNodeBtnInstance) {
                    treeNodeBtnInstance.hide();
                });
            },

            onCheck: function (evt, id, nodeData) {
                var selectDatas = this.tree.instance.getCheckedNodes(true);
                this.tree.setSelectData(selectDatas);
                this.call('onCheck', ['', evt, id, nodeData]);
            },

            call: function (attrName) {
                var args = arguments,
                    bc = this.tree.attrs[attrName],
                    scope = this.tree.scope;
                if (bc) {

                    args = Array.prototype.slice.call(args, 1);
                    var r = scope[bc].apply(scope, args);
                    try{ scope.$apply(); } catch(e){ }
                    return r;
                }
                else {
                    return true;
                }
            }
        };


        return {

            /**
             * 提供给设置配置
             * @param config
             */
            setConfig: function (config) {
                defaultConfig = $.extend(defaultConfig, config);
            },

            $get: function () {
                return function (tree) {
                    return new Config(tree);
                };
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
    .directive('uiTreeRegion', function (uiTreeFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                attrs.region = attrs.mode || 's';
                var uiTree = uiTreeFactory(scope, element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$treeRegion', uiTree);
            },
            template: function (element, attrs) {
                attrs.treeId = (new Date).getTime();
                return '<ul id="tree' + attrs.treeId + '" class="ztree" style="width:100%; overflow:auto;"></ul>';
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
(function ($) {
    angular.module('admin.template', []);
})(jQuery);

(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.button.state', '<button type="button" class="btn"></button>');

        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.line', [
                '<div class="" type="line">',
                    '<div></div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.column', [
                '<div class="" type="column">',
                    '<div></div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.chart.pie', [
                '<div class="" type="pie">',
                    '<div></div>',
                '</div>'
            ].join(''));
        });
})(jQuery);

(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.form', [
                '<form action="#" class="form-horizontal">',
                    '<div class="form-body">',
                    '</div>',
                '</form>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.input', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<input {{#if type}}type="{{type}}"{{else}}type="text"{{/if}} class="form-control" name="{{name}}" placeholder="{{placeholder}}"  {{#if value}}value="{{value}}"{{/if}} {{#if readonly}}readonly="{{readonly}}"{{/if}} {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.input.daterange', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<div class="input-date-range input-inline">',
                            '<div class="input-group">',
                                '<input type="text" class="form-control" name="{{fromName}}" {{#if fromModel}}ng-model="{{fromModel}}"{{/if}} {{#if fromValue}}value="{{fromValue}}"{{/if}} readonly>',
                                '<span class="input-group-addon">至</span>',
                                '<input type="text" class="form-control" name="{{toName}}" {{#if toModel}}ng-model="{{toModel}}"{{/if}} {{#if toValue}}value="{{toValue}}"{{/if}} readonly>',
                            '</div>',
                        '</div>',
                        '{{#if help}}<span class="help-block">{{{help}}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.select', [
                '<div class="form-group" {{#if isMulti}}is-multi="true"{{/if}}>',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<select class="form-control" {{#if buttonClass}}data-style="{{buttonClass}}"{{/if}} name="{{name}}" placeholder="{{placeholder}}" {{#if disabled}}disabled="disabled"{{/if}} {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}} ng-transclude></select>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.item', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.region', [
                '<div class="form-group">',
                     '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                     '<div class="col-md-{{rightCol}}">',
                        '<input type="hidden" {{#if model}}ng-value="{{model}}"{{/if}} {{#if sName}}name="{{sName}}"{{/if}}  {{#if value}}value="{{value}}"{{/if}}/>',
                        '<input type="text" class="input-small form-control input-inline" name="province"/>',
                        '<input type="text" class="input-small form-control input-inline" name="city"/>',
                        '<input type="text" class="input-small form-control input-inline" name="area"/>',
                        '<input type="text" class="input-xsmall form-control input-inline" {{#if aName}}name="{{aName}}"{{/if}}/>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));


            /**
             *
             */
            componentHelper.setTemplate('tpl.form.textarea', [
                '<div class="form-group">',
                    '<label class="control-label col-md-{{leftCol}}">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<textarea {{#if rows}}rows="{{rows}}"{{/if}} {{#if style}}style="{{style}}"{{/if}} {{#if cols}}cols="{{cols}}"{{/if}} {{#if model}}ng-model="{{model}}"{{/if}} {{#if name}}name="{{name}}"{{/if}} class="form-control"></textarea>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.switch', [
                '<div class="form-group">',
                    '<label class="control-label col-md-{{leftCol}}">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                         '<input type="checkbox"  {{#if disabled}}disabled="{{disabled}}"{{/if}} {{#if value}}value="{{value}}"{{/if}} {{#if name}}name="{{name}}"{{/if}} {{#if onText}}data-on-text="{{onText}}"{{/if}}  {{#if offText}}data-off-text="{{offText}}"{{/if}}/>',
                         '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.spinner', [
                '<div class="form-group">',
                    '<label class="control-label col-md-{{leftCol}}">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<div class="input-group" style="width:150px;">',
                            '<div class="spinner-buttons input-group-btn">',
                                '<button type="button" class="btn spinner-up blue"><i class="fa fa-plus"></i></button>',
                            '</div>',
                            '<input type="text" class="spinner-input form-control" {{#if name}}name="{{name}}"{{/if}} {{#if value}}value="{{value}}"{{/if}} readonly>',
                            '<div class="spinner-buttons input-group-btn">',
                                '<button type="button" class="btn spinner-down red"><i class="fa fa-minus"></i></button>',
                            '</div>',
                        '</div>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));
        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.menu', [
                '<div class="page-sidebar-wrapper">',
                    '<div class="page-sidebar navbar-collapse collapse">',
                        '<ul class="page-sidebar-menu" ng-transclude></ul>',
                    '</div>',
                '</div>'
            ].join(''));

        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal',[
                '<div class="row ui-sortable">',
                    '<div class="column sortable col-md-{{eachColumn}}" ng-repeat="column in columns">',
                        '<ui-portlet-container ng-repeat="portlet in column"></ui-portlet-container>',
                        '<div class="portlet-container portlet-sortable-empty"></div>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.container',[
                '<div class="portlet-container">',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet',[
                '<div class="portlet">',
                    '<div class="portlet-title tabbable-line">',
                        '<div class="caption"><span class="caption-subject {{captionClass}}">{{title}}</span></div>',
                    '</div>',
                    '<div class="portlet-body">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action',[
                '<div class="actions portlet-tool-bar" ng-transclude>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.pagination',[
                '<ul class="pagination pagination-circle portlet-tool-bar">',
                    '<li ng-class="{\'disabled\': isFirst}" ><a href="javascript:;" ng-click="loadFirst()"><i class="fa fa-angle-left"></i></a></li>',
                    '<li ng-repeat="page in pageList" ng-class="{\'active\': page.current}" ng-click="load(page.index)"><a href="javascript:;" ng-bind="page.index"></a></li>',
                    '<li ng-class="{\'disabled\': isLast}" ><a href="javascript:;" ng-click="loadLast()"><i class="fa fa-angle-right"></i></a></li>',
                '</ul>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.search',[
                '<div class="inputs portlet-tool-bar">',
                    '<div class="portlet-input input-inline input-small">',
                        '<div class="input-icon right">',
                            '<i class="icon-magnifier"></i>',
                            '<input type="text" {{#if model}}ng-model="{{model}}"{{/if}} class="form-control input-circle" placeholder="查询"/>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.tab',[
                '<ul class="nav nav-tabs portlet-tool-bar" ng-transclude>',
                '</ul>'
            ].join(''));
        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform', [
                '<form novalidate action="" class="ui-search-form form-inline">',
                    '<div class="row">',
                        '<div class="col-md-{{leftCol}}" ng-transclude></div>',
                        '<div class="text-right col-md-{{rightCol}}">',
                            '<a title="回车键也可触发搜索" class="btn blue-chambray btn-sm" ng-click="{{ref}}.search()" style="width: 30px"><i class="fa fa-search"></i></button>',
                            '<a title="重置搜索选项" class="btn default btn-sm" ng-click="{{ref}}.reset()" style="width: 30px"><i class="fa fa-undo font-blue-chambray"></i></a>',
                        '</div>',
                    '</div>',
                '</form>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.input', [
                '<div class="input-inline search-item">',
                    '<div class="input-group">',
                        '{{#if label}}',
                            '<div class="input-group-addon">{{label}}:</div>',
                        '{{/if}}',
                        '<input class="form-control" name="{{name}}" placeholder="{{placeholder}}" {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.userselect.input', [
                '<div class="input-inline search-item">',
                    '<div class="input-group input-small">',
                        '{{#if label}}',
                            '<div class="input-group-addon">{{label}}:</div>',
                        '{{/if}}',
                        '<input class="form-control" name="{{name}}" placeholder="{{placeholder}}" {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.daterange', [
                '<div class="input-inline search-item input-mlarge">',
                    '<div class="input-group">',
                        '<input type="text" readonly class="form-control" name="{{fromName}}" {{#if fromModel}}ng-model="{{fromModel}}"{{/if}}/>',
                        '<span class="input-group-addon">{{label}}</span>',
                        '<input type="text" readonly class="form-control" name="{{toName}}" {{#if toModel}}ng-model="{{toModel}}"{{/if}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.input.select', [
                '<div class="input-inline search-item">',
                    '<div class="input-group">',
                        '<select class="input-xsmall form-control " {{#if buttonClass}}data-style="{{buttonClass}}"{{/if}} {{#if model}}ng-model="{{model}}"{{/if}} {{#if selectName}}name="{{selectName}}"{{/if}} ng-transclude></select>',
                        '<input style="left:-1px;" class="form-control input-small pull-right" {{#if inputName}}name="{{inputName}}"{{/if}} placeholder="{{placeholder}}" ng-keydown="onChangeHandler($event)"/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.region', [
                '<div class="input-inline search-item">',
                    '<div class="input-group">',
                        '{{#if label}}<div class="input-group-addon">{{{label}}}:</div>{{/if}}',
                        '<input type="hidden" {{#if model}}ng-value="{{model}}"{{/if}} {{#if name}}name="{{name}}"{{/if}}  value="{{value}}"/>',
                        '<input type="text" class="input-small form-control" name="province" />',
                        '<input type="text" class="input-small form-control" name="city" />',
                        '<input type="text" class="input-small form-control" name="area" />',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.select', [
                '{{#if label}}',
                    '<div class="input-inline input-medium search-item" {{#if isMulti}}is-multi="true"{{/if}}>',
                        '<div class="input-group">',
                            '<div class="input-group-addon">{{label}}:</div>',
                            '<select class="form-control" {{#if buttonClass}}data-style="{{buttonClass}}"{{/if}} name="{{name}}" {{#if model}}ng-model="{{model}}"{{/if}} ng-transclude {{#each other}}{{key}}="{{val}}"{{/each}}></select>',
                        '</div>',
                    '</div>',
                '{{else}}',
                    '<div class="input-small search-item input-inline" {{#if isMulti}}is-multi="true"{{/if}}>',
                        '<select name="{{name}}" {{#if buttonClass}}data-style="{{buttonClass}}"{{/if}} class="form-control" {{#if model}}ng-model="{{model}}"{{/if}} ng-transclude {{#each other}}{{key}}="{{val}}"{{/each}}></select>',
                    '</div>',
                '{{/if}}'
            ].join(''));
        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab', [
                '<div class="tabbable-custom{{#if close}} tabbable-close{{/if}}">',
                    '<ul class="nav nav-tabs" ng-transclude>',
                    '</ul>',
                    '<div class="tab-content" style="min-height: 100px;">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab.item', [
                '<li>',
                    '<a href="javascript:;" ng-click="$tabItem.onClickHandler()" ><span>{{{head}}}</span><i class="fa fa-times" ng-click="$tabItem.onRemoveHandler($event)"></i></a>',
                '</li>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab.list.item', [
                '<li class="dropdown">',
                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{head}} <i class="fa fa-angle-down"></i></a>',
                    '<ul class="dropdown-menu" role="menu" ng-transclude>',
                    '</ul>',
                '</li>'
            ].join(''));

        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.table', [
                '<div class="ui-table">',
                    '<table class="table table-striped table-bordered table-hover">',
                        '<thead>',
                            '<tr role="row" class="heading" ng-transclude>',
                            '</tr>',
                        '</thead>',
                        '<tbody></tbody>',
                    '</table>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.table.column', [
                '<th>',
                    '{{head}}',
                '</th>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.table.column.checked', [
                '<th>',
                    '<input type="checkbox" ng-click="onSelectAllHandler($event)"/>',
                '</th>'
            ].join(''));
        });
})(jQuery);
(function ($) {
    angular.module('admin.template')
        .run(function (componentHelper) {

            /**
             *
             */
            componentHelper.setTemplate('tpl.toolbar.table', [
                '<div class="ui-toolbar table-toolbar">',

                    '<div class="btn-group pull-left">',
                        '{{#if editable}}',
                            '<button type="button" class="btn btn-sm btn-info" ng-click="{{ref}}.toggleEdit()"><i class="fa fa-edit"></i> <span ng-bind="{{ref}}.editText"></span>快速编辑</button>&nbsp;&nbsp;',
                        '{{/if}}',
                        '{{#if add}}',
                            '<button type="button" class="btn btn-sm btn-primary" ng-click="{{ref}}.doAddItem()"><i class="fa fa-plus-circle"></i> 新增{{tip}}</button>&nbsp;&nbsp;',
                        '{{/if}}',
                        '{{#if del}}',
                            '<button type="button" ng-class="{\'btn-danger\': {{table}}.selectValues.length > 0}" class="btn btn-sm" ng-disabled="{{table}}.selectValues.length==0" ng-click="{{ref}}.doDelItem({{table}}.selectValues)"><i class="fa fa-times-circle"></i> {{deltip}}{{tip}}</button>&nbsp;&nbsp;',
                        '{{/if}}',
                    '</div>',

                    '<div class="btn-group pull-left" ng-transclude></div>',

                    '<span ng-show="{{table}}.selectValues.length != 0" class="table-toolbar-tip fadeInRight">您已选择 <strong ng-bind="{{table}}.selectValues.length"></strong> 个{{tip}}，支持翻页选择多个{{tip}}。</span>',

                    //uitable column show or hide select area
                    '<div class="btn-group pull-right">',
                        '<a class="btn default btn-sm" href="#" data-hover="dropdown"><i class="fa fa-table"></i></a>',
                        '<div class="dropdown-menu dropdown-checkboxes pull-right">',
                            '<label ng-repeat="column in {{table}}.columns" ng-if="{{ref}}.isShow($index, column)" style="cursor:pointer" >',
                                '<div class="checker">',
                                    '<span ng-class="{checked: column.bVisible}">',
                                        '<input type="checkbox" ng-click="{{ref}}.toggleColumn($event, column)">',
                                    '</span>',
                                '</div>',
                                '<span ng-bind="column.mTitle"/>',
                            '</label>',
                            '<label class="divider"></label>',
                            '<label style="text-align: center;"><a href="javascript:;" ng-click="{{table}}.cleanState()" class="btn btn-sm green easy-pie-chart-reload"><i class="fa fa-repeat"></i> 恢复默认</a></label>',
                        ' </div>',
                    '</div>',
                    '<div style="clear:both"></div>',
                '</div>'
            ].join(''));
        });
})(jQuery);
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin', ['admin.service', 'admin.filter', 'admin.component', 'admin.template']);

//
if($.fn.modal){
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};
}

})();
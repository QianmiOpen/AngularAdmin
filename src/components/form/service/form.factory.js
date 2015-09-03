//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
(function () {

    let defaultFormValidateConfig = {
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
        .factory('UIFormControl', () => {
            class UIFormControl extends UIFormControl {

                constructor(s, e, a, formItems) {
                    this.className = 'form';
                    this.action = this.attrs.action.replace(/#/g, '');
                    this.formItems = formItems;
                    this.formControlMap = {};
                    super(s, e, a);
                }

                init() {
                    super.init();
                    this.scope.$on('componentComplete', (evt, o) => {
                        this.formControlMap[o.name] = o.component;
                    });
                }

                initEvents() {
                    super.initEvents();
                }

                changeValidateRule(ruleName, ruleConfig) {
                    var validator = this.element.data().validator;
                    if (validator) {
                        var oldConfig = validator.settings.rules[ruleName];
                        validator.settings.rules[ruleName] = $.extend(oldConfig, ruleConfig);
                    }
                }

                startValidate() {
                    this.element.valid();
                }

            }
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
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
                    this.action = attrs.action.replace(/#/g, '');
                    this.formName = attrs.formName;
                    uiFormControl.apply(this, arguments);
                };
            Form.prototype = $.extend(new uiFormControl(), {

                /**
                 *
                 */
                addFormItem: function (formItem) {
                    this.formItems.push(formItem);
                    this.layout();
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
                                if(dom.type == 'hidden'){
                                    $body.append(dom);
                                }
                                else{
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
                            };
                            $body.append($rowDom);
                            $.each(other, function(i, dom){
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
                    else {
                        this.element.submit(this._submit.bind(this));
                    }
                },

                /**
                 *
                 * @param rules
                 */
                setRules: function (rules) {
                    this.element.validate($.extend({}, uiFormValidateConfig, {
                        rules: rules,
                        submitHandler: this._submit.bind(this)
                    }));
                },

                /**
                 *
                 * @returns {*}
                 */
                formData: function (data) {
                    return this.element.serializeArray();
                },

                /**
                 *
                 */
                submit: function (fn) {
                    this.$on('uiForm.doSubmit', fn);
                },
                _submit: function(other){
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
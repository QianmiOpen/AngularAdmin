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
            class UIFormControl extends UIFormItemControl {

                constructor(s, e, a, formItems) {
                    this.className = '';
                    this.formItems = formItems;
                    this.formControlMap = {};
                    this.formElement = e.find('form');
                    super(s, e, a);
                }

                init() {
                    super.init();
                    if (this.scope.action)
                        this.action = this.scope.action.replace(/#/g, '');
                    this.scope.$on('componentComplete', (evt, o) => {
                        this.formControlMap[o.name] = o.component;
                    });
                }

                initEvents() {
                    super.initEvents();
                    this.formElement.submit((evt) => this._onSubmit(evt));
                }

                formData() {
                    return this.formElement.serializeArray();
                }

                formParamData() {
                    return this.formElement.serialize();
                }

                formJsonData() {
                    let data = this.formData(),
                        r = {};
                    for (let item of data) {
                        if (item.value === undefined) {
                            continue;
                        }
                        if (r[item.name]) {
                            r[item.name] = _.isArray(r[item.name]) ? r[item.name] : [r[item.name]];
                            r[item.name].push(item.value);
                        }
                        else {
                            r[item.name] = item.value;
                        }
                    }
                    return r;
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

                layout() {
                    this.element.find('.form-body').append(this.formItems);
                }

                _onSubmit(evt) {
                    if (this.attrs.onSubmit) {
                        this.scope.onSubmit({data: this.formElement.serializeArray()});
                        evt.preventDefault();
                    }
                }
            }
            return UIFormControl;
        });
})
(jQuery);
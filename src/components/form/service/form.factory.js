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
                    this.className = 'form';
                    this.formItems = formItems;
                    this.formControlMap = {};
                    super(s, e, a);
                }

                init() {
                    super.init();
                    this.action = this.attrs.action.replace(/#/g, '');
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

                layout(){
                    this.element.find('.form-body').append(this.formItems);
                }
            }
            return UIFormControl;
        });
})
(jQuery);
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISpinnerControl', () => {
            class UISpinnerControl extends UIFormControl {
                constructor(s, e, a) {
                    this.className = 'Spinner';
                    this.formEl = e.find('input');
                    super(s, e, a);
                }

                init() {
                    super.init();
                }

                initEvents() {
                    super.initEvents();
                    this.element.on('mousedown', '.spinner-up', () => this._changeValue(true));
                    this.element.on('mousedown', '.spinner-down', () => this._changeValue(false));
                }

                _changeValue(isAdd) {
                    let step = (this.attrs.step || 1) * 1,
                        min = (this.attrs.min || 0) * 1,
                        max = (this.attrs.max || Number.MAX_VALUE) * 1,
                        val = this.val();
                    val = val !== undefined ? parseInt(val) : this.attrs.value;
                    val = val + (step * ( isAdd ? 1 : -1));
                    if (val > max) {
                        val = max;
                    }
                    if (val < min) {
                        val = min;
                    }
                    this.scope.model = val;
                    this.scope.$apply();
                    this.scope.change({val: val});
                }
            }
            return UISpinnerControl;
        });
})();
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
                        this.$emit('change', this.val());
                    }.bind(this));

                    this.scope.$watch(this.attrs.model, function (newValue) {
                        if (newValue !== this.val()) {
                            this.val(newValue === undefined ? '0' : newValue);
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
                if (v !== undefined) {
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
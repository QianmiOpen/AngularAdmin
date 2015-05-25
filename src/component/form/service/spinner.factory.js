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
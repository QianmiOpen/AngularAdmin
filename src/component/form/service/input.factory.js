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
            },

            reset: function () {
                this.inputElement.val('');
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
        return Input;
    });
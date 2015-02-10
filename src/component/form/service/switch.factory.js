//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiSwitchFactory', function (msg, uiFormControl) {
        var m = new msg('Switch'),
            Switch = function (scope, element, attrs) {
                this.inputElement = element.find('input');
                this.onValue = attrs.onValue || 'on';
                this.offValue = attrs.offValue || 'off';
                this.attrs = attrs;
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
            },

            onChangeHandler: function (evt, state) {
                var v = state ? this.onValue : this.offValue;
                this.inputElement.val(v);
                this.inputElement[0].checked = true;
            },

            reset: function () {
                this.inputElement.val();
            },

            val: function (isOn) {
                if (isOn != undefined) {
                    this.inputElement.bootstrapSwitch('state', isOn);
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
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
                if (val !== undefined) {
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
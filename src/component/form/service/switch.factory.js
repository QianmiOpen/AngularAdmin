//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiSwitchFacotry', function (msg, uiInputMaskMap, Event) {
        var m = new msg('Switch'),
            Switch = function (element, attrs) {
                Event.call(this);
                this.element = element.find('input');
                this.onValue = attrs.onValue || 'on';
                this.offValue = attrs.offValue || 'off';
                this.attrs = attrs;
                this.render();
            };
        Switch.prototype = {

            render: function () {
                if ($.fn.bootstrapSwitch) {
                    this.element.bootstrapSwitch({
                        size: 'small',
                        onSwitchChange: this.onChangeHandler.bind(this)
                    });

                    //初始值
                    this.element.bootstrapSwitch('state', this.attrs.value == this.onValue);
                }
                this.element[0].checked = true;
            },

            onChangeHandler: function (evt, state) {
                var v = state ? this.onValue : this.offValue;
                this.element.val(v);
                this.element[0].checked = true;
            },

            reset: function () {
                this.element.val();
            },

            val: function (isOn) {
                if (isOn != undefined) {
                    this.element.bootstrapSwitch('state', isOn);
                    return this;
                }
                else {
                    return this.element.val();
                }
            }
        };
        return function (element, attrs) {
            return new Switch(element, attrs);
        };
    });
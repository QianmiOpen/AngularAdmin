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
    .factory('uiInputFacotry', function (msg, uiInputMaskMap, Event) {
        var m = new msg('Input'),
            Input = function (element, attrs) {
                Event.call(this);
                this.element = element.find('input');
                this.attrs = attrs;
                this.mask = attrs.mask || uiInputMaskMap[attrs.type];
                this.render();
            };
        Input.prototype = {

            render: function () {
                if (this.mask) {
                    this.element.inputmask(this.mask);
                }
            },

            reset: function () {
                this.element.val('');
            },

            val: function (v) {
                if (v != undefined) {
                    this.element.val(v);
                    return this;
                }
                else {
                    return this.element.val();
                }
            }
        };
        return function (element, attrs) {
            return new Input(element, attrs);
        };
    });
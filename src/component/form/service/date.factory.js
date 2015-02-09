//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiDateFacotry', function (msg, Event) {
        var m = new msg('Date'),
            InputDate = function (element, attrs) {
                Event.call(this);
                this.element = element;
                this.inputElement = element.find('input');
                this.attrs = attrs;
                this.format = null;
                this.default = attrs.value;
                this.mode = attrs.mode;
                this.init();
                this.render();
            };
        InputDate.prototype = {

            init: function () {
                var format = [];
                if (!this.mode || this.mode == 'date')
                    format.push('yyyy-MM-dd');
                if (!this.mode || this.mode == 'time')
                    format.push('HH:mm:ss');
                this.format = format.join(' ');
                this.val(this.default);
            },

            /**
             *
             */
            render: function () {
                this.inputElement.datetimepicker({
                    language: 'zh-CN',
                    pickDate: this.attrs.date !== undefined,
                    pickTime: this.attrs.time !== undefined,
                    useSeconds: this.attrs.time !== undefined
                });
            },

            /**
             *
             */
            destroy: function(){
                delete this.listenerMap;
            },

            /**
             *
             */
            reset: function () {
                this.inputElement.val('');
            },

            /**
             *
             * @param fn
             */
            change: function(fn){
                this.inputElement.change(fn);
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
                if (v != undefined) {
                    this.inputElement.val(util.dateFormatStr(v, this.format));
                    return this;
                }
                else {
                    return this.inputElement.val();
                }
            }
        };
        return function (element, attrs) {
            return new InputDate(element, attrs);
        };
    });
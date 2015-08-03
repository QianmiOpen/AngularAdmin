//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class UIDateFactory extends UIFormControl {
        constructor(s, e, a) {
            this.className = 'Date';
            this.message = new Message('uiDate');
            this.formEl = e.find('input');
            this.dateMode = a.mode ? a.mode.indexOf('date') != -1 : true;
            this.timeMode = a.mode ? a.mode.indexOf('time') != -1 : true;
            super(s, e, a);
        }

        init() {
            super.init();
            var format = [];
            if (this.dateMode)
                format.push('yyyy-MM-dd');
            if (this.timeMode)
                format.push('HH:mm:ss');
            this.format = format.join(' ');
        }

        initEvents() {
            super.initEvents();
        }

        render(){
            this.formEl.datetimepicker({
                language: 'zh-CN',
                pickDate: this.dateMode,
                useCurrent: false,
                pickTime: this.timeMode,
                useSeconds: this.timeMode
            });
        }
    }


    angular.module('admin.component')
        .service('UIDateService', () => UIDateFactory)
        .factory('uiDateFactory', function (msg, uiFormControl, util) {
            var m = new msg('Date'),
                InputDate = function (scope, element, attrs) {
                    this.className = 'Date';
                    this.inputElement = element.find('input');
                    this.format = null;
                    this.default = attrs.value;
                    this.dateMode = attrs.mode ? attrs.mode.indexOf('date') != -1 : true;
                    this.timeMode = attrs.mode ? attrs.mode.indexOf('time') != -1 : true;
                    uiFormControl.apply(this, arguments);
                };
            InputDate.prototype = $.extend(new uiFormControl(), {

                _init: function () {
                    var format = [];
                    if (this.dateMode)
                        format.push('yyyy-MM-dd');
                    if (this.timeMode)
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
                        pickDate: this.dateMode,
                        useCurrent: false,
                        pickTime: this.timeMode,
                        useSeconds: this.timeMode
                    });
                    return this;
                },

                /**
                 *
                 */
                reset: function () {
                    this.inputElement.val('');
                    return this;
                },

                /**
                 *
                 * @param fn
                 */
                change: function (fn) {
                    this.inputElement.change(fn);
                    return this;
                },

                /**
                 *
                 * @param v
                 * @returns {*}
                 */
                val: function (v) {
                    if (v !== undefined) {
                        this.inputElement.val(v ? util.dateFormatStr(v, this.format) : '');
                        return this;
                    }
                    else {
                        return this.inputElement.val();
                    }
                }
            });
            return function (s, e, a, c, t) {
                return new InputDate(s, e, a, c, t);
            };
        });
})();
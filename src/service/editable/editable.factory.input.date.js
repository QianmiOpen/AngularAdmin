//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableDateInputFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableDateInput'),
            EditableDateInput = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableDateInput.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
                this.option.tpl = $('<input type="text" readonly>').datetimepicker({
                    language: 'zh-CN',
                    format: this.attrs.format || "YYYY-MM-DD"
                });
            }
        });
        return function (element, attrs, option, other) {
            return new EditableDateInput(element, attrs, option, other);
        };
    });
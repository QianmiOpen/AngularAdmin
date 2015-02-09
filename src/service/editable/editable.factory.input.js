//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableInputFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableInput'),
            EditableInput = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableInput.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
            }
        });
        return function (element, attrs, option, other) {
            return new EditableInput(element, attrs, option, other);
        };
    });
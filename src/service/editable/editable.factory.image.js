//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableImageFactory', function (msg, uiEditableCommonFactory) {
        var m = new msg('EditableImage'),
            EditableImage = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableImage.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'text';
            }
        });
        return function (element, attrs, option, other) {
            return new EditableImage(element, attrs, option, other);
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableChooseFactory', function (msg, uiEditableCommonFactory, uiSelectFactory) {
        var m = new msg('EditableChoose'),
            EditableChoose = function (element, attrs, option, other) {
                this.selectData = other;
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableChoose.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {
                this.option.type = 'select';
                this.option.source = this.selectData;
            },

            render: function($form){
                this.select = uiSelectFactory($form, {});
            }
        });
        return function (element, attrs, option, other) {
            return new EditableChoose(element, attrs, option, other);
        };
    });
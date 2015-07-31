//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableUserFactory', function (msg, uiEditableCommonFactory, uiMultiSelectFactory, userConfig) {
        var m = new msg('EditableUser'),
            EditableUser = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableUser.prototype = $.extend({}, uiEditableCommonFactory.prototype, {
            beforeRender: function () {

                this.option.type = 'text';
                this.option.doAfter = function () {
                    var $element = this.data('editableContainer').$form.find('input');
                    this.select = uiMultiSelectFactory({}, $element, userConfig);
                }.bind(this);


                this.option.display = function (value, sourceData) {
                    var $this = $(this),
                        container = $this.data('editableContainer');
                    if (container) {
                        var item = $(container.$form.find('input')[1]).data('uiSelect.data');
                        if (item)
                            $this.html(item.name);
                    }
                };


                this.option.clear = false;
            }
        });
        return function (element, attrs, option, other) {
            return new EditableUser(element, attrs, option, other);
        };
    });
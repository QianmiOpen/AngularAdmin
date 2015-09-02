//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------

jQuery.fn.editable.defaults.inputclass = 'form-control';
jQuery.fn.editable.defaults.ajaxOptions = {
    type: 'post',
    dataType: 'json'
};
angular.module('admin.service')
    .factory('uiEditableCommonFactory', function (msg, util) {
        var m = new msg('EditableCommon'),
            EditableCommon = function (element, attrs, option) {
                this.element = $(element);
                this.name = option.name;
                this.rule = option.rule;
                this.attrs = attrs;
                this.isRender = false;

                //
                this.option = $.extend(true, option, {
                    emptytext: '-',
                    placement: 'right',
                    mode: 'popup',
                    doAfter: function(){
                        if(this.render && !this.isRender){
                            this.isRender = true;
                            this.render.call(this, this.element.data('editableContainer').$form);
                        }
                    }.bind(this),
                    validate: this.validation.bind(this),
                    success: function (json, value) {
                        json = json || {};
                        if (json.result == 'ok') {
                            return true;
                        }
                        else {
                            msg.error(json.msg);
                            return false;
                        }
                    }
                });

                //
                this.beforeRender();

                //
                this.element.editable(this.option);

                //
                this.afterRender();
            };
        EditableCommon.prototype = {
            beforeRender: function(){},
            afterRender: function(){},

            validation: function(val){
                var inputVal = this.element.data('editableContainer').$form.find('[name="' + this.name + '"]').val();
                val = inputVal !== undefined ? inputVal : val;
                if (this.rule) {
                    return util.checkValueUseRules(this.name, val, this.rule);
                }
                return null;
            },

            show: function(){
                this.element.editable('toggleDisabled');
                return this;
            },
            hide: function(){
                this.element.editable('toggleDisabled');
                return this;
            }
        };
        return EditableCommon;
    });
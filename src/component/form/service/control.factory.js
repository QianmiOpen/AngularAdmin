/**
 * 表单控件
 */
angular.module('admin.component')
    .factory('uiFormControl', function (msg, Event, componentHelper) {
        var FormControl = function (scope, element, attrs) {
            if (!scope) {
                return;
            }
            Event.call(this);
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this.name = attrs.name;
            this.isSearchControl = element.parents('.ui-search-form').length > 0;
            this.formPrefix = this.isSearchControl ? '$search' : '$form';
            this.formResetEventName = this.isSearchControl ? 'uisearchform.reset' : 'uiform.reset';
            this._init();
            this._cleanElement();
            this.render();
            this._complete();
        };
        FormControl.prototype = {

            /**
             *
             */
            _init: function () {
            },

            /**
             *
             * @private
             */
            _cleanElement: function () {
                this.element.removeAttr('name').removeAttr('model').removeAttr('readonly');
            },

            /**
             *
             * @private
             */
            _complete: function () {
                componentHelper.tiggerComplete(this.scope, this.attrs.ref || '$' + this.formPrefix + this.className, this);
                this.resetListener = this.scope.$on(this.formResetEventName, function () {
                    this.reset();
                }.bind(this));
            },

            /**
             *
             */
            render: function () {
            },

            /**
             *
             */
            destroy: function () {
                delete this.listenerMap;
                this.resetListener();
            },

            /**
             *
             */
            reset: function () {
            },

            /**
             *
             * @param fn
             */
            change: function (fn) {
                this.$on('change', fn);
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
            }
        };
        return FormControl;
    });
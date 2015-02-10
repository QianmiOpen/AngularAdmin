/**
 * 表单控件
 */
angular.module('admin.component')
    .factory('uiFormControl', function (msg, Event) {
        var FormControl = function (scope, element, attrs) {
            if (!scope) {
                return;
            }
            Event.call(this);
            this.scope = scope;
            this.element = element;
            this.attrs = attrs;
            this._init();
            this._cleanElement();
            this.render();
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
             */
            render: function () {
            },

            /**
             *
             */
            destroy: function () {
                delete this.listenerMap;
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
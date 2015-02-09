//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiSelectFactory', function (msg, Event) {
        var m = new msg('Select'),
            Select = function (element, attrs) {
                Event.call(this);
                this.element = element.find('select');
                this.attrs = attrs;
                this.defaultResetValue = attrs.isMulti ? null : this.element.find('option:eq(0)').val();
                this.init = false;
                this.render();
            };
        Select.prototype = {

            /**
             *
             */
            render: function () {
                if (this.init) {
                    this.element.selectpicker('refresh');
                }
                else {
                    this.element.selectpicker({
                        iconBase: 'fa',
                        tickIcon: 'fa-check'
                    });
                    this.init = true;
                }
            },

            /**
             *
             * @param data
             * @param isClean
             */
            setData: function (data, isClean) {
                if (isClean) {
                    this.element.html();
                }
                else {
                    $.each(data, function (i, item) {
                        this.element.push($('<option/>').attr('value', item.key).html(item.text))
                    }.bind(this));
                }
                this.reset();
            },

            /**
             *
             */
            reset: function () {
                this.element.val(this.defaultResetValue);
                this.render();
            },

            /**
             *
             * @param fn
             */
            change: function (fn) {
                this.element.change(fn);
            },

            /**
             *
             * @param v
             * @returns {*}
             */
            val: function (v) {
                if (v) {
                    this.element.val(v);
                    this.render();
                    return this;
                }
                else {
                    return this.element.val();
                }
            }
        };
        return function (element, attrs) {
            return new Select(element, attrs);
        };
    });
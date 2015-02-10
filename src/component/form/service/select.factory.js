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
            setData: function (data, isClean, dataName, dataValue) {
                dataName = dataName || 'key';
                dataValue = dataValue || 'text';
                if (isClean) {
                    this.element.html();
                }
                if ($.isArray(data)) {
                    $.each(data, function (i, item) {
                        this.element.append(this.toOption(item, dataName, dataValue));
                    }.bind(this));
                }
                else {
                    $.each(data, function (group, items) {
                        var $optiongroup = this.toOptionGroup(group);
                        $.each(items, function (i, item) {
                            $optiongroup.append(this.toOption(item, dataName, dataValue))
                        }.bind(this));
                        this.element.append($optiongroup);
                    }.bind(this));
                }
                this.reset();
            },

            /**
             *
             * @param item
             * @param dataName
             * @param dataValue
             * @returns {*|jQuery}
             */
            toOption: function (item, dataName, dataValue) {
                var isString = angular.isString(item),
                    itemName = isString ? item : item[dataName],
                    itemValue = isString ? item : item[dataValue];
                var $option = $('<option/>').attr('value', itemName).html(itemValue);
                return $option;
            },

            /**
             *
             * @param name
             * @returns {*|jQuery}
             */
            toOptionGroup: function (name) {
                var $option = $('<optgroup/>').attr('label', name);
                return $option;
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
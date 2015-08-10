//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class UISelectControl extends UIFormControl {

        constructor(s, e, a) {
            this.className = 'Select';
            this.formEl = e.find('Select');
            this.ajax = new Ajax();
            super(s, e, a);
        }

        init() {
            super.init();

            //是否多选
            if (this.attrs.multiple) {
                this.formEl.prop('multiple', 'multiple');
            }

            //初始化数值
            this.defaultValue = this.scope.value || this.formEl.find('option:eq(0)').val() || '';
            if (!this.scope.model && this.defaultValue) {
                this.scope.model = this.defaultValue;
                this.val(this.defaultValue);
            }

            //远程加载数据
            if (this.attrs.url) {
                this.load(this.attrs.url);
            }
        }

        initEvents() {
            super.initEvents();
            this.scope.$watch('model', (nv) => {
                if (nv !== undefined) {
                    this.val(nv);
                    this.scope.change();
                }
                else
                    this.val(this.defaultValue);
            });
            this.formEl.change(() => {
                this.scope.model = this.formEl.val();
                this.scope.$apply();
            });
        }

        render() {
            if (this.init) {
                this.formEl.selectpicker('refresh');
            }
            else {
                this.formEl.selectpicker({
                    iconBase: 'fa',
                    tickIcon: 'fa-check'
                });
                this.init = true;
            }
        }

        val(val) {
            super.val(val);
            if (val)
                this.render();
        }

        load(url, value, isClean) {
            return this.ajax.post(url).then((responseData) => {
                this.setData(responseData, isClean);
                if (value) {
                    this.val(value);
                }
                else {
                    var val = self.val(),
                        m = /^\?.+:(.+)\s+\?$/.exec(val);
                    this.val(m ? m[1] : val);
                }
            });
        }

        setData(data, isClean, dataName, dataValue) {
            dataName = dataName || this.scope.dataKeyName;
            dataValue = dataValue || this.scope.dataValueName;
            if (isClean) {
                this.formEl.html('');
            }
            if (_.isArray(data)) {
                $.each(data, (i, item) => {
                    this.formEl.append(this.toOption(item, dataName, dataValue));
                });
            }
            else {
                $.each(data, (group, items) => {
                    var $optionGroup = this.toOptionGroup(group);
                    $.each(items, (i, item) => {
                        $optionGroup.append(this.toOption(item, dataName, dataValue));
                    });
                    this.formEl.append($optionGroup);
                });
            }
            this.reset();
        }

        toOption(item, dataName, dataValue) {
            var isString = _.isString(item),
                itemName = isString ? item : item[dataName],
                itemValue = isString ? item : item[dataValue];
            var $option = $('<option/>').attr('value', itemName).html(itemValue),
                renderHtml = this.scope.render($option, item);
            if (renderHtml) {
                $option.data('content', renderHtml);
            }
            $option.data('item', item);
            return $option;
        }

        toOptionGroup(name) {
            var $option = $('<optgroup/>').attr('label', name);
            return $option;
        }
    }


    angular.module('admin.component')
        .service('UISelectControl', () => UISelectControl)
        .factory('uiSelectFactory', function (msg, ajax, uiFormControl, ValueService) {
            var m = new msg('Select'),
                Select = function (scope, element, attrs) {
                    this.selectElement = element.find('select');
                    this.dataKeyName = attrs.keyName || 'key';
                    this.dataValueName = attrs.valueName || 'text';
                    this.defaultResetValue = attrs.isMulti ? '' : (this.selectElement.find('option:eq(0)')[0] ? this.selectElement.find('option:eq(0)').val() : '');
                    this.model = attrs.model;
                    this.init = false;
                    uiFormControl.apply(this, arguments);
                };
            Select.prototype = $.extend(new uiFormControl(), {

                _init: function () {
                    var self = this;
                    if (this.model) {

                        //监听一下model的变化
                        this.watch = this.scope.$watch(this.model, function (newValue) {
                            if (newValue !== undefined)
                                this.val(newValue);
                            else
                                this.val(this.defaultResetValue);
                        }.bind(this));

                        //如果model没有值, 默认选择第一个
                        if (!ValueService.get(this.scope, this.model)) {
                            var val = this.attrs.value ? this.attrs.value : this.defaultResetValue;
                            ValueService.set(this.scope, this.model, val);
                        }
                    }

                    //远程加载数据
                    if (this.attrs.url) {
                        this.load(this.attrs.url);
                    }

                    if (!this.model && this.attrs.value) {
                        this.val(this.attrs.value);
                    }
                    this.element.removeAttr('value');
                },

                load: function (url, value, isClean) {
                    var self = this;
                    return ajax.post(url).then(function (responseData) {
                        self.setData(responseData, isClean);
                        if (value) {
                            self.val(value);
                        }
                        else {
                            var val = self.val(),
                                m = /^\?.+:(.+)\s+\?$/.exec(val);
                            self.val(m ? m[1] : val);
                        }
                    });
                },

                /**
                 *
                 */
                disabled: function (open) {
                    this.selectElement.prop('disabled', open);
                    this.render();
                },

                /**
                 *
                 */
                render: function () {
                    if (this.init) {
                        this.selectElement.selectpicker('refresh');
                    }
                    else {
                        this.selectElement.selectpicker({
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
                    dataName = dataName || this.dataKeyName;
                    dataValue = dataValue || this.dataValueName;
                    if (isClean) {
                        this.selectElement.html('');
                    }
                    if ($.isArray(data)) {
                        $.each(data, function (i, item) {
                            this.selectElement.append(this.toOption(item, dataName, dataValue));
                        }.bind(this));
                    }
                    else {
                        $.each(data, function (group, items) {
                            var $optiongroup = this.toOptionGroup(group);
                            $.each(items, function (i, item) {
                                $optiongroup.append(this.toOption(item, dataName, dataValue));
                            }.bind(this));
                            this.selectElement.append($optiongroup);
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
                    this.$emit('uiselect.onOption', $option, item);
                    $option.data('item', item);
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
                    this.selectElement.val(this.defaultResetValue);
                    this.render();
                },

                /**
                 *
                 * @param fn
                 */
                change: function (fn) {
                    this.selectElement.change(fn);
                },

                /**
                 *
                 * @param v
                 * @returns {*}
                 */
                val: function (v) {
                    if (v !== undefined) {
                        this.selectElement.val(v);
                        this.render();
                        return this;
                    }
                    else {
                        return this.selectElement.val();
                    }
                }
            });
            return function (s, e, a, c, t) {
                return new Select(s, e, a, c, t);
            };
        });
})();
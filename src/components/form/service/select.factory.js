//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISelectControl', (Ajax) => {

            //
            class UISelectControl extends UIFormItemControl {

                constructor(s, e, a) {
                    this.className = 'Select';
                    this.formEl = e.find('Select');
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

                    this.scope.labelName = this.scope.labelName || 'name';
                    this.scope.valueName = this.scope.valueName || 'id';

                    //
                    this.dataList = [];
                    this.formEl.find('option').each((i, o) => {
                        let r = {};
                        r[this.scope.labelName] = o.innerHTML;
                        r[this.scope.valueName] = o.value;
                        this.dataList.push(r);
                    });
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
                    if (this.isInit) {
                        this.formEl.selectpicker('refresh');
                    }
                    else {
                        this.formEl.selectpicker({
                            iconBase: 'fa',
                            tickIcon: 'fa-check',
                            style: this.scope.buttonClass || 'btn-default',
                            title: this.attrs.placeholder || '请选择'
                        });
                        this.isInit = true;
                    }
                }

                val(val) {
                    super.val(val);
                    if (val)
                        this.render();
                }

                load(url, value, isClean) {
                    return Ajax.get(url).then((responseData) => {
                        this.setData(responseData, isClean);
                        if (value) {
                            this.val(value);
                        }
                        else {
                            var val = this.val() || this.scope.model,
                                m = /^\?.+:(.+)\s+\?$/.exec(val);
                            this.logger.debug(`load => ${val}`);
                            this.val(m ? m[1] : val);
                        }
                    });
                }

                setData(data, isClean, dataName, dataValue) {
                    dataName = dataName || this.scope.labelName;
                    dataValue = dataValue || this.scope.valueName;
                    if (isClean) {
                        this.formEl.html('');
                    }
                    if (_.isArray(data)) {
                        $.each(data, (i, item) => {
                            this.formEl.append(this.toOption(item, dataValue, dataName));
                        });
                    }
                    else {
                        $.each(data, (group, items) => {
                            var $optionGroup = this.toOptionGroup(group);
                            $.each(items, (i, item) => {
                                $optionGroup.append(this.toOption(item, dataValue, dataName));
                            });
                            this.formEl.append($optionGroup);
                        });
                    }
                    this.dataList = data;
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
                    var dataContent = this.scope.onRender({item});
                    if (dataContent) {
                        $option.data('content', dataContent);
                    }
                    return $option;
                }

                toOptionGroup(name) {
                    var $option = $('<optgroup/>').attr('label', name);
                    return $option;
                }

                reset() {
                    super.reset();
                    this.render();
                }
            }

            //
            return UISelectControl;
        });
})();
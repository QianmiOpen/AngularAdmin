//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .constant('userConfig', {
        url: '/',
        labelName: 'name',
        valueName: 'staffno'
    })
    .constant('tagConfig', {
        url: '/',
        labelName: 'name',
        valueName: 'staffno'
    })
    .factory('uiMultiSelectFactory', function ($q, ajax, logger, msg, util, Event) {
        var m = new msg('MultiSelect'),
            MultiSelect = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.inputElement = element.find('input');
                this.attrs = attrs;

                //
                this.isInit = true;

                //
                this.selectValues = [];  //选中的值
                this.selectItems = [];   //选中的数据
                this.datas = undefined;

                //
                var self = this,
                    selectOption = {
                        openOnEnter: false,
                        formatNoMatches: function () {
                            return '没有符合的数据';
                        },
                        formatInputTooShort: function (t, m) {
                            return '输入' + m + '个字符后开始查询';
                        },
                        formatSelectionTooBig: function (m) {
                            return '最大可以选中' + m + '个数据';
                        },
                        formatSearching: function () {
                            return '正在加载数据...';
                        },
                        formatAjaxError: function () {
                            return '加载数据失败';
                        }
                    };

                if (attrs.multi != undefined) {  //开启多选, select元素不能开启
                    selectOption.multiple = true;
                }
                if (attrs.url != undefined) { //开启远程查询
                    if (attrs.multi != undefined) {
                        selectOption.createSearchChoice = $.proxy(self.createSearchChoice, self);
                    }
                    selectOption.query = $.proxy(self.filterData, self);
                    selectOption.initSelection = $.proxy(self.initSelection, self);
                    selectOption.id = $.proxy(self.formatId, self);
                    selectOption.formatSelection = $.proxy(self.formatResult, self);
                    selectOption.formatResult = $.proxy(self.formatResult, self);
                }
                if (attrs.minmum) { //输入几个字符以后才能搜索
                    selectOption.minimumInputLength = attrs.minmum;
                }
                if (attrs.maxSize) { //最大选中几个
                    selectOption.maximumSelectionSize = attrs.maxSize;
                }


                //构造对象
                this.inputElement.select2(selectOption);

                //初始化值
                this.initValue();
                this.initEvents();
            };

        //
        MultiSelect.prototype = {

            /**
             * 初始化值
             */
            initValue: function () {
                var ngModel = this.attrs.ngModel,
                    self = this;
                //
                if (this.attrs.multi != undefined && this.attrs.setCheck) {
                    this.loadData().then(function () {
                        self.selectItems = [];
                        self.selectValues = [];
                        $.each(self.datas, function (i, data) {
                            if ((',' + self.attrs.setCheck + ',').indexOf(',' + data.id + ',') != -1) {
                                self.selectItems.push(data);
                                self.selectValues.push(data.id);
                            }
                        });
                        self.isFocusInit = true;
                        self.val(self.selectValues);
                    });
                }

                //
                if (!ngModel) {
                    return;
                }
                var v = util.getValue(this.scope, ngModel);
                if (v) {
                    this.element.select2('val', v);
                }
                else {
                    var _this = this;
                    var r = this.scope.$watch(ngModel, function (n) {
                        if (n) {
                            _this.element.select2('val', n);
                            r();
                        }
                    });
                }
            },

            initEvents: function () {
                var self = this;
                this.element.on('select2-selecting', function (evt) {
                    if (this.attrs.multi != undefined) {
                        this.selectValues.push(evt.val);
                        this.selectItems.push(evt.object);
                    }
                    else {
                        this.selectValues = [evt.val];
                        this.selectItems = [evt.object];
                    }
                    this.$emit('uiSelect.doSelect', this.selectValues, this.selectItems);
                }.bind(this));
                this.element.on('select2-removing', function (evt) {
                    this.selectValues = $.grep(this.selectValues, function (value) {
                        return value != evt.val;
                    });
                    this.selectItems = $.grep(this.selectItems, function (item) {
                        return item != evt.choice;
                    });
                    this.$emit('uiSelect.doRemove', this.selectValues, this.selectItems);
                }.bind(this));

                //
                this.element.on('change', function (evt) {
                    if (evt.added) {
                        this.$emit('uiSelect.doAdd', evt.added, self.attrs.tag);
                    }
                    if (evt.removed) {
                        this.$emit('uiSelect.doDel', evt.removed, self.attrs.tag);
                    }
                }.bind(this));
            },

            /**
             *
             * @param term
             * @param data
             */
            createSearchChoice: function (term, data) {
                if ($(data).filter(function () {
                        return this.name.indexOf(term) === 0;
                    }).length === 0) {
                    return data.length <= 10 ? {id: term, name: term, isNew: true} : null; //最多10个
                }
            },


            /**
             * 加载远程数据
             * @param o
             */
            useParams: function (o) {
                return $.extend(this.params, o || {}); //TODO: 额外查询参数
            },

            /**
             *  TODO: 目前没考虑错误的处理
             */
            loadData: function () {
                var self = this,
                    d = $q.defer();
                if (self.datas) {
                    d.resolve(self.datas);
                }
                else {
                    ajax.post(this.attrs.url, this.useParams).then(function (r) {
                        self.datas = r ? r.aaData || r : [];
                        $.each(self.datas, function (i, dd) { //遍历所有属性, 放入一个特殊变量, 用于后期查询使用
                            var s = [];
                            for (var k in dd) {
                                s.push(k + '=' + (dd[k] || '').toString().toLowerCase());
                            }
                            dd.__string = s.join(',');
                        });
                        d.resolve(self.datas);
                    });
                }
                return d.promise;
            },

            /**
             * 过滤
             * @param o
             */
            filterData: function (o) {
                var sfs = (this.attrs.search || '').toLowerCase().split(','),
                    keyword = o.term.toLowerCase();
                this.loadData().then(function (rs) {
                    var os = [];
                    $.each(rs, function (i, r) {
                        var isC = false;
                        if (sfs.length == 0 || sfs[0] == '') { //说明查所有属性
                            isC = r.__string.indexOf(keyword) != -1;
                        }
                        else {   //针对特定属性
                            $.each(sfs, function (ii, sf) {
                                isC = (r[sf] || '').toString().toLowerCase().indexOf(keyword) != -1;
                            });
                        }
                        if (isC) {
                            os.push(r);
                        }
                    });
                    o.callback({results: os});
                });
            },

            /**
             * 反向查找选中的items
             * @param element
             * @param callback
             */
            initSelection: function (element, callback) {
                var self = this,
                    handler = function (data) {
                        if (self.attrs.multi != undefined) {
                            callback(data.results);
                        }
                        else {
                            callback(data.results[0]);
                        }
                    };
                if (self.isFocusInit) {
                    self.isFocusInit = false;
                    self.isInit = false;
                    handler({results: self.selectItems});
                }
                else if (element.val()) {
                    self.isInit = false;
                    this.filterData({
                        term: element.val(),
                        callback: handler
                    });
                }
                else if (self.isInit) {
                    self.isInit = false;
                    handler({results: []});
                }
            },

            /**
             * 选中的值
             * @param o
             */
            formatId: function (o) {
                return o[this.attrs.valueName || 'id'];
            },

            /**
             * 如何显示数据
             * @param item
             */
            formatResult: function (item, container, query) {
                return item[this.attrs.labelName || 'name'];
            },

            /**
             * 清空数据
             */
            reset: function () {
                this.selectItems = [];
                this.selectValues = [];
                this.inputElement.select2('val', '');
            },

            /**
             *
             * @param v
             */
            val: function () {
                if (this.attrs.multi) {
                    return this.selectValues;
                }
                else {
                    return this.selectValues[0];
                }
            },

            item: function () {
                if (this.attrs.multi) {
                    return this.selectItems;
                }
                else {
                    return this.selectItems[0];
                }
            },

            /**
             *
             */
            render: function () {
                this.element.change();
            }
        };

        return function (scope, element, attrs) {
            return new MultiSelect(scope, element, attrs);
        };
    });
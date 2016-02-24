//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UITagControl', ($q, Util, Ajax) => {
            class UIRemoteSelectControl extends UIFormItemControl {
                constructor(s, e, a) {
                    this.className = 'RemoteSelect';
                    this.selectValues = [];
                    this.selectItems = [];
                    super(s, e, a);
                }

                init() {
                    super.init();
                }

                initEvents() {
                    super.initEvents();

                    //选中
                    this.element.on('select2-selecting', (evt) => {
                        if (evt.object.isNew && this.attrs.editable == 'false') {  //不可编辑, 只能选择
                            return false;
                        }
                        this.selectValues.push(evt.val);
                        this.selectItems.push(evt.object);
                        this.scope.model = this.selectValues;
                        this.scope.change({
                            isAdd: true,
                            val: evt.val,
                            item: evt.object,
                            vals: this.selectValues,
                            items: this.selectItems
                        });
                        return true;
                    });

                    //移除
                    this.element.on('select2-removing', (evt) => {
                        this.selectValues = $.grep(this.selectValues, function (value) {
                            return value != evt.val;
                        });
                        this.selectItems = $.grep(this.selectItems, function (item) {
                            return item != evt.choice;
                        });
                        this.scope.model = this.selectValues;
                        this.scope.change({
                            isAdd: false,
                            val: evt.val,
                            item: evt.object,
                            vals: this.selectValues,
                            items: this.selectItems
                        });
                    });

                    //
                    this.scope.$watch('model', (val) => {
                        if (val) {
                            this.val(val);
                        }
                    });
                }

                render() {
                    super.render();
                    let config = this._getConfig();
                    this.inputElement = this.element.find('input').select2(config);
                }

                _getConfig() {
                    var selectOption = {
                        openOnEnter: false,
                        multiple: true,
                        createSearchChoice: $.proxy(this._createSearchChoice, this),
                        formatResult: $.proxy(this._formatResult, this),
                        formatSelection: $.proxy(this._formatResult, this),
                        id: $.proxy(this._formatId, this),
                        initSelection: $.proxy(this._initSelection, this),
                        query: $.proxy(this._filterData, this),
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

                    if (this.attrs.minmum) { //输入几个字符以后才能搜索
                        selectOption.minimumInputLength = this.attrs.minmum;
                    }
                    if (this.attrs.maxSize) { //最大选中几个
                        selectOption.maximumSelectionSize = this.attrs.maxSize;
                    }
                    selectOption.closeOnSelect = false;
                    return selectOption;
                }

                useParams(o) {
                    return $.extend(this.params, o || {}); //TODO: 额外查询参数
                }

                loadData() {
                    var defer = $q.defer();
                    if (this.datas) {
                        defer.resolve(this.datas);
                    }
                    else if (this.attrs.noData){
                        defer.resolve([]);
                    }
                    else {
                        Ajax.get(this.attrs.url, this.useParams()).then((r) => {
                            this.datas = r ? r.aaData || r : [];
                            $.each(this.datas, function (i, dd) { //遍历所有属性, 放入一个特殊变量, 用于后期查询使用
                                var s = [];
                                for (var k in dd) {
                                    s.push(k + '=' + (dd[k] || '').toString().toLowerCase());
                                }
                                dd.__string = s.join(',');
                            });
                            defer.resolve(this.datas);
                        });
                    }
                    return defer.promise;
                }

                _createSearchChoice(term, data) {
                    if ($(data).filter(function () {
                            return this.name.indexOf(term) === 0;
                        }).length === 0) {
                        return data.length <= 10 ? {id: term, name: term, isNew: true} : null; //最多10个
                    }
                }

                _filterData(o) {
                    var sfs = (this.attrs.search || '').toLowerCase().split(','),
                        keyword = o.term.toLowerCase(),
                        keyword2 = `,${keyword},`;
                    this.loadData().then((rs) => {
                        var os = [];
                        $.each(rs, (i, r) => {
                            var isC = false;
                            if (o.init) { //初始化, 那么只会根据
                                isC = keyword2.indexOf(`,${this._formatId(r)},`) != -1;
                            }
                            else { //根据属性过滤
                                if (sfs.length === 0 || sfs[0] === '') {
                                    isC = r.__string.indexOf(keyword) != -1;
                                }
                                else {   //针对特定属性
                                    $.each(sfs, function (ii, sf) {
                                        isC = (r[sf] || '').toString().toLowerCase().indexOf(keyword) != -1;
                                    });
                                }
                            }
                            if (isC) {
                                os.push(r);
                            }
                        });
                        o.callback({results: os});
                    });
                }

                _initSelection(element, callback) {
                    var self = this,
                        handler = function (data) {
                            callback(data.results);
                        };
                    if (self.isFocusInit) {
                        self.isFocusInit = false;
                        self.isInit = false;
                        handler({results: self.selectItems});
                    }
                    else if (element.val() !== undefined) {
                        self.isInit = false;
                        this._filterData({
                            term: element.val(),
                            init: true,
                            callback: handler
                        });
                    }
                    else if (self.isInit) {
                        self.isInit = false;
                        handler({results: []});
                    }
                }

                _formatId(o) {
                    return o[this.attrs.valueName || 'id'];
                }

                _formatResult(item, container, query) {
                    return item[this.attrs.labelName || 'name'];
                }

                reset() {
                    this.selectItems = [];
                    this.selectValues = [];
                    this.inputElement.select2('val', '');
                }

                val(vals) {
                    if (vals) {
                        this.inputElement.select2('val', vals);
                        if (_.isArray(vals)) {
                            this.selectValues = vals;
                        }
                        else {
                            this.selectValues = [vals];
                        }
                        var values = ',' + this.selectValues.join(',') + ',',
                            self = this;
                        this.loadData().then(function (datas) {
                            self.selectItems = $.grep(datas, function (data) {
                                return values.indexOf(',' + self._formatId(data) + ',') != -1;
                            });
                        });
                    }
                    else {
                        if (this.attrs.multi) {
                            return this.selectValues;
                        }
                        else {
                            return this.selectValues[0];
                        }
                    }
                }

                item() {
                    if (this.attrs.multi) {
                        return this.selectItems;
                    }
                    else {
                        return this.selectItems[0];
                    }
                }
            }
            return UIRemoteSelectControl;
        });
})();
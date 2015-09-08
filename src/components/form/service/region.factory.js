//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIRegionControl', (uiRegionHelper) => {
            class UIRegionControl extends UIFormItemControl {
                constructor(s, e, a) {
                    this.className = 'Region';
                    this.$inputDom = e.find('input:eq(0)');
                    this.$pDom = e.find('[name="province"]');
                    this.$cDom = e.find('[name="city"]');
                    this.$sDom = e.find('[name="area"]');
                    this.$aDom = e.find('[name="address"]');
                    this.valueType = a.valueType || 'text'; //保存的是文字还是ID
                    super(s, e, a);
                }

                init() {
                    super.init();
                    switch (this.attrs.mode) {
                        case 'p':
                            this.$cDom.hide();
                            this.$sDom.hide();
                            this.$aDom.hide();
                            break;
                        case 'c':
                            this.$sDom.hide();
                            this.$aDom.hide();
                            break;
                        case 's':
                            this.$aDom.hide();
                            break;
                    }
                }

                initEvents() {
                    super.initEvents();
                    this.$pDom.change((evt) => {
                        if (evt.val) {
                            uiRegionHelper.getCity(evt.val).then((data) => {
                                this.$cDom.select2(this.toCityData(data));
                                this.$sDom.select2(this.toStreetData());
                            });
                            this.$pDom.val(evt.added[this.valueType]);
                            this.$inputDom.val(evt.val);
                            this._change('p');
                        }
                        else {
                            this.reset();
                        }
                    });

                    //
                    this.$cDom.change((evt) => {
                        if (evt.val) {
                            uiRegionHelper.getStreet(evt.val).then((data) => {
                                this.$sDom.select2(this.toStreetData(data));
                            });
                            this.$cDom.val(evt.added[this.valueType]);
                            this.$inputDom.val(evt.val);
                            this._change('c');
                        }
                        else {
                            this.$sDom.select2(this.toStreetData());
                            this.$cDom.val('');
                            this.$inputDom.val('');
                        }
                    });

                    //
                    this.$sDom.change((evt) => {
                        if (evt.val) {
                            this.$sDom.val(evt.added[this.valueType]);
                            this.$inputDom.val(evt.val);
                            this._change('s');
                        }
                        else {
                            this.$sDom.val('');
                            this.$inputDom.val('');
                        }
                    });
                }

                render() {
                    super.render();
                    if (/^\d+$/g.test(this.codeValue)) {  //有区域ID
                        uiRegionHelper.htmlById(this.codeValue)
                            .then(function (ts) {
                                return ts.concat(uiRegionHelper.getProvince());
                            })
                            .then((p, c, s, data) => {
                                this.$pDom.select2(this.toProvinceData(data));
                                if (p) {
                                    this.$pDom.select2('val', p.id);
                                    this.$pDom.val(p[self.valueType]);
                                    return [c, s, uiRegionHelper.getCity(p.id)];
                                }
                                else {
                                    this.$cDom.select2(this.toCityData([]));
                                    this.$sDom.select2(this.toStreetData([]));
                                }
                                throw new Error();
                            })
                            .then((c, s, data) => {
                                this.$cDom.select2(self.toCityData(data));
                                if (c) {
                                    this.$cDom.select2('val', c.id);
                                    this.$cDom.val(c[self.valueType]);
                                    return [s, uiRegionHelper.getStreet(c.id)];
                                }
                                else {
                                    this.$sDom.select2(this.toStreetData([]));
                                }
                                throw new Error();
                            })
                            .then((s, data) => {
                                this.$sDom.select2(self.toStreetData(data));
                                if (s) {
                                    self.$sDom.select2('val', s.id);
                                    self.$sDom.val(s[self.valueType]);
                                }
                            });
                        this.$inputDom.val(this.codeValue);
                    }
                    else { //没有则直接加载省
                        uiRegionHelper.getProvince().then((data) => {
                            this.$pDom.select2(this.toProvinceData(data));
                            this.$cDom.select2(this.toCityData([]));
                            this.$sDom.select2(this.toStreetData([]));
                        });
                    }
                }

                toProvinceData(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择省'};
                }

                toCityData(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择市'};
                }

                toStreetData(data) {
                    return {data: data || [], allowClear: true, placeholder: '请选择区'};
                }

                reset() {
                    this.$inputDom.val('');
                    this.$pDom.val('').select2('val', '');
                    this.$cDom.val('').select2(this.toCityData());
                    this.$sDom.val('').select2(this.toStreetData());
                }

                _change(mode) {
                    this.scope.model = this.$inputDom.val();
                    let val = this.scope.mode,
                        p = this.$pDom.val(),
                        c = this.$cDom.val(),
                        s = this.$sDom.val();
                    this.scope.change({mode, val, p, c, s});
                }
            }

            return UIRegionControl;
        });
})();
angular.module('admin.component')
    .factory('uiRegionService', function (uiRegionHelper, msg, uiFormControl) {
        var m = new msg('Region'),
            Region = function (scope, element, attrs) {
                var $doms = element.find('input');
                this.$inputDom = $($doms[0]);
                this.$pDom = $($doms[1]);
                this.$cDom = $($doms[2]);
                this.$sDom = $($doms[3]);
                this.$aDom = $($doms[$doms.length - 1]);
                this.codeValue = attrs.sValue;
                this.autoWidth = attrs.autoWidth;
                this.mode = attrs.mode || 's';
                this.valueType = attrs.valueType || 'text'; //保存的是文字还是ID
                uiFormControl.apply(this, arguments);
            };
        Region.prototype = $.extend(new uiFormControl(), {

            _init: function () {
                var self = this;
                if (/^\d+$/g.test(this.codeValue)) {  //有区域ID
                    var p, c, s;
                    uiRegionHelper.htmlById(this.codeValue)
                        .then(function (ts) {
                            p = ts[2];
                            c = ts[1];
                            s = ts[0];
                            return uiRegionHelper.getProvince();
                        })
                        .then(function (data) {
                            self.$pDom.select2(self.toProvinceData(data));
                            if (p) {
                                self.$pDom.select2('val', p.id);
                                self.$pDom.val(p[self.valueType]);
                                return uiRegionHelper.getCity(p.id);
                            }
                            else {
                                return null;
                            }
                        })
                        .then(function (data) {
                            if (data) {
                                self.$cDom.select2(self.toCityData(data));
                                if (c) {
                                    self.$cDom.select2('val', c.id);
                                    self.$cDom.val(c[self.valueType]);
                                    return uiRegionHelper.getStreet(c.id);
                                }
                                else {
                                    return null;
                                }
                            }
                        })
                        .then(function (data) {
                            if (data) {
                                self.$sDom.select2(self.toStreetData(data));
                                if (s) {
                                    self.$sDom.select2('val', s.id);
                                    self.$sDom.val(s[self.valueType]);
                                }
                            }
                        });
                    this.$inputDom.val(this.codeValue);
                }
                else { //没有则直接加载省
                    uiRegionHelper.getProvince().then(function (data) {
                        self.$pDom.select2(self.toProvinceData(data));
                    });
                }

                //
                if (this.attrs.aValue) {
                    this.$aDom.val(this.attrs.aValue);
                }

                this.initMode();
                this.initEvent();
            },

            initMode: function () {
                var width = 0;
                switch (this.attrs.mode) {
                    case 'p':
                        width = 120 * 1;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.remove();
                        this.$sDom.remove();
                        break;
                    case 'c':
                        width = 120 * 2;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.select2(this.toCityData());
                        this.$sDom.remove();
                        break;
                    default:
                        width = 120 * 3;
                        this.$pDom.select2(this.toProvinceData());
                        this.$cDom.select2(this.toCityData());
                        this.$sDom.select2(this.toStreetData());
                }
                if (this.autoWidth) {
                    this.element.width(width + 60);
                }
            },

            initEvent: function () {
                var self = this;

                //
                this.$pDom.change(function (evt) {
                    if (evt.val) {
                        uiRegionHelper.getCity(evt.val).then(function (data) {
                            self.$cDom.select2(self.toCityData(data));
                            self.$sDom.select2(self.toStreetData());
                        });
                        this.$pDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.reset();
                    }
                }.bind(this));

                //
                this.$cDom.change(function (evt) {
                    if (evt.val) {
                        uiRegionHelper.getStreet(evt.val).then(function (data) {
                            self.$sDom.select2(self.toStreetData(data));
                        });
                        this.$cDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.$sDom.select2(this.toStreetData());
                        this.$cDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));

                //
                this.$sDom.change(function (evt) {
                    if (evt.val) {
                        this.$sDom.val(evt.added[this.valueType]);
                        this.$inputDom.val(evt.val);
                    }
                    else {
                        this.$sDom.val('');
                        this.$inputDom.val('');
                    }
                }.bind(this));
            },

            toProvinceData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择省'};
            },

            toCityData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择市'};
            },

            toStreetData: function (data) {
                return {data: data || [], allowClear: true, placeholder: '请选择区'};
            },

            reset: function () {
                this.$inputDom.val('');
                this.$pDom.val('').select2('val', '');
                this.$cDom.val('').select2(this.toCityData());
                this.$sDom.val('').select2(this.toStreetData());
            }
        });
        return function (s, e, a, c, t) {
            return new Region(s, e, a, c, t);
        };
    });
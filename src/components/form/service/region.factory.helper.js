//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiRegionHelper', function ($q, Message, AdminCDN, Ajax) {
        var m = new Message('UiRegionHelper'),
            requestQueue = [],

            isInitDataMaping = false,
            isInitDataMap = false,
            dataMapUrl = `${AdminCDN}/js/China_Region_Last.js`,
            dataMap,

            isInitDataList = false,
            dataList,


            isInitTreeData = false,
            strandardTreeData,
            allTreeData,
            rootId = '086',
            getSubDataList = function (pid, placeholder, $el, isRequire) {
                if (isRequire && pid === undefined) {
                    return;
                }
                else {
                    var self = this,
                        d = $q.defer();
                    this.getTreeData().then(function () {
                        var r = allTreeData[pid].child;
                        d.resolve(r);
                        $el && self.setHtml($el, r);
                    }, function () {
                        d.reject([]);
                    });
                    return d.promise;
                }
            };
        return {

            /**
             * json类型的数据
             */
            getDataMap: function () {
                var d = $q.defer();
                if (isInitDataMap) {    //加载过了, 就直接返回啦
                    d.resolve(dataMap);
                }
                else {
                    if (!isInitDataMaping) { //设置状态, 其他的请求放入队列, 保持多次调用只请求一次
                        isInitDataMaping = true;
                        $.getScript(dataMapUrl, function () {
                            d.resolve(dataMap = window['CHINA_REGION']);
                            $.each(requestQueue, function (ii, dd) {
                                dd.resolve(dataMap);
                            }); //返回所有请求队列
                            requestQueue = []; //清空请求队列
                            isInitDataMap = true;
                        }, function () {
                            isInitDataMaping = false; //设置状态，重新
                            d.reject({});
                        });
                    }
                    else {   //放入队列
                        requestQueue.push(d);
                    }
                }
                return d.promise;
            },

            /**
             * 列表数据
             * @param mode      p|c|s  默认是a, 也就是最小视图是什么模式, 省|市|区
             * @returns {promise}
             */
            getDataList: function (mode) {
                mode = mode || 's';
                var d = $q.defer();
                this.getTreeData().then(function () {
                    var dataList = [];
                    $.each(dataMap, function (k, v) {
                        var isC = false;
                        switch (mode) {
                            case 'p':
                                isC = v[1] == rootId;
                                break;
                            case 'c':
                                var p = allTreeData[v[1]];
                                if (p && p.id == rootId) {  //这个数据是省, 那是必须的
                                    isC = true;
                                }
                                else if (k == rootId) { //这个数据是全国, 那也是必须的
                                    isC = true;
                                }
                                else {
                                    var p2 = allTreeData[p.pid]; //这个数据是市, 那是必须的
                                    isC = p2 ? p2.id == rootId : false;
                                }
                                break;
                            case 's':
                                isC = true;
                                break;
                        }
                        if (isC) {
                            dataList.push({id: k, name: v[0], pid: v[1]});
                        }
                    });
                    d.resolve(dataList);
                    isInitDataList = true;
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             *
             * @param mode
             */
            getDatasByMode: function (mode) {
                mode = mode || 's';
                var d = $q.defer();
                this.getTreeData().then(function () {
                    var dataList = [];
                    $.each(allTreeData, function (id, o) {
                        if (o.mode == mode)
                            dataList.push(o);
                    });
                    d.resolve(dataList);
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             * tree类型的数据
             */
            getTreeData: function () {
                var d = $q.defer();
                if (isInitTreeData) {
                    d.resolve(strandardTreeData);
                }
                else {
                    this.getDataMap().then(function (dataMap) {
                        strandardTreeData = {'086': {id: rootId, text: '全国', child: []}};
                        allTreeData = {'086': {id: rootId, text: '全国', child: []}};
                        $.each(dataMap, function (k, v) {
                            var o = {id: k, text: v[0], child: [], pid: v[1], mode: null};
                            if (k != rootId) { //非全国
                                allTreeData[k] = o;
                            }

                            if (allTreeData[v[1]]) {
                                allTreeData[v[1]].child.push(o);
                                if (v[1] == rootId) {   //父ID是全国, 那么就是这条数据就是省
                                    o.mode = 'p';
                                    strandardTreeData[rootId].child.push(o);
                                }
                                else if (allTreeData[v[1]].pid == rootId) { //父id的父id是全国, 那么就是市
                                    o.mode = 'c';
                                }
                                else {
                                    o.mode = 's';
                                }
                            }
                        });
                        d.resolve(strandardTreeData);
                        isInitTreeData = true;
                    }, function () {
                        d.reject({});
                    });
                }
                return d.promise;
            },

            /**
             * 获取html
             */
            getHtml: function (dataList) {
                var h = [];
                $.each(dataList, function (i, data) {
                    var value = data.id;
                    h.push('<option value="' + value + '">' + data.text + '</option>');
                });
                return h.join('');
            },

            /**
             * 给el设置html
             * @param $el
             * @param dataList
             */
            setHtml: function ($el, dataList) {
                $el.html(this.getHtml(dataList)).change();
            },

            /**
             * 获取所有省
             */
            getProvince: function ($el) {
                return getSubDataList.call(this, rootId, '请选择省', $el, false);
            },

            /**
             * 根据省ID获取所有区
             * @param pid
             */
            getCity: function (pid, $el) {
                return getSubDataList.call(this, pid, '请选择市', $el, true);
            },


            /**
             * 根据ID获取所有街道
             * @param cip
             */
            getStreet: function (cid, $el) {
                return getSubDataList.call(this, cid, '请选择区', $el, true);
            },

            /**
             * 根据ID获取
             * @param id
             */
            getById: function (id) {
                var d = $q.defer();
                this.getTreeData().then(function () {
                    d.resolve(allTreeData[id]);
                }, function () {
                    d.reject({});
                });
                return d.promise;
            },

            /**
             * 设置内容根据街道ID
             */
            htmlById: function (sid, $sel, $cel, $pel) {
                var self = this,
                    d = $q.defer();
                this.getById(sid).then(function (target) {
                    if (target) {
                        var provinceId, cityId, streetId, p, c;
                        switch (target.mode) {
                            //省的话, 直接取值
                            case 'p':
                                provinceId = sid;
                                self.getProvince($pel); //
                                self.getCity(provinceId, $cel); //
                                d.resolve([null, null, target]);
                                break;
                            //市的话, 取他的省
                            case 'c':
                                p = allTreeData[target.pid];
                                provinceId = p.id;
                                cityId = sid;
                                self.getProvince($pel);
                                self.getCity(p.id, $cel);
                                self.getStreet(cityId, $sel);
                                d.resolve([null, target, p]);
                                break;
                            //区的话, 取他的市和省
                            case 's':
                                c = allTreeData[target.pid];
                                p = allTreeData[c.pid];
                                provinceId = p.id;
                                cityId = c.id;
                                streetId = sid;
                                self.getProvince($pel);
                                self.getCity(p.id, $cel);
                                self.getStreet(c.id, $sel);
                                d.resolve([target, c, p]);
                                break;
                            default:
                        }
                        setTimeout(function () {
                            provinceId && $pel && $pel.select2('val', provinceId);
                            cityId && $cel && $cel.select2('val', cityId);
                            streetId && $sel && $sel.select2('val', streetId);
                        }, 500);
                    }
                    else {
                        m.error('当前地址数据有误, 请重新编辑保存');
                        logger.error('[' + sid + ']');
                        self.getProvince($pel);
                        d.reject();
                    }
                });
                return d.promise;
            }
        };
    });
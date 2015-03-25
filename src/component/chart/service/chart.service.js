//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiChartFactory', function (componentHelper, msg, Event, ajax) {
        var m = new msg('Chart'),
            Chart = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.elementTarget = element.find('div');
                this.attrs = attrs;
                this.instance = null;
                this.xAxisName = this.attrs.xaxis;
                this.categories = this.attrs.categories ? this.attrs.categories.split(',') : [];
                this.pageData = null;
                this.config = {
                    title: {},
                    subtitle: {},
                    chart: {},
                    xAxis: {},
                    yAxis: {},
                    legend: {},
                    series: {}
                };
                this.init();
            };

        //
        Chart.prototype = {

            /**
             *
             */
            init: function () {
                this.config.title.text = this.attrs.title || '';
                this.config.subtitle.text = this.attrs.subTitle || '';
                this.config.chart.type = this.attrs.type;

                if (this.attrs.url) {
                    this.refresh(this.attrs.url);
                }
                componentHelper.tiggerComplete(this.scope, this.attrs.ref || ('$' + this.attrs.type + 'chart'), this);
            },

            /**
             *
             * @param url
             * @param params
             */
            refresh: function (url, params) {
                var self = this;
                ajax.post(url, params || {}).then(function (data) {
                    self.setData(data);
                });
            },

            /**
             *
             * @param type
             */
            setType: function (type) {
                this.config.chart.type = type;
                if (this.instance) {
                    this.instance.redraw();
                }
            },

            /**
             * 设置分组值
             */
            setCategories: function (categories, isClean) {
                this.categories = isClean ? categories : this.categories.concat(categories);
                if (this.pageData) {
                    this.setData(this.pageData);
                }
            },

            /**
             *
             * @param data
             */
            setXAxisData: function (data) {
                if (this.instance) {
                    this.instance.xAxis[0].setCategories(data, false);
                }
                else {
                    this.config.xAxis.categories = data;
                }
            },

            /**
             *
             */
            setData: function (data) {
                var self = this,
                    c = [],
                    r = [];

                //
                this.pageData = data;

                //遍历数据
                $.each(data, function (i, item) {
                    if (self.xAxisName) {
                        c.push(item[self.xAxisName] || '');
                    }
                    self.dataToSeriesData(item, r);
                });

                //
                this.setXAxisData(c);

                //
                if (this.instance) {
                    this.instance.series = r;
                    this.instance.redraw();
                }
                else {
                    this.config.series = r;
                    this.build();
                }
            },

            /**
             *
             */
            dataToSeriesData: function (data, r) {
                r = r || [];
                $.each(this.categories, function (j, category) { //遍历组字段
                    var v = data[category],
                        o = r[j] || {name: category, data: []};
                    o.data.push(v);
                    r[j] = o;
                });
            },

            /**
             *
             */
            build: function () {
                console.info(this.config);
                this.instance = this.elementTarget.highcharts(this.config);
            }
        };
        return Chart;
    });
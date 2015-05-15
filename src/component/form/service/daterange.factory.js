//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .value('uiDateRangeDefaultRange', {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
        '最近7天': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
        '最近30天': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')],
        '当前月': [moment().startOf('month'), moment().endOf('month')],
        '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
        '最近六个月': [moment().subtract('days', 182).startOf('day'), moment().endOf('day')]
    })
    .value('uiDateRangeDefaultConfig', {
        opens: ('right'),
        minDate: moment().subtract('year', 40).startOf('year'),
        maxDate: moment().add('year', 10).endOf('year'),
        showDropdowns: true,
        showWeekNumbers: false,
        timePickerIncrement: 1,
        timePicker12Hour: false,
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'green',
        cancelClass: 'default',
        separator: ' - ',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            resetLabel: '重置',
            fromLabel: '从',
            toLabel: '至',
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    })
    .factory('uiDateRangeService', function (msg, uiDateRangeDefaultConfig, uiDateRangeDefaultRange, uiFormControl) {
        var m = new msg('DateRange'),
            DateRange = function (scope, element, attrs) {
                this.className = 'DateRange';
                this.element = element;
                this.startDateElement = element.find('.input-group').find('input:first');
                this.endDateElement = element.find('.input-group').find('input:last');
                this.attrs = attrs;

                this.hasDefaultDateRange = !!this.attrs.range;
                this.isDateTimeMode = attrs.mode != 'date' || attr.time != undefined;
                this.format = attrs.format || (this.isDateTimeMode ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
                var dateRange = uiDateRangeDefaultRange[this.attrs.range] || [];
                this.defaultStartDate = attrs.fromValue || dateRange[0];
                this.defaultEndDate = attrs.toValue || dateRange[1];
                this.limit = attrs.limit;
                uiFormControl.apply(this, arguments);
            };
        DateRange.prototype = $.extend(new uiFormControl(), {
            _init: function () {
                this.config = $.extend({}, uiDateRangeDefaultConfig, {
                    ranges: uiDateRangeDefaultRange,
                    timePicker: this.isDateTimeMode,
                    format: this.format
                });

                //要小心设置这个值
                if (this.limit) {
                    this.config.dateLimit = {days: this.limit};
                }

                //默认值
                if (this.hasDefaultDateRange) {
                    this.config.startDate = this.defaultStartDate;
                    this.config.endDate = this.defaultEndDate;
                }
            },

            render: function () {
                this.element.find("div").daterangepicker(this.config, function (start, end) {
                    start = start ? start.format(this.format) : "";
                    end = end ? end.format(this.format) : "";
                    this.startDateElement.val(start);
                    this.endDateElement.val(end);
                    this.$emit('change', this, start, end);
                }.bind(this));
            },

            reset: function () {
                this.startDateElement.val('');
                this.endDateElement.val('');
            },

            val: function (sv, ev) {
                if (sv) {
                    this.startDateElement.val(sv);
                }
                if (ev) {
                    this.endDateElement.val(ev);
                }
                if (!sv && !ev) {
                    return [this.startDateElement.val(), this.endDateElement.val()];
                }
                else {
                    return this;
                }
            }
        });
        return function(s, e, a, c, t){
            return new DateRange(s, e, a, c, t);
        };
    });
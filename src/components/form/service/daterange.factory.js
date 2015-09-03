//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    let uiDateRangeDefaultRange = {
        '今天': [moment().startOf('day'), moment().endOf('day')],
        '昨天': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
        '最近7天': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
        '最近30天': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')],
        '当前月': [moment().startOf('month'), moment().endOf('month')],
        '上个月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
        '最近六个月': [moment().subtract('days', 182).startOf('day'), moment().endOf('day')]
    };

    let uiDateRangeDefaultConfig = {
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
    };


    angular.module('admin.component')
        .factory('UIDateRangeControl', () => {
            class UIDateRangeControl extends UIFormControl {
                constructor(s, e, a) {
                    this.className = 'DateRange';
                    this.startDateElement = e.find('.input-group').find('input:first');
                    this.endDateElement = e.find('.input-group').find('input:last');

                    this.hasDefaultDateRange = !!a.range;
                    this.isDateTimeMode = a.mode !== 'date' || a.time !== undefined;
                    this.format = a.format || (this.isDateTimeMode ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');

                    this.limit = a.limit;
                    super(s, e, a);
                }

                init() {
                    super.init();

                    //默认值
                    let dateRange = uiDateRangeDefaultRange[this.attrs.range] || [];
                    this.defaultStartDate = this.attrs.fromValue || dateRange[0];
                    this.defaultEndDate = this.attrs.toValue || dateRange[1];

                    //
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
                }

                render() {
                    this.element.find("div").daterangepicker(this.config, (startVal, endVal) => {
                        startVal = startVal ? startVal.format(this.format) : "";
                        endVal = endVal ? endVal.format(this.format) : "";
                        this.val(startVal, endVal);
                        this.scope.change({startVal, endVal});
                    });
                }

                reset() {
                    this.startDateElement.val('');
                    this.endDateElement.val('');
                }

                val(sv, ev) {
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
            }

            return UIDateRangeControl;
        });
})();
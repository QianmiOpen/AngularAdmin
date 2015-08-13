//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UIDateControl', () => {
            class UIDateControl extends UIFormControl {
                constructor(s, e, a) {
                    this.className = 'Date';
                    this.formEl = e.find('input');
                    this.dateMode = a.mode ? a.mode.indexOf('date') != -1 : true;
                    this.timeMode = a.mode ? a.mode.indexOf('time') != -1 : true;
                    super(s, e, a);
                }

                init() {
                    super.init();
                    var format = [];
                    if (this.dateMode)
                        format.push('yyyy-MM-dd');
                    if (this.timeMode)
                        format.push('HH:mm:ss');
                    this.format = format.join(' ');
                }

                initEvents() {
                    super.initEvents();
                }

                render(){
                    this.formEl.datetimepicker({
                        language: 'zh-CN',
                        pickDate: this.dateMode,
                        useCurrent: false,
                        pickTime: this.timeMode,
                        useSeconds: this.timeMode
                    });
                }
            }

            return UIDateControl;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .factory('UIInputControl', () => {
            class UIInputControl extends UIFormItemControl {

                constructor(s, e, a) {
                    this.className = 'Input';
                    this.formEl = e.find('input');
                    super(s, e, a);
                }
            }
            return UIInputControl;
        });
})();
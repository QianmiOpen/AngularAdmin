//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class UIInputControl extends UIFormControl {

        constructor(s, e, a) {
            this.className = 'Input';
            this.formEl = e.find('input');
            super(s, e, a);
        }
    }


    angular.module('admin.component')
        .service('UIInputControl', () => UIInputControl);
})();
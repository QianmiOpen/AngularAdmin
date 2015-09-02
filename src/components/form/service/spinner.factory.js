//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISpinnerControl', () => {
            class UISpinnerControl extends UIFormControl {
                constructor(s, e, a) {
                    this.className = 'Spinner';
                    this.formEl = e.find('input');
                    super(s, e, a);
                }

                init() {
                    super.init();
                }

                initEvents() {
                    super.initEvents();
                    this.element.on('mousedown', '.spinner-up', () => this._changeValue(true));
                    this.element.on('mousedown', '.spinner-down', () => this._changeValue(false));
                }

                _changeValue(isAdd) {
                    let step = (this.attrs.step || 1) * 1,
                        min = (this.attrs.min || 0) * 1,
                        max = (this.attrs.max || Number.MAX_VALUE) * 1,
                        val = this.val();
                    val = val !== undefined ? parseInt(val) : this.attrs.value;
                    val = val + (step * ( isAdd ? 1 : -1));
                    if (val > max) {
                        val = max;
                    }
                    if (val < min) {
                        val = min;
                    }
                    this.scope.model = val;
                    this.scope.change({val: val});
                }
            }
            return UISpinnerControl;
        });
})();
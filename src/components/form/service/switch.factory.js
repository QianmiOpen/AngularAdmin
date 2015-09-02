//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.component')
        .factory('UISwitchControl', () => {
            class UISwitchControl extends UIFormControl {
                constructor(s, e, a) {
                    this.className = 'Switch';
                    this.formEl = e.find('input');
                    this.checkEl = this.formEl[0];
                    super(s, e, a);
                }

                init() {
                    super.init();
                    this.onValue = this.attrs.onValue || '1';
                    this.offValue = this.attrs.offValue || '0';
                    this.onText = this.attrs.onText || '开';
                    this.offText = this.attrs.offText || '关';
                }

                initEvents() {
                    super.initEvents();
                }

                render() {
                    this.formEl.bootstrapSwitch({
                        size: 'normal',
                        onText: this.onText,
                        offText: this.offText,
                        onSwitchChange: (evt, state) => {
                            this._change(state)
                        }
                    });
                    this.formEl.bootstrapSwitch('state', this.attrs.value == this.onValue);
                    this.checkEl.checked = true;

                    this.scope.$watch('model', (newValue) => {
                        if (newValue != this.val()) {
                            this.val(newValue);
                        }
                    });

                    if (!this.scope.model) {
                        let val = this.offValue;
                        this.scope.model = val;
                    }
                }

                disabled(open) {
                    this.formEl.bootstrapSwitch('disabled', open == 'true');
                }


                val(val) {
                    if (val !== undefined) {
                        this.formEl.bootstrapSwitch('state', val == this.onValue);
                        return this;
                    }
                    else {
                        return this.formEl.val();
                    }
                }

                _change(state) {
                    var v = state ? this.onValue : this.offValue;
                    this.val(v);
                    this.checkEl.checked = true;
                    this.scope.model = v;
                    this.scope.change({val: v});
                }
            }
            return UISwitchControl;
        });
})();
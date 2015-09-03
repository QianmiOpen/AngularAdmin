/**
 * 表单控件
 */
class UIFormControl extends ComponentEvent {
    constructor(scope, element, attrs) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
        this.isSearchControl = element.parents('.ui-search-form').length > 0;
        this.formPrefix = this.isSearchControl ? '$search' : '$form';
        this.formResetEventName = this.isSearchControl ? 'uisearchform.reset' : 'uiform.reset';
        this.init();
        this.initEvents();
        this.cleanElement();
        this.render();
    }

    init() {
        this.message = new Message('Input');
        this.scope.lcol = this.scope.lcol !== undefined ? this.scope.lcol : 2;
        this.scope.rcol = this.scope.rcol !== undefined ? this.scope.rcol : 10;
        this.triggerComplete(this.scope, this.attrs.ref || (this.formPrefix + this.className), this);
    }

    initEvents() {
        this.scope.$on(this.formResetEventName, () => this.reset());
    }

    cleanElement() {
        this.element.removeAttr('name').removeAttr('model').removeAttr('readonly').removeAttr('disabled');
    }

    attr(k, v) {
        if (this.formEl) {
            if (k && v) {
                this.formEl.prop(k, v);
                return this;
            }
            else {
                return this.formEl.prop(k);
            }
        }
    }

    val(v) {
        if (this.formEl) {
            if (v) {
                this.formEl.val(v);
                return this;
            }
            else {
                return this.formEl.val();
            }
        }
    }

    destroy() {
        delete this.listenerMap;
        this.reset();
    }

    change(fn) {
        this.$on('change', fn);
    }

    render() {
    }

    reset() {
        if (this.formEl) {
            this.formEl.val('');
        }
    }
}


angular.module('admin.component')
    .factory('uiFormControl', () => UIFormControl);
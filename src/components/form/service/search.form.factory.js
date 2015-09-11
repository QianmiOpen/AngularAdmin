//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('UISearchFormControl', () => {
        class UISearchFormControl extends UIFormItemControl {

            constructor(s, e, a, transclude) {
                this.className = 'searchForm';
                this.content = transclude(s.$parent);
                super(s, e, a);
            }

            init() {
                super.init();
                this.scope.component = this;
                this.scope.lcol = this.scope.lcol || 11;
                this.scope.rcol = this.scope.rcol || 1;
                this.element.find('.row > div:eq(0)').append(this.content);
            }

            initEvents() {
                super.initEvents();
            }

            formData() {
                return this.element.serializeArray();
            }

            formParamData() {
                return this.element.serialize();
            }

            search() {
                var data = this.formData();
                this.scope.$parent.$broadcast('uitable.search', data);
            }

            reset() {
                this.scope.$broadcast('uisearchform.reset');
            }
        }
        return UISearchFormControl;
    });
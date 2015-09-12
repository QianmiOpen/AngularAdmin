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
                this.scope.lcol = this.scope.lcol || 11;
                this.scope.rcol = this.scope.rcol || 1;
                super.init();
                this.scope.component = this;
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
                this.scope.onSearch({data: data});
                this.scope.$parent.$broadcast('uitable.search', data);
            }

            reset() {
                this.scope.onReset();
                this.scope.$broadcast('uisearchform.reset');
            }
        }
        return UISearchFormControl;
    });
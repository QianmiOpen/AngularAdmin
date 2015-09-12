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
                this.content = transclude(s.$parent);
                super(s, e, a);
            }

            init() {
                this.attrs.ref = this.attrs.ref || '$searchForm';
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

            formJsonData() {
                let data = this.formData(),
                    r = {};
                for (let item of data) {
                    if (item.value === undefined) {
                        continue;
                    }
                    if (r[item.name]) {
                        r[item.name] = _.isArray(r[item.name]) ? r[item.name] : [r[item.name]];
                        r[item.name].push(item.value)
                    }
                    else {
                        r[item.name] = item.value;
                    }
                }
                return r;
            }

            search() {
                var data = this.formData();
                this.scope.onSearch({data: data});
                this.scope.$parent.$broadcast('uitable.search', data);
            }

            reset() {
                this.scope.onReset();
                this.scope.$parent.$broadcast('uisearchform.reset');
            }
        }
        return UISearchFormControl;
    });
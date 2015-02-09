//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .factory('uiSearchFormFactory', function (msg, Event) {
        var m = new msg('SearchForm'),
            SearchForm = function (scope, tableId, element, attrs) {
                Event.call(this);
                this.element = element;
                this.elementContainer = element.find('.row > div:eq(0)');
                this.attrs = attrs;
                this.scope = scope;
                this.tableId = tableId;
                this.initEvent();
            };
        SearchForm.prototype = {
            addFormItem: function (formItem) {
                this.elementContainer.append(formItem);
            },
            initEvent: function () {
                $(document).keydown(function (evt) {
                    if (evt.keyCode == 13) {
                        this.search();
                    }
                }.bind(this));
                this.element.submit(function(evt){
                    evt.preventDefault();
                    return false;
                });
            },
            formData: function () {
                return this.element.serializeArray();
            },
            formParamData: function(){
                return this.element.serialize();
            },
            search: function () {
                var data = this.formData();
                this.$emit('uisearchform.doSubmit', data);
                if (this.scope[this.tableId]) {
                    this.scope[this.tableId].search(data);
                }
                else {
                    m.error('为发现ref为[' + this.tableId + ']的组件, 无法调用查询');
                }
            },
            submit: function (fn) {
                this.$on('uisearchform.doSubmit', fn);
            },
            reset: function () {
                this.scope.$broadcast('uisearchform.reset');
            }
        };
        return function (scope, tableId, element, attrs) {
            return new SearchForm(scope, tableId, element, attrs);
        };
    });
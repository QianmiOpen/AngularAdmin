//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableCheckColumn', function (UITableColumnControl) {
        class UITableCheckColumnControl extends UITableColumnControl {
            constructor(s, e, a) {
                this.className = 'CheckColumn';
                super(s, e, a);
            }

            init() {
                super.init();
                this.$table = this.element.parents('table');
                this.$tableBody = this.$table.find('tbody');
            }

            initEvents() {
                super.initEvents();
                this.scope.$emit('uitable.column.idname', this.attrs.name);
                this.scope.selectAllHandler = (evt) => {
                    this._selectAllHandler(evt);
                };
            }

            render(rowData) {
                var val = this.getValue(rowData);
                return $(`<input type="checkbox" value="${val}"/>`).data('rowData', rowData).click((evt) => {
                    this._selectOneHandler(evt);
                });
            }

            _selectAllHandler(evt) {
                let isCheck = evt.target.checked;
                this.$tableBody.find('input[type=checkbox]').prop('checked', isCheck).uniform();
                this.scope.$emit('uitable.column.selectall', isCheck);
            }

            _selectOneHandler(evt) {
                let $target = $(evt.target);
                this.scope.$emit('uitable.column.selectone', {isCheck: evt.target.checked, rowData: $target.data('rowData'), value: $target.val()});
            }
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableCheckColumnControl($scope, $element, $attrs);
            },
            template: `
                <th>
                    <input type="checkbox" ng-click="selectAllHandler($event)"/>
                </th>
            `
        };
    });
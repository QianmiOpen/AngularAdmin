//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableDateColumn', function (UITableColumnControl, Util) {
        class UITableDateColumnControl extends UITableColumnControl {
            constructor(s, e, a) {
                this.className = 'DateColumn';
                super(s, e, a);
            }

            init() {
                super.init();
                this.format = this.attrs.format || 'yyyy-MM-dd HH:mm:ss';
            }

            render(rowData) {
                var val = this.getValue(rowData);
                if (val) {
                    val = Util.dateFormatStr(val, this.format);
                }
                return $('<div/>').html(val);
            }
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableDateColumnControl($scope, $element, $attrs);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    });
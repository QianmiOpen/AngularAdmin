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
                this.format = a.format || 'yyyy-MM-dd HH:mm:ss';
                super(s, e, a);
            }

            init() {
                super.init();
            }

            render(rowData) {
                var val = this.getValue(rowData);
                if (val) {
                    val = Util.dateFormatStr(val, format);
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
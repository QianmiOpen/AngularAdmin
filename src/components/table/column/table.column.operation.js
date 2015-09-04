//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableOperationColumn', function (UITableColumnControl) {
        class UITableOperationColumnControl extends UITableColumnControl {
            constructor(s, e, a) {
                this.className = 'OperationColumn';
                super(s, e, a);
            }

            init() {
                super.init();
            }

            render(rowData) {
                var val = this.getValue(rowData),
                    defaultValue = this.attrs.default,
                    $dom, $s = this.scope.$new();
                $s.data = rowData;
                this.transclude($s, function (clone) {
                    $dom = clone.filter('[state="' + val + '"]');
                    if ($dom.length === 0) { //用默认值
                        $dom = clone.filter('[state="' + defaultValue + '"]');
                    }
                    if ($dom.length === 0) { //还没有...
                        clone.forEach((dom) => {
                            if (dom.innerHTML && dom.innerHTML.indexOf(defaultValue) != -1) {
                                $dom = $(dom);
                            }
                        });
                    }
                });
                return $dom;
            }
        }
        return {
            restrict: 'E',
            replace: true,
            tranclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableOperationColumnControl($scope, $element, $attrs);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    });
//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableStateColumn', function (UITableColumnControl) {
        class UITableStateColumnControl extends UITableColumnControl {
            constructor(s, e, a, t) {
                this.className = 'StateColumn';
                super(s, e, a, t);
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
                        $.each(clone || [], (index, dom) => {
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
            transclude: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs, $transclude) {
                return new UITableStateColumnControl($scope, $element, $attrs, $transclude);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    })
;
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
                    $dom;
                if (this.hasTransclude) {
                    $dom = this._getFromTransclude(rowData, val);
                }
                else if (this.scope.map) {
                    $dom = this._getFromMap(val)
                }
                return $dom;
            }

            _getFromMap(val) {
                if (_.isArray(this.scope.map)) {
                    for (let item of this.scope.map) {
                        if (item[this.sName] == val) {
                            return item.name;
                        }
                    }
                }
                else if (_.isObject(this.scope.map)) {
                    return this.scope.map[val];
                }
            }

            _getFromTransclude(rowData, val) {
                let $dom, $s = this.scope.$new(), defaultValue = this.attrs.default;
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
                head: '@',
                map: '='
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
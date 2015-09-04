//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableProgressColumn', function (UITableColumnControl) {
        class UITableProgressColumnControl extends UITableColumnControl {
            constructor(s, e, a) {
                this.className = 'ProgressColumn';
                super(s, e, a);
            }

            init() {
                super.init();
            }

            render(rowData) {
                let val = this.getValue(rowData), level,
                    dom = this._getDom();
                val = val !== undefined ? val : 0;
                if (val <= 25)
                    level = 'progress-bar-danger';
                else if (val <= 50)
                    level = 'progress-bar-danger';
                else if (val <= 75)
                    level = 'progress-bar-info';
                dom.attr('title', val + '%').find('div').addClass(level).animate({width: val + '%'}).end();
                return dom;
            }

            _getDom() {
                return $(`
                    <div style="border: 1px solid #57b5e3;" class="progress progress-striped active" role="progressbar"style="margin-bottom:0px;">
                        <div class="progress-bar"></div>
                    </div>
                `);
            }
        }
        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableProgressColumnControl($scope, $element, $attrs);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    });
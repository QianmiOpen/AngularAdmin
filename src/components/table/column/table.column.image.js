//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiTableImageColumn', function (UITableColumnControl) {
        class UITableImageColumnControl extends UITableColumnControl {
            constructor(s, e, a) {
                super(s, e, a);
            }

            init() {
                super.init();
            }

            render(rowData) {
                var val = this.getValue(rowData),
                    placeholder = this.attrs.placeholder,  //默认图片
                    qiniu = this.attrs.qiniu; //七牛后缀
                if (val === undefined) {
                    val = placeholder;
                }
                if (val !== undefined && qiniu) {
                    val = val + qiniu;
                }
                return $('<img/>').attr('src', val).addClass(this.scope.imageCss);
            }
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                head: '@',
                imageCss: '@'
            },
            controller: function ($scope, $element, $attrs) {
                return new UITableImageColumnControl($scope, $element, $attrs);
            },
            template: `
                <th>
                    {{head}}
                </th>'
            `
        };
    });
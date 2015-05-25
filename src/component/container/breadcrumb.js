//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiBreadcrumb', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function (el, attrs) {
                var dataList = attrs.data.split(','),
                    h = [];
                for (var i = 0; i < dataList.length; i++) {
                    var data = dataList[i].split(':');
                    h.push([
                        '<li>',
                            '<a href="' + (data[1] || '#') + '">' + data[0] + '</a>',
                            i != dataList.length - 1 ? '<i class="fa fa-angle-right"></i>' : '',
                        '</li>'
                    ].join(''));
                }
                return [
                    '<div class="page-bar">',
                        '<ul class="page-breadcrumb">',
                            h.join(''),
                        '</ul>',
                    '</div>'
                ].join('')
            }
        };
    });
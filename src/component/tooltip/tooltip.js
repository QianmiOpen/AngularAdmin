//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attrs) {
                var content = attrs.tooltip,
                    title = attrs.title,
                    placement = attrs.placement || (title ? 'right' : 'top');

                //如果有标题有内容, 那么使用popup over
                if (title) {
                    element.popover({
                        title: title,
                        content: content,
                        placement: placement,
                        trigger: 'hover'
                    });
                }
                //否则使用tooltip
                else {
                    element.tooltip({
                        title: content,
                        placement: placement
                    });
                }
            }
        };
    });
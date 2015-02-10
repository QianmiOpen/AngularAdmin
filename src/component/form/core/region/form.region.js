//-----------------------------------------------------------------------------------------------
//
//
//  参数
//      p -- 省, 开关, 默认开, 可不填
//      c -- 市, 开关, 默认开, 可不填
//      s -- 区, 开关, 默认开, 可不填
//      a -- 地址, 开关, 默认关
//
//      s-name -- 区域的name
//      a-name -- 详细地址的name
//
//
//      p-value -- 省(当只要显示省的时候, 那就必须要填了)
//      c-value -- 市(当只要显示省和市区的时候, 那就必须要填了)
//      s-value -- 区域默认值
//      a-value -- 地址值
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormRegion', function (uiRegionService, componentHelper, defaultCol) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                //
                attrs.autoWidth = false;
                var region = new uiRegionService(scope, element, attrs);
                componentHelper.tiggerComplete(scope, attrs.ref || '$formRegion', region);

                //
                scope.$on('uiform.reset', function () {
                    region.reset();
                });
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.region', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });
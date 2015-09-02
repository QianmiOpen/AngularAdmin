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
    .directive('uiFormRegion', function (UIRegionControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                lcol: '@',
                rcol: '@',
                label: '@',
                css: '@',
                name: '@',
                model: '=',
                change: '&',
                help: '@',
                type: '@',
                mode: '@'
            },
            link: (s, e, a) => {
                new UIRegionControl(s, e, a);
            },
            template: `
                <div class="form-group">
                   <label class="col-md-{{lcol || DefaultCol.l}} control-label">{{label}}</label>
                   <div class="col-md-{{rcol || DefaultCol.r}}">
                        <input type="hidden" name="{{name}}" ng-value={{value}}/>
                        <input type="text" class="input-small form-control input-inline" name="province"/>
                        <input ng-if="!mode || mode == 's' || mode == 'c'" type="text" class="input-small form-control input-inline" name="city"/>
                        <input ng-if="!mode || mode == 's'" type="text" class="input-small form-control input-inline" name="area"/>
                        <input ng-if="!mode" type="text" class="input-medium form-control input-inline" name="address" ng-value={{aValue}}/>
                        <span ng-if="help" class="help-block">{{help}}</span>
                   </div>
               </div>'
            `
        };
    });
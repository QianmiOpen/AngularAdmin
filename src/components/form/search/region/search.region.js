//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchRegion', function (UIRegionControl) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model: '=',
                change: '&',
                label: '@',
                name: '@',
                mode: '@'
            },
            link: (s, e, a) => {
                if (a.mode === undefined || a.mode == 'a') { //区域查询不支持详细地址
                    a.mode = 's';
                }
                new UIRegionControl(s, e, a);
            },
            template: `
                <div class="input-inline search-item">
                    <div class="input-group ui-search-region">
                        <div ng-if="label" class="input-group-addon">{{label}}:</div>
                        <input type="hidden" name="{{name}}"/>
                        <input type="text" class="input-small form-control input-inline" name="province"/>
                        <input type="text" class="input-small form-control input-inline" style="left:-1px" name="city"/>
                        <input type="text" class="input-small form-control input-inline" style="left:-2px" name="area"/>
                    </div>
                </div>
            `
        };
    });
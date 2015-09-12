//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchDateRange', function (UIDateRangeControl) {
        return {
            restrict: 'E',
            replace: true,
            link: function (s, e, a) {
                new UIDateRangeControl(s, e, a);
            },
            scope: {
                css: '@',
                name: '@',
                fromModel: '=',
                toModel: '=',
                change: '&',
                label: '@'
            },
            template: `
                 <div class="input-inline ui-search-item input-mlarge {{css}}">
                    <div class="input-group">
                        <input type="text" readonly class="form-control" name="{{fromName}}" ng-model="fromModel"/>
                        <span class="input-group-addon">{{label || '到'}}</span>
                        <input type="text" readonly class="form-control" name="{{toName}}" ng-model="toModel"/>
                    </div>
                </div>
            `
        };
    });
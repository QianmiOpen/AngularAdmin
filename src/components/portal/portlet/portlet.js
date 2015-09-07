//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortlet', function (UIPortletControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                captionClass: '@',
                title: '@',
                icon: '@',
                url: '@'
            },
            link: function (scope, elemt, attrs, contrllor, transclude) {
                new UIPortletControl(scope, elemt, attrs, transclude);
            },
            template: `
                <div class="portlet">
                    <div class="portlet-title tabbable-line">
                        <div class="caption">
                            <i ng-if="icon" class="{{icon}}"></i>
                            <span class="caption-subject {{captionClass}}">{{title}}</span>
                        </div>
                    </div>
                    <div class="portlet-body">
                    </div>
                </div>
            `
        };
    });




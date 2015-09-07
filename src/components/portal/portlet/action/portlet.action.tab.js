//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortletActionTab', function (uiTabFactory, componentHelper, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            compile: function () {
                var tab = null;
                return {
                    pre: function (scope, element, attrs) {
                        tab = uiTabFactory(scope, element, attrs);
                        tab.getContainer = function(){
                            return element.parents('.portlet').find('.portlet-body');
                        };
                        scope[attrs.ref] = tab;
                    },
                    post: function(){
                        if(tab.items.length > 0){
                            $timeout(function(){
                                tab.showAtIndex(0);
                            });
                        }
                    }
                };
            },
            template: `
                <ul class="nav nav-tabs portlet-tool-bar" ng-transclude>
                </ul>
            `
        };
    });




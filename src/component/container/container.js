//-----------------------------------------------------------------------------------------------
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiContainer', function ($timeout, $controller, $injector) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: false,
            controller: function ($scope, $attrs, $element, $transclude) {
                if($attrs.sameScope != undefined){
                    $element.append($transclude($scope));
                }
                $scope.$on('componentComplete', function (evt, o) {
                    if (o) {
                        $scope[o.ref] = o.component;
                    }
                });
            },
            link: function (scope, element, attrs) {
                element.show();
                $timeout(function(){
                    if (attrs.controller) {
                        var ctrlArgs = /\(([^\)]+)\)/.exec(window[attrs.controller].toString())[1],
                            args = {$scope: scope};
                        ctrlArgs = ctrlArgs.split(',');
                        for (var i = 1, arg; arg = $.trim(ctrlArgs[i]); i++) {
                            args[arg] = $injector.get(arg);
                        }
                        $controller(window[attrs.controller], args);
                    }
                    else {
                        scope.$emit('uicontainer.ready'); // 触发
                    }
                });
            },
            template: function (elemet, attrs) {
                if(attrs.sameScope != undefined){
                    return '<div></div>';
                }
                else{
                    return '<div ng-transclude></div>';
                }
            }
        };
    });
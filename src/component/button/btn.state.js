//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiStateButton', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ctr, transclude) {
                var c = transclude().text(),
                    clickHandlerName = attrs;
                element.html(c);
                if(clickHandlerName){
                    element.click(function(){
                        element.prop('disabled', true);
                        var r = scope[clickHandlerName]();
                        if(r.finally){
                            r.finally(function(){
                                element.prop('disabled', false);
                            });
                        }
                        else{
                            element.prop('disabled', false);
                        }
                    });
                }
            },
            template: 'tpl.button.state'
        };
    });
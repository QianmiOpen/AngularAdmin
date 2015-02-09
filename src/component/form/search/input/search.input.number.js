//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchNumberInput', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element) {
                //
                var $input = element.find('input');
                scope.$on('uisearchform.reset', function () {
                    $input.val('');
                });
                $input.onkeyup(function(evt){
                    var v = this.value;
                    v = v.replace(/[^\d]/g, '');
                    this.value = v;
                });

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.searchform.input', attrs);
            }
        };
    });
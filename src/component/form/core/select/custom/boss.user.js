//-----------------------------------------------------------------------------------------------
//
//
//  特定组件 - BOSS 员工选择
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSelectUser', function (uiMultiSelectFactory, util) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            controller: function ($scope, $element, $attrs) {
                util.setTag('bossUser', new uiMultiSelectFactory($scope, $element, $attrs), $scope);
            },
            template: function (element, attrs) {
                var labelConfig = attrs.labelName ? '' : 'label-name="name"',
                    valueConfig = attrs.valueName ? '' : 'label-name="name"',
                    allConfig = labelConfig + valueConfig,
                    department = attrs.department||"";
                if (attrs.multi) {
                    return '<input data-url="/sysconfig/orguser?'+ (department?('department='+department):'') +'" minmum="1" search=""  ' + allConfig + '/>';
                }
                else {
                    return '<input type="hidden" data-url="/sysconfig/orguser?'+ (department?('department='+department):'') +'" search=""  ' + allConfig + '/>';
                }
            }
        };
    });

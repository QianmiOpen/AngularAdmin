//-----------------------------------------------------------------------------------------------
//
//
//  特定组件 - BOSS 员工选择
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiSelectTag', function (uiMultiSelectFactory, util) {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            controller: function ($scope, $element, $attrs, ajax, msg) {
                var selectHelper = new uiMultiSelectFactory($scope, $element, $attrs);
                util.setTag($attrs.tag || 'selectTag', selectHelper, $scope);

                var classifyId = $attrs.classify,
                    usercode = $attrs.usercode; //分类ID
                $scope.$on('uiSelect.doAdd', function(evt, addObj, tag){
                    ajax.post('/sysconfig/tag/rel/add', {name: addObj.name, classify: classifyId, id: addObj.isNew ? '': addObj.id, usercode: usercode}).then(function(data){
                        addObj.id = data;
                        delete addObj.isNew;
                        msg.success('添加成功');
                    });
                });
                $scope.$on('uiSelect.doDel', function(evt, delObj, tag){
                    if(!delObj.isNew){ //新的
                        ajax.post('/sysconfig/tag/rel/del', {name: delObj.name, classify: classifyId, id: delObj.id, usercode: usercode}).then(function(){
                            msg.success('删除成功');
                        });
                    }
                });
            },
            template: function (element, attrs) {
                var labelConfig = attrs.labelName ? '' : 'label-name="name"',
                    valueConfig = attrs.valueName ? '' : 'label-name="name"',
                    classifyId = attrs.classify,
                    allConfig = labelConfig + valueConfig;
                return '<input multi data-url="/sysconfig/tag/list?classify=' + classifyId  + '" search=""  ' + allConfig + '/>';
            }
        };
    });

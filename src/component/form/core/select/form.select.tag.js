//-----------------------------------------------------------------------------------------------
//
//
//  针对select的封装
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiFormTagSelect', function (uiMultiSelectFactory, componentHelper, tagConfig, defaultCol, msg, ajax) {
        return {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs) {

                //


                //
                var select = uiMultiSelectFactory(scope, element, $.extend({}, tagConfig, attrs, {
                    url: tagConfig.url + attrs.classify,
                    multi: true
                }));
                componentHelper.tiggerComplete(scope, attrs.ref || '$formUserSelect', select);

                //
                scope.$on('uiform.reset', function () {
                    select.reset();
                });

                //
                var classifyId = attrs.classify,
                    manual = attrs.manual != undefined,
                    usercode = attrs.usercode; //分类ID
                if(!manual){
                    select.$on('uiSelect.doAdd', function(addObj, tag){
                        ajax.post('/sysconfig/tag/rel/add', {name: addObj.name, classify: classifyId, id: addObj.isNew ? '': addObj.id, usercode: usercode}).then(function(data){
                            addObj.id = data;
                            delete addObj.isNew;
                            msg.success('添加成功');
                        });
                    });
                    select.$on('uiSelect.doDel', function(delObj, tag){
                        if(!delObj.isNew){ //新的
                            ajax.post('/sysconfig/tag/rel/del', {name: delObj.name, classify: classifyId, id: delObj.id, usercode: usercode}).then(function(){
                                msg.success('删除成功');
                            });
                        }
                    });
                }

                //
                element.removeAttr('name').removeAttr('readonly').removeAttr('model');
            },
            template: function (element, attrs) {
                var cc = (attrs.col || defaultCol).split(':');
                return componentHelper.getTemplate('tpl.form.input', $.extend({
                    leftCol: cc[0],
                    rightCol: cc[1]
                }, attrs));
            }
        };
    });

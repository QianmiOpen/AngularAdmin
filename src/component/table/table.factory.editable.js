//-----------------------------------------------------------------------------------------------
//
//
//  创建Table的委托对象, 目前使用datatable作为第三方库, 方法和其他差不多
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiTableEditableFactory', function (msg) {
        var m = new msg('TableEditable'),
            TableEditable = function () {
                this.editUrl = this.attrs.editUrl;
                this.editFormName = this.attrs.formName;
                this.editRuleMap = {};
                if (this.editFormName) {
                    $.getJSON('/validator?cm=' + this.formName, function (rules) {
                        this.editRuleMap = rules;
                    }.bind(this));
                }
                else if (this.editUrl) {
                    //m.error('开始编辑模式, 但是未提供form-name校验数据的地址');
                }

                this.toggleEdit = function (isEdit) {
                    this.scope.$broadcast('uitable.editabled', isEdit);
                };
                this.getRuleByName = function (name) {
                    return this.editRuleMap[name] || {};
                };
            };

        /**
         *
         */
        return TableEditable;
    })
;
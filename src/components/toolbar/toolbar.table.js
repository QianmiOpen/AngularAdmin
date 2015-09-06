//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiToolBarTable', function (UITableToolBarControl) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                editable: '@',
                add: '@',
                del: '@',
                tip: '@'
            },
            controller: ($scope, $element, $attrs, $transclude) => {
                new UITableToolBarControl($scope, $element, $attrs, $transclude);
            },
            template: `
                <div class="ui-toolbar table-toolbar">
                    <div class="btn-group pull-left">
                        <button ng-if="editable" type="button" class="btn btn-sm btn-info" ng-click="component.toggleEdit()"><i class="fa fa-edit"></i> <span ng-bind="editText"></span>快速编辑</button>&nbsp;&nbsp;
                        <button ng-if="add" type="button" class="btn btn-sm btn-primary" ng-click="component.doAddItem()"><i class="fa fa-plus-circle"></i> 新增{{tip}}</button>&nbsp;&nbsp;
                        <button ng-if="del" type="button" ng-class="{'btn-danger': table.selectItems.selectValues.length > 0}" class="btn btn-sm" ng-disabled="table.selectItems.length==0" ng-click="component.doDelItem()"><i class="fa fa-times-circle"></i> 删除{{tip}}</button>&nbsp;&nbsp;
                    </div>

                    <span ng-show="table.selectItems.length > 0" class="table-toolbar-tip fadeInRight">您已选择 <strong ng-bind="selectItems.length"></strong> 个{{tip}}，支持翻页选择多个{{tip}}。</span>

                    <div class="btn-group pull-right">
                        <a class="btn default btn-sm" href="#" data-hover="dropdown"><i class="fa fa-table"></i></a>
                        <div class="dropdown-menu dropdown-checkboxes pull-right">
                            <label ng-repeat="column in table.aoColumns" ng-if="component.isShow($index, column)" style="cursor:pointer" >
                                <div class="checker">
                                    <span ng-class="{checked: column.bVisible}">
                                        <input type="checkbox" ng-click="component.toggleColumn($event, column)">
                                    </span>
                                </div>
                                <span ng-bind="column.mTitle"/>
                            </label>
                         </div>
                    </div>
                    <div style="clear:both"></div>
                </div>
            `
        };
    });

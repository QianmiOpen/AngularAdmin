(function ($) {
    angular.module('admin.template')
        .run(function (componentHelper) {

            /**
             *
             */
            componentHelper.setTemplate('tpl.toolbar.table', [
                '<div class="ui-toolbar table-toolbar">',

                    '<div class="btn-group pull-left">',
                        '{{#if editable}}',
                            '<button type="button" class="btn btn-sm btn-info" ng-click="{{ref}}.toggleEdit()"><i class="fa fa-edit"></i> <ng-bind>{{ref.editText}}</ng-bind> 快速编辑</button>&nbsp;&nbsp;',
                        '{{/if}}',
                        '{{#if add}}',
                            '<button type="button" class="btn btn-sm btn-primary" ng-click="{{ref}}.doAddItem()"><i class="fa fa-plus-circle"></i> 新增{{tip}}</button>&nbsp;&nbsp;',
                        '{{/if}}',
                        '{{#if del}}',
                            '<button type="button" ng-class="{\'btn-danger\': {{table}}.selectValues.length > 0}" class="btn btn-sm" ng-disabled="{{table}}.selectValues.length==0" ng-click="{{ref}}.doDelItem({{table}}.selectValues)"><i class="fa fa-times-circle"></i> {{deltip}}{{tip}}</button>&nbsp;&nbsp;',
                        '{{/if}}',
                    '</div>',

                    '<div class="btn-group pull-left" ng-transclude></div>',

                    '<span ng-show="{{table}}.selectValues.length != 0" class="table-toolbar-tip fadeInRight">您已选择 <strong ng-bind="{{table}}.selectValues.length"></strong> 个{{tip}}，支持翻页选择多个{{tip}}。</span>',

                    //uitable column show or hide select area
                    '<div class="btn-group pull-right">',
                        '<a class="btn default btn-sm" href="#" data-hover="dropdown"><i class="fa fa-table"></i></a>',
                        '<div class="dropdown-menu dropdown-checkboxes pull-right">',
                            '<label ng-repeat="column in {{table}}.columns" ng-if="{{ref}}.isShow($index, column)" style="cursor:pointer" >',
                                '<div class="checker">',
                                    '<span ng-class="{checked: column.bVisible}">',
                                        '<input type="checkbox" ng-click="{{ref}}.toggleColumn($event, column)">',
                                    '</span>',
                                '</div>',
                                '<span ng-bind="column.mTitle"/>',
                            '</label>',
                            '<label class="divider"></label>',
                            '<label style="text-align: center;"><a href="javascript:;" ng-click="{{table}}.cleanState()" class="btn btn-sm green easy-pie-chart-reload"><i class="fa fa-repeat"></i> 恢复默认</a></label>',
                        ' </div>',
                    '</div>',
                    '<div style="clear:both"></div>',
                '</div>'
            ].join(''));
        });
})(jQuery);
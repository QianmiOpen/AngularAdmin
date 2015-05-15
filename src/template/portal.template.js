(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal',[
                '<div class="row ui-sortable">',
                    '<div class="column sortable col-md-{{eachColumn}}" ng-repeat="column in columns">',
                        '<ui-portlet-container ng-repeat="portlet in column"></ui-portlet-container>',
                        '<div class="portlet-container portlet-sortable-empty"></div>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.container',[
                '<div class="portlet-container">',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet',[
                '<div class="portlet">',
                    '<div class="portlet-title tabbable-line">',
                        '<div class="caption"><span class="caption-subject {{captionClass}}">{{title}}</span></div>',
                    '</div>',
                    '<div class="portlet-body">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action',[
                '<div class="actions portlet-tool-bar" ng-transclude>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.pagination',[
                '<ul class="pagination pagination-circle portlet-tool-bar">',
                    '<li ng-class="{\'disabled\': isFirst}" ><a href="javascript:;" ng-click="loadFirst()"><i class="fa fa-angle-left"></i></a></li>',
                    '<li ng-repeat="page in pageList" ng-class="{\'active\': page.current}" ng-click="load(page.index)"><a href="javascript:;" ng-bind="page.index"></a></li>',
                    '<li ng-class="{\'disabled\': isLast}" ><a href="javascript:;" ng-click="loadLast()"><i class="fa fa-angle-right"></i></a></li>',
                '</ul>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.search',[
                '<div class="inputs portlet-tool-bar">',
                    '<div class="portlet-input input-inline input-small">',
                        '<div class="input-icon right">',
                            '<i class="icon-magnifier"></i>',
                            '<input type="text" {{#if model}}ng-model="{{model}}"{{/if}} class="form-control input-circle" placeholder="查询"/>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.portal.portlet.action.tab',[
                '<ul class="nav nav-tabs portlet-tool-bar" ng-transclude>',
                '</ul>'
            ].join(''));
        });
})(jQuery);
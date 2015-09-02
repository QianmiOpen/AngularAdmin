//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiToolBarTable', function (uiTableToolBarFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                //
                element.find('[data-hover="dropdown"]').dropdownHover();

                //
                var tableRef = componentHelper.getComponentRef(element.parent().find('.ui-table'), '$table'),
                    ref = attrs.ref || '$tableToolBar',
                    toolbar = uiTableToolBarFactory(scope, tableRef, element, attrs);
                scope[ref] = toolbar;
                componentHelper.tiggerComplete(scope, ref, toolbar);
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.toolbar.table', {
                    editable: attrs.editable != undefined,
                    add: attrs.add != undefined,
                    del: attrs.del != undefined,
                    table: componentHelper.getComponentRef(element.parent().find('ui-table'), '$table'),
                    ref: componentHelper.getComponentRef(element, '$tableToolBar'),
                    tip: attrs.tip || '数据',
                    deltip: attrs.deltip || '删除'
                });
            }
        };
    });

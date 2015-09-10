//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiRegionTree', function (UITreeControl, uiRegionHelper) {

        class UIRegionTreeControl extends UITreeControl {
            constructor(s, e, a, t) {
                super(s, e, a, t);
            }

            load() {
                uiRegionHelper.getDataList(this.attrs.mode || 's')
                    .then((data) => this.setData(data));
            }
        }


        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                onBeforeClick: '&',
                onClick: '&',
                onBeforeCheck: '&',
                onDataSuccess: '&',
                onDataFail: '&',
                onCheck: '&',

                onComplete: '&',

                onAdd: '@',
                onEdit: '@',
                onRemove: '&',

                checked: '=',
                filter: '='
            },
            compile: function () {
                var uiTree = null;
                return {
                    pre: function (s, e, a, c, t) {
                        uiTree = new UIRegionTreeControl(s, e, a, t);
                        uiTree.init();
                        uiTree.initEvents();
                    },
                    post: function () {
                        uiTree.build();
                    }
                };
            },
            template: `
                <div>
                    <ul class="ztree ui-tree"></ul>
                    <div style="display:none">
                        <span ng-if="onAdd" class="button add" ng-click="onAddHandler(treeNode)"></span>
                        <span ng-if="onEdit" class="button edit" ng-click="onEditHandler(treeNode)"></span>
                        <span ng-if="onRemove" class="button remove" ng-click="onRemoveHandler(treeNode)"></span>
                    </div>
                </div>
            `
        };
    });
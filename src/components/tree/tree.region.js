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
            scope: {
                onBeforeClick: '&',
                onClick: '&',
                onBeforeCheck: '&',
                onDataSuccess: '&',
                onDataFail: '&',
                onCheck: '&',

                Checked: '=',
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
                <ul class="ztree ui-tree"></ul>
            `
        };
    });
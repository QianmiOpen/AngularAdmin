//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiTree', function (UITreeControl) {
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
                        uiTree = new UITreeControl(s, e, a, t);
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
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .provider('uiTreeConfig', function () {

        var defaultConfig = {
            check: {enable: true},
            edit: {enable: false},
            data: {
                key: {name: "name", childs: "childs", title: "name"},
                simpleData: {enable: true, idKey: "id", pIdKey: "pid", rootPId: "0"}
            },
            view: {addHoverDom: null, removeHoverDom: null},
            callback: {beforeClick: null, onClick: null, onCheck: null}
        };

        var defaultBtnBuilder = function (treeNodeBtnClass, treeNode) {
            var $span = $("#" + treeNode.tId + "_span");
            var $spanBtn = $("<span class='button'></span>").addClass(treeNodeBtnClass.className).attr('title', treeNodeBtnClass.label).click(function (evt) {
                treeNodeBtnClass.handler(treeNode);
                evt.stopPropagation();
            });
            $span.append($spanBtn);
            return {
                show: function () {
                    $spanBtn.show();
                },
                hide: function () {
                    $spanBtn.hide();
                }
            };
        };


        var Config = function (tree) {
            $.extend(this, defaultConfig);
            this.tree = tree;

            //
            this.check.enable = tree.attrs.check != 'false';
            this.edit.enable = tree.attrs.edit == 'true';

            //
            this.callback = {
                beforeClick: this.call.bind(this, 'onBeforeClick'),
                onClick: this.call.bind(this, 'onClick'),
                beforeCheck: this.call.bind(this, 'onBeforeCheck'),
                onCheck: this.onCheck.bind(this)
            };

            this.view = {
                addHoverDom: this.onMouseEnterHandler.bind(this),
                removeHoverDom: this.onMouseLeaveHandler.bind(this)
            };

            this.treeNodeBtnMap = {};
        };
        Config.prototype = {

            /**
             *
             * @param treeId
             * @param treeNode
             */
            onMouseEnterHandler: function (treeId, treeNode) {
                this.treeNodeBtnMap[treeNode.id] = this.treeNodeBtnMap[treeNode.id] || {};
                var treeNodeBtnInstances = this.treeNodeBtnMap[treeNode.id],  //所有这个treenode实例
                    treeNodeBtnClasses = this.tree.treeNodeBtns;  //这个tree正对treenode可以创建的扩展按钮
                $.each(treeNodeBtnClasses, function (index, treeNodeBtnClass) { //遍历, 如果创建过了就显示，没创建过就创建
                    var treeNodeBtnInstance = treeNodeBtnInstances[treeNodeBtnClass.label];
                    if (!treeNodeBtnInstance) {
                        treeNodeBtnInstance = defaultBtnBuilder(treeNodeBtnClass, treeNode);
                        treeNodeBtnInstances[treeNodeBtnClass.label] = treeNodeBtnInstance;
                    }
                    treeNodeBtnInstance.show();
                });
            },

            /**
             *
             * @param treeId
             * @param treeNode
             */
            onMouseLeaveHandler: function (treeId, treeNode) {
                $.each(this.treeNodeBtnMap[treeNode.id] || {}, function (index, treeNodeBtnInstance) {
                    treeNodeBtnInstance.hide();
                });
            },

            onCheck: function (evt, id, nodeData) {
                var selectDatas = this.tree.instance.getCheckedNodes(true);
                this.tree.setSelectData(selectDatas);
                this.call('onCheck', ['', evt, id, nodeData]);
            },

            call: function (attrName) {
                var args = arguments,
                    bc = this.tree.attrs[attrName],
                    scope = this.tree.scope;
                if (bc) {
                    args = Array.prototype.slice.call(args, 1);
                    return scope[bc].apply(scope, args);
                }
                else {
                    return true;
                }
            }
        };


        return {

            /**
             * 提供给设置配置
             * @param config
             */
            setConfig: function (config) {
                defaultConfig = $.extend(defaultConfig, config);
            },

            $get: function () {
                return function (tree) {
                    return new Config(tree);
                };
            }
        };
    });
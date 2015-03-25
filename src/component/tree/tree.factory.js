//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('uiTreeFactory', function (ajax, uiTreeConfig, uiRegionHelper, logger, util, msg, Event) {
        var m = new msg('Tree'),
            Tree = function (scope, element, attrs) {
                Event.call(this);
                this.scope = scope;
                this.element = element;
                this.attrs = attrs;
                this.instance = null;
                this.selectItems = [];
                this.selectValues = [];
                this.treeNodeBtns = [];
                this.init();
            };

        //
        Tree.prototype = {

            /**
             *
             */
            init: function () {
                if (this.attrs.region != undefined) { //是否是树形区域
                    uiRegionHelper.getDataList(this.attrs.region || 's').then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else if (this.attrs.url) {
                    ajax.post(this.attrs.url).then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else {
                    //
                }

                //
                if (this.attrs.onAdd != undefined) {
                    this.addTreeNodeBtn('新增', 'add', this.onTreeNodeAddClickHandler.bind(this));
                }
                if (this.attrs.onEdit != undefined) {
                    this.addTreeNodeBtn('编辑', 'edit', this.onTreeNodeEditClickHandler.bind(this));
                }
                if (this.attrs.onDel != undefined) {
                    this.addTreeNodeBtn('删除', 'remove', this.onTreeNodeDelClickHandler.bind(this));
                }
            },

            /**
             *
             */
            refresh: function (params, url) {
                url = url || this.attrs.url;
                if (url) {
                    return ajax.post(this.attrs.url, params || {}).then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else {
                    m.error('未设置url, 无法请求');
                }
            },

            /**
             *
             * @param label
             * @param className
             * @param handler
             */
            addTreeNodeBtn: function (label, className, handler) {
                this.addTreeNodeBtnAtIndex(this.treeNodeBtns.length, label, className, handler);
            },

            /**
             *
             * @param label
             * @param className
             * @param handler
             */
            addTreeNodeBtnAtIndex: function (index, label, className, handler) {
                this.treeNodeBtns.splice(index, 0, {
                    label: label,
                    className: className,
                    handler: handler
                });
            },

            /**
             *
             */
            onTreeNodeAddClickHandler: function (treeNode) {
                var handlerName = this.attrs.onAdd;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-add, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            onTreeNodeDelClickHandler: function (treeNode) {
                var handlerName = this.attrs.onDel;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-del, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            onTreeNodeEditClickHandler: function (treeNode) {
                var handlerName = this.attrs.onEdit;
                if (handlerName && this.scope[handlerName]) {
                    this.scope[handlerName](treeNode);
                }
                else {
                    m.error('设置了on-edit, 但是未发现处理函数');
                }
            },

            /**
             *
             */
            setData: function (resData, pid) {
                resData = resData.menuTreeList || resData || [];
                if (this.attrs.root != undefined) {
                    var rootLabel = this.attrs.root || '根目录',
                        rootId = this.attrs.rootId || '0';
                    resData.push({"id": rootId, "open": "true", "pid": null, "name": rootLabel, "type": "1"});
                }
                this.instance = $.fn.zTree.init(this.element, uiTreeConfig(this), resData);
                this.expand(pid);
                this.checked((this.attrs.setCheck || '').split(','));
            },

            /**
             * 展开
             * @param pid
             */
            expand: function (level) {
                level = level || this.attrs.expand;
                var instance = this.instance,
                    root = instance.getNodes()[0],
                    expandInternal = function (n, l) {
                        if (n && n.children && l-- > 1) {
                            for (var i = 0; i < n.children.length; i++) {
                                instance.expandNode(n.children[i], true, false, false); //打开下级
                                expandInternal(n.children[i], l);
                            }
                        }
                    };

                if (level == 1) { //只打开自己
                    instance.expandNode(root, true, false, false);
                }
                else {
                    expandInternal(root, level);
                }
            },

            /**
             *
             * @param id
             */
            expandById: function (id) {
                var findNodes = this.instance.getNodeByParam('id', id);
                if (findNodes ){
                    this.instance.expandNode(findNodes, true, false, false);
                }
                else {
                    m.error('未找到id为[' + id + ']的节点, 无法展开');
                }
            },

            /**
             *
             * @param cs
             */
            checked: function (cs, isClean) {
                if (isClean) {
                    this.selectItems = [];
                    this.selectValues = [];
                }
                for (var i = 0, c; c = cs[i]; i++) {
                    var node = this.instance.getNodeByParam("id", c, null);
                    this.instance.checkNode(node, true, true);
                    this.selectItems.push(node);
                }
                this.selectValues = $.map(this.selectItems, function (item) {
                    return item.id;
                });
            },

            /**
             *  清空选中
             */
            cleanChecked: function(){
                var self = this;
                $.each(this.selectItems, function(i, selectItem){
                    var node = self.instance.getNodeByParam("id", selectItem.id, null);
                    self.instance.checkNode(node, false, true);
                });
            },

            /**
             * 设置选中的数据
             * @param data
             */
            setSelectData: function (data) {
                this.selectItems = data;
                this.selectValues = $.map(this.selectItems, function (item) {
                    return item.id;
                });
            }
        };
        return function (scope, element, attrs) {
            return new Tree(scope, element, attrs);
        };
    });
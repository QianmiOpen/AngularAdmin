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
                this.searchModel = attrs.searchModel;
                this.searchMode = attrs.searchMode;
                this.checkedValues = (attrs.setCheck || '').split(',');
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
                    //說明是手動拉
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

                //
                if (this.searchModel) {
                    var self = this;
                    this.scope.$watch(this.searchModel, function (nv) {
                        if (nv != undefined) {
                            self.filter(nv);
                        }
                    });
                }
            },

            /**
             *
             */
            refresh: function (params, url) {
                url = url || this.attrs.url;
                if (url) {
                    return ajax.post(url, params || {}).then(function (r) {
                        this.setData(r);
                    }.bind(this));
                }
                else {
                    m.error('未设置url, 无法请求');
                }
            },

            /**
             *
             */
            filter: function (filterText) {
                if (!this.dataList) //没数据, 玩个毛~
                    return;
                var searchList = this.dataList;
                if (filterText) {
                    filterText = filterText.toLowerCase();
                    var self = this;
                    searchList = [];
                    $.each(this.dataList, function (dataIndex, data) {
                        if (data.name.toLowerCase().indexOf(filterText) != -1) {
                            searchList = searchList.concat(self.getHierarchyDataById(data.id));
                        }
                    });
                    var r = [],
                        m = {};
                    $.each(searchList, function (index, data) {
                        if (!m[data.id]) {
                            r.push(data);
                        }
                        m[data.id] = data;
                    });
                    searchList = r;
                }
                this.setData(searchList, null, true);
                this.expandAll(true);
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
            setData: function (resData, pid, isFilter) {
                //
                resData = resData.menuTreeList || resData || [];
                if (!!!isFilter) {
                    this.dataList = resData;
                    this.dataMap = {};
                    $.each(resData, function (nn, data) {
                        this.dataMap[data.id] = data;
                    }.bind(this));
                }
                if (this.attrs.root != undefined) {
                    var rootLabel = this.attrs.root || '根目录',
                        rootId = this.attrs.rootId || '0';
                    resData.push({"id": rootId, "open": "true", "pid": null, "name": rootLabel, "type": "1"});
                }

                //
                this.$emit('dataSuccess', resData);

                //
                this.instance = $.fn.zTree.init(this.element, uiTreeConfig(this), resData);
                this.expand(pid);
                if (this.checkedValues) {
                    this.checked(this.checkedValues);
                }
                var r = $.grep(resData, function (data) {
                    return data.checked + '' == 'true';
                });
                this.item(this.selectItems.concat(r));
            },

            /**
             * 获取层级关系
             */
            getHierarchyById: function (id) {
                var r = [],
                    node = this.getById(id);
                if (node) {
                    r.push(node);
                    while (node = node.getParentNode()) {
                        r.unshift(node);
                    }
                }
                return r;
            },

            /**
             *
             * @param id
             */
            getHierarchyDataById: function (id) {
                var r = [],
                    node = this.getDataById(id);
                if (node) {
                    r.push(node);
                    while (node = this.getDataById(node.pid)) {
                        r.unshift(node);
                    }
                }
                return r;
            },

            /**
             *
             * @param id
             * @returns {*}
             */
            getById: function (id) {
                return this.instance.getNodeByParam('id', id);
            },

            /**
             *
             */
            getDataById: function (id) {
                return this.dataMap[id];
            },

            /**
             * 展开
             * @param pid
             */
            expand: function (level) {
                level = level || this.attrs.expand;
                if (level == 'all') {
                    this.expandAll(true);
                    return;
                }
                if (level == undefined) {
                    return;
                }
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
             */
            expandAll: function (isExpand) {
                this.instance.expandAll(isExpand);
            },

            /**
             *
             * @param id
             */
            expandById: function (id) {
                var findNodes = this.getById(id);
                if (findNodes) {
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
                var r = [];
                for (var i = 0, c; i < cs.length; i++) {
                    c = cs[i];
                    if (c) {
                        var node = this.instance.getNodeByParam("id", c, null);
                        if (node) {
                            this.instance.checkNode(node, true, true);
                            r.push(node);
                        }
                    }
                }
                this.item(r);
            },

            /**
             *
             */
            item: function (item) {
                if (item) {
                    this.selectItems = item;
                    this.selectValues = $.map(this.selectItems, function (item) {
                        return item.id;
                    });
                }
                else {
                    return this.selectItems;
                }
            },

            /**
             *
             */
            val: function () {
                //NOT SUPPORTED
            },

            /**
             *  清空选中
             */
            cleanChecked: function () {
                var self = this;
                $.each(this.selectItems, function (i, selectItem) {
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
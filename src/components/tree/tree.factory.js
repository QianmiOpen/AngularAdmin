//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    var requestMethod = 'post',
        idName = 'id',
        pidName = 'pid',
        labelName = 'name',
        defaultConfig = {
            check: {enable: true},
            edit: {enable: false},
            data: {
                key: {name: "name", childs: "childs", title: "name"},
                simpleData: {enable: true, idKey: "id", pIdKey: "pid", rootPId: "0"}
            },
            view: {addHoverDom: null, removeHoverDom: null},
            callback: {beforeClick: null, onClick: null, onCheck: null}
        };

    angular.module('admin.component')
        .provider('UITreeControl', function () {
            let result = {

                setDataName(_idName, _labelName, _pidName) {
                    defaultConfig.data.simpleData.idKey = idName = _idName;
                    defaultConfig.data.simpleData.pIdKey = pidName = _pidName;
                    defaultConfig.data.key.name = labelName = _labelName;
                },

                setRequestMethod(_requestMethod) {
                    requestMethod = _requestMethod;
                },

                $get(AdminCDN, Ajax) {
                    class UITreeControl extends ComponentEvent {
                        constructor(scope, element, attrs, transclude) {
                            super();
                            this.element = element;
                            this.scope = scope;
                            this.attrs = attrs;
                            this.transclude = transclude;
                            this.message = new Message('UITree');
                            this.init();
                            this.initEvents();
                        }

                        init() {
                            this.element.attr('id', 'uiTree' + new Date().getTime());
                            this.callback = {
                                beforeClick: () => {
                                },
                                onClick: () => {
                                },
                                beforeCheck: () => {
                                },
                                onCheck: () => {
                                }
                            };
                            this.view = {
                                addHoverDom: () => {
                                },
                                removeHoverDom: () => {
                                }
                            };
                            this.triggerComplete(this.scope, this.attrs.ref || '$tree', this);
                        }

                        initEvents() {
                            this.scope.$watch('filter', (val) => {
                                this._filter(val);
                            });
                        }

                        build() {
                            if ($.fn.ztree) {
                                this.load();
                            }
                            else {
                                Ajax.getScript(`${AdminCDN}/js/zTree_v3/js/jquery.ztree.all-3.5.min.js`)
                                    .then(() => this.load());
                            }
                        }

                        load(params, url) {
                            url = url || this.attrs.url;
                            if (url) {
                                return Ajax[requestMethod](url, params || {})
                                    .then((r) => {
                                        this.scope.onDataSuccess({result: r});
                                        this.setData(r);
                                    })
                                    .catch((r) => {
                                        this.scope.onDataFail({result: r});
                                        this.setData(r);
                                    });
                            }
                            else {
                                this.message.error('未设置url, 无法请求');
                            }
                        }

                        setData(resData) {
                            resData = resData || [];
                            if (this.attrs.root !== undefined) {
                                let rootData = {open: true, type: 1};
                                rootData[idName] = this.attrs.rootId || '0';
                                rootData[labelName] = this.attrs.root || '根';
                                resData.push(rootData);
                            }
                            this.instance = $.fn.zTree.init(this.element, $.extend({}, defaultConfig, this), resData);
                        }

                        _filter(filterText) {
                        }
                    }
                    return UITreeControl;
                }
            };
            return result;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .provider('UIEditorControl', () => {
            let configUrl, allUrl,
                result = {
                    setUrl(_configUrl, _allUrl) {
                        configUrl = _configUrl;
                        allUrl = _allUrl;
                    },

                    $get() {
                        class UIEditorControl extends UIFormControl {

                            constructor(s, e, a) {
                                this.className = 'Editor';
                                this.$scriptElement = e.find('script');
                                super(s, e, a);
                            }

                            init() {
                                super.init();
                                this.editorId = 'uiFromEditor' + new Date().getTime();
                                this.$scriptElement.attr('id', this.editorId);
                            }

                            render() {
                                super.render();
                                if (window.UE) {
                                    this._initEditor();
                                }
                                else {
                                    $.getScript(configUrl, () => {
                                        $.getScript(allUrl, () => {
                                            this._initEditor();
                                        });
                                    });
                                }
                            }

                            reset() {
                                this.editor.setContent('');
                            }

                            val(val) {
                                if (val !== undefined) {
                                    this.editor.setContent(val);
                                    return this;
                                }
                                else {
                                    return this.editor.getContent();
                                }
                            }

                            getEditor() {
                                return this.editor;
                            }

                            _initEditor() {
                                this.editor = UE.getEditor(this.editorId, {
                                    autoHeightEnabled: true
                                });
                                this.editor.addListener('contentChange', () => {
                                    this._change();
                                });
                            }

                            _change() {
                                let content = this.val();
                                this.scope.model = content;
                                this.scope.change({val: content});
                            }
                        }
                        return UIEditorControl;
                    }
                };
            return result;
        });
})();
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .factory('UIPortletControl', function (Ajax, $compile) {

        class UIPortletControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.message = new Message('UIPortlet');
                this.init();
                this.initEvents();
                this.render();
            }

            init() {
                this.bodyElement = this.element.find('.portlet-body');
                this.headElement = this.element.find('.portlet-title');
                this.triggerComplete(this.scope, this.attrs.ref || '$portlet', this);
            }

            initEvents() {
            }

            render() {
                let $content = this.transclude(this.scope.$parent),
                    $toolbar = $content.filter('.portlet-tool-bar');
                if ($toolbar.length === 0) {
                    $.each($content, (i, c) => {
                        if (c.nodeName.indexOf('UI-PORTLET-ACTION') != -1) {
                            $toolbar = $(c);
                            return false;
                        }
                    });
                }
                this.bodyElement.append($content);
                if ($toolbar.length !== 0) {
                    this.headElement.append($toolbar);
                }
                this.load();
            }

            load(params, url) {
                url = url || this.scope.url;
                if (url) {
                    Ajax.get(url, params || {})
                        .then((html) => {
                            let $dom = $compile(html)(this.scope);
                            this.bodyElement.append($dom);
                        });
                }
            }

            setTitle(title) {
                this.headElement.find('span').html(title);
            }
        }

        return UIPortletControl;
    });
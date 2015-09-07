//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .controller('UIPortalControl', function () {

        class UIPortalControl extends ComponentEvent {
            constructor(scope, element, attrs, transclude) {
                super();
                this.element = element;
                this.scope = scope;
                this.attrs = attrs;
                this.transclude = transclude;
                this.message = new Message('UIPortal');
                this.init();
                this.initEvents();
            }

            init(){
            }

            initEvents(){
            }
        }

        return UIPortalControl;
    });
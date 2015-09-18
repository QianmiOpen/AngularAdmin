(function () {

    let stateProvider, templateBasePath, isLazyTemplate;

    class SuperRouter {
        constructor() {
            super()
        }

        addSimple(name){
        }

        add(name, url, template, controller) {
        }
    }


    angular.module('admin')
        .provider('SuperRouter', () => {
            let r = {
                setTemplateBasePath(_templateBasePath) {
                    templateBasePath = _templateBasePath;
                },

                setLazyTemplate(_isLazyTemplate) {
                    isLazyTemplate = _isLazyTemplate;
                },

                $get() {
                    return new SuperRouter();
                }
            }
        })
        .config(($stateProvider) => {
            stateProvider = $stateProvider;
        });
})();
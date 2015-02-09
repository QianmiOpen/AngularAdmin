//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component', [])
    .service('componentHelper', function ($templateCache) {

        /**
         * 组件已经挂载
         * @param $scope
         * @param ref
         * @param target
         */
        this.tiggerComplete = function ($scope, ref, target) {
            $scope[ref] = target;
            $scope.$emit('componentComplete', {ref: ref, component: target});
        };

        /**
         * 获取组件的ref
         * @param element
         * @param defaultRef
         * @returns {*}
         */
        this.getComponentRef = function (element, defaultRef) {
            var ref = element.attr('ref') || defaultRef;
            return ref;
        };

        /**
         * 获取模板
         */
        this.getTemplate = function (key, context) {
            var htmlTxt = $templateCache.get(key),
                template = Handlebars.compile(htmlTxt);
            return template(context);
        };

        /**
         *
         */
        this.setTemplate = function (key, template) {
            $templateCache.put(key, template);
        };
    });

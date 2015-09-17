//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('maxlength', function () {
            return {
                restrict: 'a',
                link: function (scope, element, attrs) {
                    let length = attrs.maxlength;
                    if (/^\d+$/g.test(length)) {
                        $('input.className').maxlength({
                            alwaysShow: true,
                            threshold: Math.ceil(length / 2),
                            warningClass: "label label-info",
                            limitReachedClass: "label label-warning",
                            placement: 'bottom ',
                            preText: '已输入 ',
                            postText: ' 个字符',
                            separator: ' - '
                        });
                    }
                },
                template: ``
            };
        });
})();
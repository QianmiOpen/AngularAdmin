//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .directive('maxLength', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    let listener = attrs.$observe('maxLength', (n) => {
                        if(n && /^\d+$/g.test(n)){
                            let input = element.find('input');
                            if(!input.length){
                                input = element;
                            }
                            setTimeout(() => {
                                input.prop('maxlength', n).maxlength({
                                    alwaysShow: true,
                                    placement: 'bottom',
                                    preText: '已输入 ',
                                    postText: ' 个字符',
                                    separator: ' - '
                                });
                            }, 500);
                            listener();
                        }
                    });
                },
                template: ``
            };
        });
})();
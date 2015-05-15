//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiMenu', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element) {
                element.find(' li a').click(function (evt) {
                    var $a = $(evt.target);
                    $a.parent().parent().find('li').removeClass('active');
                    $a.parent().parent().find('.arrow').removeClass('open');

                    $a.parent().addClass('active');
                    $a.find('.arrow').addClass('open');
                });

                //
                var $a = element.find('a[href="' + window.location.hash + '"]');
                $a = $a.length > 0 ? $a : element.find('a[href="' + window.location.hash.replace(/\/[^\/]+$/, '') + '"]');
                $a.parents('li').each(function(i, li){
                    var $li = $(li);
                    $li.addClass('active');
                    $li.find(' > a .arrow').addClass('open');
                });
            },
            templateUrl: 'tpl.menu'
        };
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .directive('uiPortlet', function (componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: true,
            controller: function ($scope, $element, $attrs, $transclude) {
                var $content = $transclude($scope),
                    $toolbar = $content.filter('.portlet-tool-bar');
                if ($toolbar.length === 0) {
                    $.each($content, function (i, c) {
                        if (c.nodeName.indexOf('UI-PORTLET-ACTION') != -1) {
                            $toolbar = $(c);
                            return false;
                        }
                    });
                }
                $element.find('.portlet-body').append($content);
                if ($toolbar.length !== 0) {
                    $toolbar.insertAfter($element.find('.caption'));
                }

                componentHelper.tiggerComplete($scope, $attrs.ref || '$portlet', $scope);
            },
            template: function (el, attrs) {
                return componentHelper.getTemplate('tpl.portal.portlet', attrs);
            }
        };
    });




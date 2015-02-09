//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .controller('uiPortletContainerController', function ($scope, $attrs, $element) {
        $element.data('portlet', $scope.portlet).load($scope.portlet.url, function(){
            $scope.$emit('portletComplete');
        });
    });
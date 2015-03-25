/**
 *
 */
angular.module('admin.service')
    .factory('ValueService', function ($parse) {
        return {
            set: function (scope, express, value) {
                var getter = $parse(express);
                getter.assign(scope, value);
                if (!scope.$$phase) {
                    scope.$apply();
                }
            },

            get: function (scope, express) {
                var getter = $parse(express);
                return getter(scope);
            }
        };
    });

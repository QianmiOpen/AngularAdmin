/**
 *
 */
(function () {

    class ValueService {

        constrcutor($parse) {
            this.$parse = $parse;
        }

        set(scope, express, value) {
            var getter = this.$parse(express);
            getter.assign(scope, value);
            if (!scope.$$phase) {
                scope.$apply();
            }
        }

        get(scope, express) {
            var getter = this.$parse(express);
            return getter(scope);
        }
    }

    angular.module('admin.service')
        .service('ValueService', ValueService);
})();

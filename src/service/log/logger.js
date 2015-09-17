//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('Logger', function () {
        var c = window.console;
        return {
            debug: function (m) {
                if (c) {
                    c.debug ? c.debug(m) : c.log(m);
                }
            },
            info: function (m) {
                if (c) {
                    c.info ? c.info(m) : c.log(m);
                }
            },
            error: function (m) {
                if (c) {
                    c.error ? c.error(m) : c.log(m);
                }
            }
        };
    });
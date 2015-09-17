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
        class Logger {

            constructor(className) {
                this.className = className;
            }

            debug(m) {
                Logger.debug(`${this.className} : ${m}`);
            }

            info(m) {
                Logger.info(`${this.className} : ${m}`);
            }

            error(m) {
                Logger.error(`${this.className} : ${m}`);
            }

            static debug(m) {
                if (c) {
                    c.debug ? c.debug(m) : c.log(m);
                }
            }

            static info(m) {
                if (c) {
                    c.info ? c.info(m) : c.log(m);
                }
            }

            static error(m) {
                if (c) {
                    c.error ? c.error(m) : c.log(m);
                }
            }

        }

        return Logger;
    });
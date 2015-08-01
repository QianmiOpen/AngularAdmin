//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    class Logger {
        constructor(className) {
            this.className = className;
            this.console = window.console;
            this.isEnableDebug = location.hash.indexOf("debug") != -1;
        }

        debug(m) {
            m = `${this.className}: ${m}`;
            if (this.isEnableDebug && this.console) {
                this.console.debug ? this.console.debug(m) : this.console.log(m);
            }
        }

        info(m) {
            m = `${this.className}: ${m}`;
            this.console.info ? this.console.info(m) : this.console.log(m);
        }

        error(m) {
            m = `${this.className}: ${m}`;
            this.console.error ? this.console.error(m) : this.console.log(m);
        }
    }

    angular.module('admin.service')
        .service('logger', () => Logger)
        .service('Logger', () => Logger);
})();
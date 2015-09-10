//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    let defaultOpt = {
        'type': 'keydown',
        'propagate': false,
        'inputDisabled': false,
        'keyCode': false
    };

    let shift_nums = {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
    };
    let special_keys = {
        'esc': 27,
        'escape': 27,
        'tab': 9,
        'space': 32,
        'return': 13,
        'enter': 13,
        'backspace': 8,

        'scrolllock': 145,
        'scroll_lock': 145,
        'scroll': 145,
        'capslock': 20,
        'caps_lock': 20,
        'caps': 20,
        'numlock': 144,
        'num_lock': 144,
        'num': 144,

        'pause': 19,
        'break': 19,

        'insert': 45,
        'home': 36,
        'delete': 46,
        'end': 35,

        'pageup': 33,
        'page_up': 33,
        'pu': 33,

        'pagedown': 34,
        'page_down': 34,
        'pd': 34,

        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,

        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    };

    class Shortcut {
        constructor($window, $timeout) {
            this.window = $window;
            this.timeout = $timeout;
            this.keyboardEvent = {};
        }

        bind(label, callback, opt) {
            opt = $.extend({}, defaultOpt, opt);
            label = label.toLowerCase();
            var el = opt && opt.target ? opt.target : document;
            this.keyboardEvent[label] = {
                callback: this.handler,
                target: el,
                event: opt['type'],
                opt: opt
            };
            $(el).bind(opt.type, this.handler.bind(this, callback, label));
        }

        unbind(label) {
            label = label.toLowerCase();
            var binding = this.keyboardEvent[label];
            delete(this.keyboardEvent[label]);
            if (!binding)
                return;
            var type = binding['event'],
                elt = binding['target'],
                callback = binding['callback'];
            $(elt).unbind(type, callback);
        }

        handler(callback, label, evt) {
            let opt = this.keyboardEvent[label],
                code = evt.keyCode;

            //输入框不监听
            if (opt.inputDisabled) {
                let elt = evt.target;
                if (elt.tagName == 'INPUT' || elt.tagName == 'TEXTAREA') return;
            }

            //
            var character = String.fromCharCode(evt.keyCode).toLowerCase();
            if (code == 188)
                character = ",";
            if (code == 190)
                character = ".";

            //
            var keys = label.split("+");
            var kp = 0;

            //
            var modifiers = {
                shift: {
                    wanted: false,
                    pressed: evt.shiftKey ? true : false
                },
                ctrl: {
                    wanted: false,
                    pressed: evt.ctrlKey ? true : false
                },
                alt: {
                    wanted: false,
                    pressed: evt.altKey ? true : false
                },
                meta: {
                }
            };
            for (var i = 0, l = keys.length, k; k = keys[i], i < l; i++) {
                switch (k) {
                    case 'ctrl':
                    case 'control':
                        kp++;
                        modifiers.ctrl.wanted = true;
                        break;
                    case 'shift':
                    case 'alt':
                    case 'meta':
                        kp++;
                        modifiers[k].wanted = true;
                        break;
                }

                if (k.length > 1) {
                    if (special_keys[k] == code) kp++;
                } else if (opt['keyCode']) {
                    if (opt['keyCode'] == code) kp++;
                } else {
                    if (character == k) kp++;
                    else {
                        if (shift_nums[character] && e.shiftKey) {
                            character = shift_nums[character];
                            if (character == k) kp++;
                        }
                    }
                }
            }

            if (kp == keys.length &&
                modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                modifiers.shift.pressed == modifiers.shift.wanted &&
                modifiers.alt.pressed == modifiers.alt.wanted &&
                modifiers.meta.pressed == modifiers.meta.wanted) {
                setTimeout(function () {
                    callback(evt);
                }, 1);

                if (opt.propagation) {
                    evt.stopPropagation();
                }
            }

        }
    }


    var instance = new Shortcut();
    angular.module('admin.service')
        .factory('Shortcut', () => instance);
})();
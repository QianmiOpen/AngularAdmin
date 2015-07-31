//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('util', function ($rootScope, $compile, $filter, $parse, $q) {
        return {

            /**
             *
             * @param date
             * @param format
             * @returns {*}
             */
            dateFormatStr: function (date, format) {
                return $filter('date')(date || new Date(), format);
            },
            dateTimeStr: function (date) {
                return this.dateFormatStr(date, 'yyyy-MM-dd HH:mm:ss');
            },
            dateStr: function (date, format) {
                return this.dateFormatStr(date, 'yyyy-MM-dd');
            },
            timeStr: function (date, format) {
                return this.dateFormatStr(date, 'HH:mm:ss');
            },

            /**
             * 给元素加特效, 需要animate.css的支持
             * @param $el
             * @param animateCssName
             * @param isCompleteRemove
             */
            animate: function ($el, animateCssName, isCompleteRemove) {
                isCompleteRemove = isCompleteRemove !== undefined ? isCompleteRemove : true;
                $el.addClass(animateCssName + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    isCompleteRemove && $(this).removeClass(animateCssName + ' animated');
                });
            },

            /**
             * 设置组件的tag值
             * @param tagName
             * @param tagObj
             * @param $scope
             */
            setTag: function (tagName, tagObj, $scope) {
                $scope.$emit('ui.completeInit', tagName, tagObj);
            },

            /**
             * 给scope的属性设值, 支持表达式
             * @param scope
             * @param express
             * @param value
             */
            setValue: function (scope, express, value) {
                var m = express.split('.');
                if (m.length > 1) {
                    var t = m.splice(m.length - 1, m.length).join('');
                    var p = m.join('.');
                    var o = $parse(p)(scope);
                    o[t] = value;
                }
                else {
                    scope[express] = value;
                }
            },

            /**
             * 获取表达式的值
             * @param scope
             * @param exporess
             */
            getValue: function (scope, exporess) {
                return $parse(exporess)(scope);
            },

            /**
             * 针对非标准字符串转JSON
             * @param str
             */
            toJSON: function (str) {
                return JSON.parse(str);
            },

            /**
             * 根据提供的scope, 转换一个新的scope, 并且复值
             * @param others
             * @param parentScope
             * @returns ee
             */
            toScope: function (others, parentScope) {
                parentScope = parentScope || $rootScope;
                return $.extend(parentScope.$new(), others || {});
            },

            /**
             * 模板 + scope -> element
             * @param str
             * @param scope
             * @returns ee
             */
            format: function (str, scope) {
                var $e = $compile(str)(scope);
                return $e;
            },

            /**
             * 确认框
             * @param msg
             * @returns {promise}
             */
            confirm: function (msg) {
                if (bootbox) {
                    var def = $q.defer();
                    bootbox.confirm(msg, function (result) {
                        result ? def.resolve() : def.reject();
                    });
                    return def.promise;
                }
                else {
                    throw new Error('需要 bootbox库 支持, 请导入....');
                }
            },

            /**
             * 使用jquery validate验证json数据
             */
            checkValuesUseRules: function (jsonData, jsonRules) {
                var $form = $('<form></form>'),
                    $inputs = [];
                $.each(jsonData, function (name, val) {     //逐一创建input添加到form里面
                    var $input = $('<input>').attr('name', name).val(val);
                    $inputs.push($input);
                    $form.append($input);
                });
                var validator = $form.validate({rules: jsonRules, debug: true, submitHandler: function () {
                        return false;
                    }}),
                    errName = null,
                    errMsg = null;
                $.each($inputs, function (i, $input) {  //逐一验证, 只要发现错误, 直接跳出
                    if (!validator.check($input)) {
                        errName = $input.attr('name');
                        return false;
                    }
                });
                return errName ? validator.errorMap[errName] : null;
            },

            /**
             * 检测单个数据
             * @param name
             * @param value
             * @param rules
             * @returns {*}
             */
            checkValueUseRules: function(name, value, rules){
                var jsonData = {},
                    jsonRules = {};
                jsonData[name] = value;
                jsonRules[name] = rules;
                return this.checkValuesUseRules(jsonData, jsonRules);
            }
        };
    });
//------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------
angular.module('admin.service')
    .factory('uiEditableRegionFactory', function (msg, uiEditableCommonFactory, $compile, $rootScope) {
        var m = new msg('EditableRegion'),
            EditableRegion = function () {
                uiEditableCommonFactory.apply(this, arguments);
            };
        EditableRegion.prototype = $.extend({}, uiEditableCommonFactory.prototype, {

            /**
             *
             */
            beforeRender: function () {
                this.option.display = function (value, sourceData) {
                    var container = this.element.data('editableContainer');
                    if (container) {
                        var $form = container.$form.find('form');
                        var nvs = $form.serializeArray();
                        var province = "";
                        var city = "";
                        $.each(nvs, function (i, item) {
                            if (item['name'] == 'province') {
                                province = item['value'];
                            }
                            if (item['name'] == 'city') {
                                city = item['value'];
                            }
                        });
                    }
                }.bind(this);

                this.option.clear = false;
                this.option.params = function (params) {
                    var $form = this.element.data('editableContainer').$form.find('form'),
                        nvs = $form.serializeArray();
                    $.each(nvs, function (i, item) {
                        params[item['name']] = item['value'];
                    });
                    params.value = params[params.name];
                    return params;
                }.bind(this);

                this.option.validateChange = function () {
                    var $form = this.element.data('editableContainer').$form.find('form'),
                        nvs = $form.serializeArray();
                    var noChange = true;
                    $.each(nvs, function (i, item) {
                        if (item['name'] == this.option.name) {
                            noChange = this.option.value == item['value'];
                        }
                    });
                    return noChange;
                }.bind(this);
            },

            render: function($form){
                var angularDomEl = angular.element('<ui-search-region s-value="' + this.option.value + '" s-name="' + this.option.name + '" mode="text"></ui--search-region>'),
                    e = $compile(angularDomEl)($rootScope.$new(true));
                $form.find('.editable-input').html('').append(e);
            }
        });
        return function (element, attrs, option, other) {
            return new EditableRegion(element, attrs, option, other);
        };
    });
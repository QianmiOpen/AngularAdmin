(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.form', [
                '<form action="#" class="form-horizontal">',
                    '<div class="form-body">',
                    '</div>',
                '</form>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.input', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<input type="text" class="form-control" name="{{name}}" placeholder="{{placeholder}}"  {{#if value}}value="{{value}}"{{/if}} {{#if readonly}}readonly="{{readonly}}"{{/if}} {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.input.daterange', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<div class="input-date-range input-inline">',
                            '<div class="input-group">',
                                '<input type="text" class="form-control"  name="{{formName}}" {{#if formModel}}ng-model="{{formModel}}"{{/if}} {{#if formValue}}value="{{formValue}}"{{/if}} readonly>',
                                '<span class="input-group-addon">至</span>',
                                '<input type="text" class="form-control" name="{{toName}}" {{#if toModel}}ng-model="{{toModel}}"{{/if}} {{#if toValue}}value="{{toValue}}"{{/if}} readonly>',
                            '</div>',
                        '</div>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.select', [
                '<div class="form-group" {{#if isMulti}}is-multi="true"{{/if}}>',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                        '<select class="form-control" name="{{name}}" placeholder="{{placeholder}}" {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}} ng-transclude></select>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.item', [
                '<div class="form-group">',
                    '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                    '<div class="col-md-{{rightCol}}">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.region', [
                '<div class="form-group">',
                     '<label class="col-md-{{leftCol}} control-label">{{{label}}}</label>',
                     '<div class="col-md-{{rightCol}}">',
                        '<input type="hidden" {{#if model}}ng-value="{{model}}"{{/if}} {{#if sName}}name="{{sName}}"{{/if}}  {{#if value}}value="{{value}}"{{/if}}/>',
                        '<input type="text" class="input-small form-control input-inline" name="province"/>',
                        '<input type="text" class="input-small form-control input-inline" name="city"/>',
                        '<input type="text" class="input-small form-control input-inline" name="area"/>',
                        '<input type="text" class="input-xsmall form-control input-inline" {{#if aName}}name="{{aName}}"{{/if}}/>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));


            /**
             *
             */
            componentHelper.setTemplate('tpl.form.textarea', [
                '<div class="form-group">',
                    '<label class="control-label col-md-4">{{{label}}}</label>',
                    '<div class="col-md-8">',
                        '<textarea {{#if model}}ng-model="{{model}}"{{/if}} {{#if name}}name="{{name}}"{{/if}} class="form-control" ></textarea>',
                        '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.form.switch', [
                '<div class="form-group">',
                    '<label class="control-label col-md-4">{{{label}}}</label>',
                    '<div class="col-md-8">',
                         '<input type="checkbox" {{#if model}}ng-model="{{model}}"{{/if}} {{#if value}}value="{{value}}"{{/if}} {{#if name}}name="{{name}}"{{/if}} {{#if onText}}data-on-text="{{onText}}"{{/if}}  {{#if offText}}data-off-text="{{offText}}"{{/if}}/>',
                         '{{#if help}}<span class="help-block">{{help}}</span>{{/if}}',
                    '</div>',
                '</div>'
            ].join(''));
        });
})(jQuery);
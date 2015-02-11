(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform', [
                '<form novalidate action="" class="ui-search-form form-inline">',
                    '<div class="row">',
                        '<div class="col-md-{{leftCol}}" ng-transclude></div>',
                        '<div class="text-right col-md-{{rightCol}}">',
                            '<a title="回车键也可触发搜索" class="btn blue-chambray" ng-click="{{ref}}.search()"><i class="fa fa-search"></i></button>',
                            '<a title="重置搜索选项" class="btn default" ng-click="{{ref}}.reset()" style="width: 41px"><i class="fa fa-undo font-blue-chambray"></i></a>',
                        '</div>',
                    '</div>',
                '</form>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.input', [
                '<div class="input-inline search-item">',
                    '<div class="input-group">',
                        '{{#if label}}',
                            '<div class="input-group-addon">{{label}}:</div>',
                        '{{/if}}',
                        '<input class="form-control" name="{{name}}" placeholder="{{placeholder}}" {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.userselect.input', [
                '<div class="input-inline search-item">',
                    '<div class="input-group input-small">',
                        '{{#if label}}',
                            '<div class="input-group-addon">{{label}}:</div>',
                        '{{/if}}',
                        '<input class="form-control" name="{{name}}" placeholder="{{placeholder}}" {{#if model}}ng-model="{{model}}"{{/if}} {{#each other}}{{key}}="{{val}}"{{/each}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.daterange', [
                '<div class="input-inline search-item input-mlarge">',
                    '<div class="input-group">',
                        '<input type="text" readonly class="form-control" name="{{fromName}}" {{#if fromModel}}ng-model="{{fromModel}}"{{/if}}/>',
                        '<span class="input-group-addon">{{label}}</span>',
                        '<input type="text" readonly class="form-control" name="{{toName}}" {{#if toModel}}ng-model="{{toModel}}"{{/if}}/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.input.select', [
                '<div class="input-inline search-item">',
                    '<div class="input-group">',
                        '<select class="input-xsmall form-control " {{#if model}}ng-model="{{model}}"{{/if}} {{#if selectName}}name="{{selectName}}"{{/if}} ng-transclude></select>',
                        '<input style="left:-1px;" class="form-control input-small pull-right" {{#if inputName}}name="{{inputName}}"{{/if}} placeholder="{{placeholder}}" ng-keydown="onChangeHandler($event)"/>',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.region', [
                '<div class="input-inline search-item" auto-width="true">',
                    '<div class="input-group">',
                        '{{#if label}}<div class="input-group-addon">{{{label}}}:</div>{{/if}}',
                        '<input type="hidden" {{#if model}}ng-value="{{model}}"{{/if}} {{#if name}}name="{{name}}"{{/if}}  value="{{value}}"/>',
                        '<input type="text" class="input-small form-control" name="province" />',
                        '<input type="text" class="input-small form-control" name="city" />',
                        '<input type="text" class="input-small form-control" name="area" />',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.searchform.select', [
                '{{#if label}}',
                    '<div class="input-inline input-medium search-item" {{#if isMulti}}is-multi="true"{{/if}}>',
                        '<div class="input-group">',
                            '<div class="input-group-addon">{{label}}:</div>',
                            '<select class="form-control" name="{{name}}" {{#if model}}ng-model="{{model}}"{{/if}} ng-transclude {{#each other}}{{key}}="{{val}}"{{/each}}></select>',
                        '</div>',
                    '</div>',
                '{{else}}',
                    '<div class="input-small search-item input-inline" {{#if isMulti}}is-multi="true"{{/if}}>',
                        '<select name="{{name}}" class="form-control" {{#if model}}ng-model="{{model}}"{{/if}} ng-transclude {{#each other}}{{key}}="{{val}}"{{/each}}></select>',
                    '</div>',
                '{{/if}}'
            ].join(''));
        });
})(jQuery);
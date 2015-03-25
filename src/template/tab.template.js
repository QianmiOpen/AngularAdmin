(function ($) {
    angular.module('admin.template')
        .run(function(componentHelper){

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab', [
                '<div class="tabbable-custom{{#if close}} tabbable-close{{/if}}">',
                    '<ul class="nav nav-tabs" ng-transclude>',
                    '</ul>',
                    '<div class="tab-content" style="min-height: 100px;">',
                    '</div>',
                '</div>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab.item', [
                '<li>',
                    '<a href="javascript:;" ng-click="$tabItem.onClickHandler()" ><span>{{{head}}}</span><i class="fa fa-times" ng-click="$tabItem.onRemoveHandler($event)"></i></a>',
                '</li>'
            ].join(''));

            /**
             *
             */
            componentHelper.setTemplate('tpl.tab.list.item', [
                '<li class="dropdown">',
                    '<a href="#" class="dropdown-toggle" data-toggle="dropdown">{{head}} <i class="fa fa-angle-down"></i></a>',
                    '<ul class="dropdown-menu" role="menu" ng-transclude>',
                    '</ul>',
                '</li>'
            ].join(''));

        });
})(jQuery);
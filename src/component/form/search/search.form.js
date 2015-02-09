//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .directive('uiSearchForm', function (uiSearchFormFactory, componentHelper) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                //
                var ref = componentHelper.getComponentRef(element.parent().find('.ui-table'), '$table');


                //
                var searchForm = uiSearchFormFactory(scope, ref, element, attrs),
                    thisRef = attrs.ref || '$searchForm';
                scope[thisRef] = searchForm;
                componentHelper.tiggerComplete(scope, thisRef, searchForm);
            },
            template: function (element, attrs) {
                var col = attrs.column || "11:1",
                    ref = attrs.ref || '$searchForm';
                var cc = col.split(':');
                return componentHelper.getTemplate('tpl.searchform', {
                    leftCol: cc[0],
                    rightCol: cc[1],
                    ref: ref
                });
            }
        };
    });

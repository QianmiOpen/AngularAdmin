//------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------
angular.module('admin.component')
    .constant('uiTableProgressColumnTpl', [
        '<div style="border: 1px solid #57b5e3;" class="progress progress-striped active" role="progressbar"style="margin-bottom:0px;">',
        '<div class="progress-bar"></div>',
        '</div>'
    ].join(''))
    .directive('uiTableProgressColumn', function (uiTableColumnService, componentHelper, uiTableProgressColumnTpl, msg) {
        var m = new msg('TableProgressColumn');
        return {
            restrict: 'E',
            replace: true,
            controller: function ($scope, $element, $attrs) {

                //
                var ref = componentHelper.getComponentRef($element.parents('table').parent(), '$table'),
                    name = $attrs.name,
                    render = function (rowData) {
                        var val = rowData[name],
                            level = 'progress-bar-success';
                        val = val !== undefined ? val : 0;
                        if (val <= 25)
                            level = 'progress-bar-danger';
                        else if (val <= 50)
                            level = 'progress-bar-danger';
                        else if (val <= 75)
                            level = 'progress-bar-info';

                        var $d = $(uiTableProgressColumnTpl).attr('title', val + '%').find('div').addClass(level).animate({width: val + '%'}).end();
                        return $d;
                    };

                //
                if ($scope[ref] && $scope[ref].addColumn) {
                    $scope[ref].setColumn(uiTableColumnService(ref, $scope, $attrs, render), $attrs.index);
                }
                else {
                    m.error('uiTableProgressColumn必须放在uiTable里面');
                }
            },
            template: function (element, attrs) {
                return componentHelper.getTemplate('tpl.table.column', attrs);
            }
        };
    });
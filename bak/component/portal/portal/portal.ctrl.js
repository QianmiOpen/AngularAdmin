//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.component')
    .controller('uiPortalController', function ($scope, $attrs, $element, util, ajax, msg) {


        var m = new msg('Portal');


        //
        var hasCompleteSize = 0;
        $scope.$on('portletComplete', function (evt, portlet) {
            if (++hasCompleteSize >= portletSize) { //全部加载完毕, 开始走起
                var $originNext;
                $element.sortable({
                    connectWith: ".portlet-container",
                    items: ".portlet-container",
                    opacity: 0.8,
                    coneHelperSize: true,
                    placeholder: 'portlet-sortable-placeholder',
                    forcePlaceholderSize: true,
                    tolerance: "pointer",
                    helper: "clone",
                    cancel: ".portlet-sortable-empty, .portlet-fullscreen", // cancel dragging if portlet is in fullscreen mode
                    revert: 250, // animation in milliseconds
                    start: function(b, c){
                        $originNext = c.item.next().next(); //第一个next是他拖动后的虚拟狂
                    },
                    stop: function (b, c) {
                        var $item = c.item,
                            $newNext = $item.next(),
                            portlet = $item.data('portlet');
                        //
                        var i = $newNext ? $newNext.index() : null;
                        while($newNext.length > 0){
                            $newNext.data('portlet') && ($newNext.data('portlet').col = i++);
                            $newNext = $newNext.next();
                        }

                        //
                        var o = $originNext ? $originNext.index() : null;
                        while($originNext.length > 0){
                            $originNext.data('portlet') && ($originNext.data('portlet').col = o++);
                            $originNext = $newNext.next();
                        }

                        //
                        portlet.row = $item.parent().index();
                        portlet.col = $item.index();

                        $scope.storePortlets();

                        //放在最后面
                        $element.find('.portlet-sortable-empty').each(function(index, dom){
                            var $dom = $(dom);
                            $dom.appendTo($dom.parent());
                        });
                    }
                });
            }
        });


        $scope.storePortlets = function () {
            var cookieValue = {};
            $.each(portlets, function (index, portlet) {
                cookieValue[portlet.url] = {row: portlet.row, col: portlet.col};
            });
            $.cookie(cookieKey, JSON.stringify(cookieValue));
        };

        //
        var portletSize, portlets;
        var cookieKey = $attrs.store || 'portal';
        $scope.setPortlets = function (pp) {
            var cookieValue = util.toJSON($.cookie(cookieKey) || '{}'),
                remainPortlets = []; //未分配的portlet

            //
            hasCompleteSize = 0;
            portletSize = pp.length;
            portlets = pp;

            //
            $.each(portlets, function (index, portlet) {
                var cPortlet = cookieValue[portlet.url], //从cookie取用户自定义的
                    row = cPortlet ? cPortlet.row : portlet.row,
                    col = cPortlet ? cPortlet.col : portlet.col;
                if (row < $scope.columns.length) { //够放
                    $scope.setPortlet(row, col, portlet);
                }
                else { //不够放, 后面排队去
                    remainPortlets.push(portlet);
                }
            });

            //放剩余的
            $.each(remainPortlets, function (index, portlet) {
                $scope.setPortlet(index, portlet.col, portlet);
            });

            //
            $scope.resetColumns();

            //设置到cookie
            this.storePortlets();
        };
        $scope.setPortlet = function (row, col, portlet) {
            var columnSize = $scope.columns.length;
            row = row % columnSize;
            col = col;
            portlet.row = row;
            portlet.col = col;
            $scope.columns[row][col] = portlet;
        };

        $scope.resetColumns = function () {
            var r = [];
            for (var i = 0; i < $scope.columns.length; i++) {
                r.push([]);
            }
            $.each($scope.columns, function (row, columns) {
                $.each(columns, function(col, column){
                    if(column){
                        column.col = r[row].length;
                        r[row].push(column);
                        var p = r[row][col - 1];
                        p && (p.next = column); //设置下一个
                    }
                });
            });
            $scope.columns = r;
        };


        //计算多少列
        $scope.columns = [];
        var column = $attrs.column || 2;
        $scope.eachColumn = 12 / column;
        for (var i = 0; i < column; i++) {
            $scope.columns.push([]);
        }

        //
        if ($attrs.url) {
            ajax.get($attrs.url).then(function (responseData) {
                $scope.setPortlets(responseData);
            });
        }
        else {
            $scope.setPortlets([
                {url: '/static/portlet/portlet-1.jsp', row: 0, col: 0},
                {url: '/static/portlet/portlet-2.jsp', row: 0, col: 1},
                {url: '/static/portlet/portlet-3.jsp', row: 1, col: 0},
                {url: '/static/portlet/portlet-4.jsp', row: 1, col: 1},
                {url: '/static/portlet/portlet-5.jsp', row: 1, col: 2}
            ]);
            //m.error('必须设置url去获取portlet信息');
        }
    });
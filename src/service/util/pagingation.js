//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('PaginationFactory', function (Event, ajax) {
        var P = function (url, index, size, pageLimit, dataName, totalName) {
            this.url = url;
            this.pageIndex = parseInt(index || 0);
            this.pageSize = parseInt(size || 10);
            this.maxPage = 0;
            this.pageLimit = parseInt(pageLimit || 10);
            this.dataName = dataName || 'data';
            this.totalName = totalName || 'total';
            Event.call(this);
        };
        P.prototype = {

            /**
             *
             * @returns {*}
             */
            load: function () {
                var self = this;
                return ajax
                    .post(this.url, {pageIndex: this.pageIndex, pageSize: this.pageSize})
                    .then(function (r) {
                        return self.analyze(r);
                    });
            },

            /**
             *
             */
            analyze: function (r) {
                var total = r[this.totalName],
                    to, s, e, pageList = [];
                this.maxPage = Math.ceil(total / this.pageSize);
                to = this.maxPage - (this.pageIndex + this.pageLimit);
                if (to >= 0) { //够放
                    s = this.pageIndex;
                    e = s + this.pageLimit;
                }
                else { //不够放,往前移动
                    s = this.pageIndex - Math.abs(to);
                    s = s < 0 ? 0 : s;
                    e = this.pageIndex + (this.pageLimit - Math.abs(to));
                }
                //
                //if(s - 1 >= 0 && e != this.maxPage){
                //    s--;
                //    e--;
                //}

                //
                for(var i = s; i < e; i++){
                    pageList.push({
                        index: i + 1,
                        current: i == this.pageIndex
                    });
                }
                return $.extend(r, {
                    dataList: r[this.dataName],
                    pageList: pageList
                })
            },

            /**
             *
             * @returns {*}
             */
            prePage: function () {
                this.pageIndex--;
                this.pageIndex = this.pageIndex < 0 ? 0 : this.pageIndex;
                return this.getPage(this.pageIndex);
            },

            /**
             *
             */
            nextPage: function () {
                this.pageIndex++;
                this.pageIndex = this.pageIndex > this.maxPage ? this.maxPage : this.pageIndex++;
                return this.getPage(this.pageIndex);
            },

            /**
             *
             */
            firstPage: function () {
                return this.getPage(0);
            },

            /**
             *
             */
            lastPage: function () {
                return this.getPage(this.maxPage);
            },

            /**
             *
             * @param pageIndex
             */
            getPage: function (pageIndex) {
                this.pageIndex = pageIndex;
                return this.load();
            }
        };
        return P;
    });
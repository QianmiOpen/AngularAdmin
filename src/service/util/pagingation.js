//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
(function () {
    angular.module('admin.service')
        .factory('PaginationFactory', function (Event, Ajax) {

            class Pagination extends Event {
                constructor(url, index, size, pageLimit, dataName, totalName) {
                    this.url = url;
                    this.pageIndex = parseInt(index || 0);
                    this.pageSize = parseInt(size || 10);
                    this.maxPage = 0;
                    this.pageLimit = parseInt(pageLimit || 10);
                    this.dataName = dataName || 'data';
                    this.totalName = totalName || 'total';
                }

                load() {
                    var self = this;
                    return Ajax
                        .post(this.url, {pageIndex: this.pageIndex, pageSize: this.pageSize})
                        .then(function (r) {
                            return self.analyze(r);
                        });
                }

                analyze(r) {
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
                    for (var i = s; i < e; i++) {
                        pageList.push({
                            index: i + 1,
                            current: i == this.pageIndex
                        });
                    }
                    return $.extend(r, {
                        dataList: r[this.dataName],
                        pageList: pageList,
                        isFirst: this.pageIndex === 0,
                        isLast: this.pageIndex == this.maxPage - 1
                    });
                }

                prePage() {
                    this.pageIndex--;
                    this.pageIndex = this.pageIndex < 0 ? 0 : this.pageIndex;
                    return this.getPage(this.pageIndex);
                }

                nextPage() {
                    this.pageIndex++;
                    this.pageIndex = this.pageIndex > this.maxPage - 1 ? (this.maxPage - 1) : this.pageIndex;
                    return this.getPage(this.pageIndex);
                }

                firstPage() {
                    return this.getPage(0);
                }

                lastPage() {
                    return this.getPage(this.maxPage);
                }

                getPage(pageIndex) {
                    this.pageIndex = pageIndex;
                    return this.load();
                }
            };

            return Pagination;
        });
})();
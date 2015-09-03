//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('CascadeFactory', function (msg, Event) {
        var m = new msg('CascadeFactory'),
            T = {
                U: 'url',
                C: 'callback'
            },
            CascadeFactory = function(){
                this.levelList = [];
                Event.call(this);
            };
        CascadeFactory.prototype = {

            addUrl: function(url, paramName){
                return this.addUrlByIndex(-1, url, paramName);
            },

            addUrlByIndex: function(index, url, paramName){
                paramName = paramName || 'id';
                this.levelList.push({
                    url: url,
                    type: T.U,
                    paramName: paramName
                });
                return this;
            }
        };
        return CascadeFactory;
    });
//-----------------------------------------------------------------------------------------------
//
//
//
//
//
//-----------------------------------------------------------------------------------------------
angular.module('admin.service')
    .factory('NService', function ($q) {
        var P = {

            send(title, body){
                let defer = $q.defer();
                //已经允许过了
                if(Notification.permission === 'granted'){
                    defer.resolve(P._send(title, body));
                }
                //等待允许
                else if (Notification.permission == 'default') {
                    Notification.requestPermission(() => {
                       P.send(title, body);
                    });
                }
                return defer.promise;
            },

            _send(title, body){
                return new Notification(title, {body: body});
            }
        };
        return P;
    });
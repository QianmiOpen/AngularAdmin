//-----------公共方法---------------------
$(document).ready(function () {
    $.ajaxSetup({cache: false});
});
toastr.options = {
    "closeButton": true,
    "debug": false,
    "positionClass": "toast-top-center",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
$(document).ajaxSuccess(function () {
    $('[id="querybut"]').show();
});

/*
 *** 简化的ajax *****
 */
function ofajax(options) {
    var defaults = {
        type: "post",
        dataType: "json",
        timeout: 60000,
        url: options.data.url
    };
    options = $.extend(defaults, options);
    $.ajax(options);
}
/*
 *** 简化的 formajax *****
 */
$.fn.ofajaxForm = function (options) {
    var defaults = {
        url: "",
        type: "post",
        dataType: "json",
        timeout: 60000,
        beforeSend: function () {
            $('[id="querybut"]').hide();
        }
    };
    options = $.extend(defaults, options);
    return $(this).ajaxForm(options);
};

/**
 * 弹窗
 * 弹出新窗口
 * 调用说明：
 * 	  openwindow(url,width,height,params,callback)
 * 	  注意。前3个参数的顺序不变，第1个参数如果为字符串类型就认为是url,
 * 						第2个参数如果是数字类型就是宽度,
 *                      第3个参数如果是数字就是高度,
 *                      参数类型为function的会自动认为是回调
 *                      参数类型为object则认为是扩展参数
 * 扩展参数说明：
 *    url:url地址,string(如果调用时第1参数指定url,扩展参数也指定url，第一参数有效)
 *    width:窗体宽度，默认500像素,数字(同上，第2参数有效,不支持百分比和"auto")
 * 	  height:窗体高度，默认500像素,数字(同上，第3参数有效,不支持百分比和"auto")
 *    left/top:距屏幕左/上距离,数字(不支持百分比和"auto")
 *    resizable:是否可调整大小,默认true/"yes" boolean|"yes/no"
 *    menubar:是否显示菜单栏,只针对非模式化窗体,默认false/"no" boolean|"yes/no"
 *    location:是否显示地址栏,只针对非模式化窗体,默认true/"yes" boolean|"yes/no"
 *    status:是否显示状态栏,默认true/"yes" boolean|"yes/no"
 *    scrollbars:是否支持滚动条,默认true/"yes" boolean|"yes/no"
 *    titlebar:是否显示标题栏,只针对非模式化窗体,默认true/"yes" boolean|"yes/no"
 *    toolbar:是否显示工具栏,只针对非模式化窗体,默认true/"yes" boolean|"yes/no"
 *    singleton:是否启用单例,如果启用,则多次调用该方法生成的窗体只能生成一个(只针对非模式化窗体)
 *    position:窗体位置,默认"center",string(启用会导致top，left无效) "auto/center"
 *    autosize:自动调整大小,默认false,只对非模式化窗体有效(启用会导致width和height无效) boolean
 *    fullscreen:全屏,默认false(启用会导致width和height无效) boolean
 *    modal:是否使用模式化窗体 boolean
 *    onload:窗体加载执行函数,默认为空函数(只对非模式化窗体有效) 函数执行域为新window,参数为opener
 *    onunload:窗体卸载前执行函数,默认为空函数,函数执行域为opener,模式化窗体参数为returnvalue,非模式化窗体参数为即将关闭的window(参数指定比扩展参数中的指定函数优先级高)
 *    dialogArguments:默认为undefined,模式化窗体传递参数
 */
(function(w) {
    var wins = [];
    var length = 0;
    var OFWindow = function(arguments){
        length++;
        var default_params = {
            url:'',
            width:'500',
            height:'500',
            left:'0',
            top:'0',
            resizable:'yes',
            menubar:'no',
            location:'yes',
            status:'yes',
            scrollbars:'yes',
            titlebar:'yes',
            toolbar:'yes',
            singleton:false,
            position:'center',
            autosize:false,
            fullscreen:false,
            modal:false,
            modalstyle:'raise',
            onload:function(){},
            onunload:function(){}
        };

        var opt = {};
        for (var i = 0; i < arguments.length; i++) {
            if(i==0 && typeof arguments[i] == "string"){
                opt.url = arguments[i];
            }
            if(i==1 && !isNaN(arguments[i]+'') ){
                opt.width = arguments[i];
            }
            if(i==2 && !isNaN(arguments[i]+'') ){
                opt.height = arguments[i];
            }
            if(typeof arguments[i] == "object"){
                opt = $.extend(true,{},default_params,arguments[i],opt);
                break;
            }
            if(typeof arguments[i] == "function"){
                opt.onunload = arguments[i];
            }
        }
        opt = $.extend(true,{},default_params,opt);
        var params = [];
        var width = isNaN(opt.width+'')?default_params.width:opt.width;
        var height = isNaN(opt.height+'')?default_params.height:opt.height;
        var left = isNaN(opt.left+'')?default_params.left:opt.left;
        var top = isNaN(opt.top+'')?default_params.left:opt.top;
        if(opt.modal){
        	if(opt.fullscreen){
        		width = w.screen.availWidth;
        		height = w.screen.availHeight;
        	}
        	params.push("dialogWidth:" + width+"px");
            params.push("dialogHeight:" + height +"px");
            if(opt.position != "center"){
	            params.push("dialogLeft:" + left);
	            params.push("dialogTop:" +  top);
            }
            params.push("scroll:" + ((opt.scrollbars == true || opt.scrollbars == "yes")?"yes":"no"));
            if(opt.position != "center"){
            	params.push("center:no");
            }
            params.push("resizable:" + ((opt.resizable == true || opt.resizable == "yes")?"yes":"no"));
	        params.push("status:" + ((opt.status == true || opt.status == "yes")?"yes":"no"));
        }else{
	        if(opt.position == "center"){
	        	left = Math.floor((screen.width - width)/2);
	        	top = Math.floor((screen.height - height)/2);
	        }
	        !opt.fullscreen&&params.push("width=" + width);
	        !opt.fullscreen&&params.push("height=" + height);
	        !opt.fullscreen&&params.push("left=" + left);
	        !opt.fullscreen&&params.push("top=" +  top);
	        params.push("fullscreen=" + ((opt.fullscreen == true || opt.fullscreen == "yes")?"yes":"no"));
	        params.push("menubar=" + ((opt.menubar == true || opt.menubar == "yes")?"yes":"no"));
	        params.push("location=" + ((opt.location == true || opt.location == "yes")?"yes":"no"));
	        params.push("scrollbars=" + ((opt.scrollbars == true || opt.scrollbars == "yes")?"yes":"no"));
	        params.push("resizable=" + ((opt.resizable == true || opt.resizable == "yes")?"yes":"no"));
	        params.push("status=" + ((opt.status == true || opt.status == "yes")?"yes":"no"));
	        params.push("titlebar=" + ((opt.titlebar == true || opt.titlebar == "yes")?"yes":"no"));
	        params.push("toolbar=" + ((opt.toolbar == true || opt.toolbar == "yes")?"yes":"no"));
        }
        
        var paramstr = params.join(opt.modal?';':',');

        if(opt.singleton && length > 1){
            length--;
            return;
        }
       
        if(opt.modal){
        	alert(paramstr)
        	var returnvalue = this.win = window.showModalDialog(opt.url, (opt.dialogArguments||''), paramstr);
        	opt.onunload&&opt.onunload.apply(w,[returnvalue]);
        	length--;
        }else{
        	var curWindow = this.win = window.open(opt.url, '', paramstr);
            function addEvent(eventName,element,fn){
                if (element.attachEvent) element.attachEvent("on"+eventName,fn);
                else element.addEventListener(eventName,fn,false);
            }
            addEvent("load",curWindow,function(){
                addEvent("unload",curWindow,function(){
                    for ( var i = 0; i < wins.length; i++) {
                        if(wins[i] == curWindow){
                            wins.splice(i,1);
                            length--;
                            break;
                        }
                    }
                    opt.onunload&&opt.onunload.apply(w,[curWindow]);

                });
                if(opt.fullscreen){
                	curWindow.resizeTo(curWindow.screen.availWidth,curWindow.screen.availHeight);
                }
                if(opt.autosize && !opt.fullscreen){
                    /*curWindow.innerWidth = curWindow.document.documentElement.scrollWidth;
                    curWindow.innerHeight = curWindow.document.documentElement.scrollHeight;*/
                	var divWidth = curWindow.outerWidth - curWindow.innerWidth;  	
                	var divHeight = curWindow.outerHeight - curWindow.innerHeight;
                	curWindow.resizeTo((curWindow.document.documentElement.scrollWidth+divWidth),(curWindow.document.documentElement.scrollHeight+divHeight));
                }
                if(opt.position=="center"){
                	curWindow.moveTo(Math.floor((screen.width-curWindow.outerWidth)/2),Math.floor((screen.height-curWindow.outerHeight)/2));
                }
                opt.onload.apply(curWindow,[w]);
            });
            wins.push(this.win);
        }
    };

    w.openWindow = function(){
        return new OFWindow(arguments).win;
    };

    w.onunload = function(){
        //for ( var i = 0; i < length; i++) {
        //    wins[i].close();
        //}
    };

})(this);

// 统一处理ajax异常回调
$(function() {
    $(document).ajaxComplete(function(event, request, setting) {
        if(setting.dataType != 'html'){
            if (499 == request.status){
                var resp = request.responseText;
                toastr.error('会话过期，请重新登录！');
                setTimeout(function(){window.location = '/login';},2000);
            }else if (403 == request.status) {
                toastr.error("对不起，您没有权限！");
            } else if (/^5\d{2}$/g.test(request.status+"")) {
                toastr.error("服务器异常");
            } else if (404 == request.status) {
                toastr.error("您访问的资源不存在");
            } else if (408 == request.status) {
                toastr.error("网络超时，请检查您的网络，稍后重试。");
            } else if (400 == request.status) {
                toastr.error("无效的请求");
            } else if (/^4\d{2}$/g.test(request.status)) {
                toastr.error("请求发生错误，请检查您的网络，稍后重试。");
            }
        }
    });
});

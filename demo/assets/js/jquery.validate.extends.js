// 身份证号码验证
jQuery.validator.addMethod("cardno", function(value, element) {
	return this.optional(element) || isIdCardNo(value);
}, "身份证号码不正确");
// 手机号码验证  
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	var tel = /^((1)+\d{10})$/;
	return this.optional(element) || (length == 11 && tel.test(value));
}, "手机号码不正确");
// 电话号码验证   
jQuery.validator.addMethod("phone", function(value, element) {
	 var tel = /^((\d{10,11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
  	 return this.optional(element) || (tel.test(value));    
}, "电话号码不正确");
// 邮编
jQuery.validator.addMethod("zipcode", function(value, element) {
	var zip=/^[0-9]{6}$/;  
	return this.optional(element) || zip.test(value);
}, "邮编不正确");
// 中文
jQuery.validator.addMethod("chinese", function(value, element) {
	var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  
	return this.optional(element) || reg.test(value);
}, "请输入中文字符");
jQuery.validator.addMethod("chineseAndEnglish", function(value, element) {
    var reg =/^[\u4e00-\u9fa5\uF900-\uFA2D_a-zA-Z0-9]+$/;
        return this.optional(element) || reg.test(value);
}, "请输入中英文字符，数字或下划线");
jQuery.validator.addMethod("keywords", function(value, element) {
    var reg =/^([a-zA-Z0-9\u4e00-\u9fa5\uF900-\uFA2D]+\,)*[a-zA-Z0-9\u4e00-\u9fa5\uF900-\uFA2D]+$/;
	if(value){
		value = value.replace(/，/g,",");
		var str = value.split(",");
		for(var i=0;i<str.length;i++){
			for(var j=i+1;j<str.length;j++){
				if(str[i]==str[j]){
					return false;
				}
			}
		}
	}
    return this.optional(element) || reg.test(value);
}, "请输入正确的格式并确保关键字不重复");
jQuery.validator.addMethod("optionValue", function(value, element,params) {
    	var sep = params.seperator||",";
		var maxlength = params.maxlength||-1;
		var minlength =(params.minlength&&params.minlength>0)?params.minlength:1;
		var limit = params.limit||-1;
		var str = sep;
    	if(/^[\$\^\|\\\?\.\-\*\$]$/g.test(str)){
    		str = "\\"+str;
    	}
		value = str == ","?value.replace(/，/g,","):value;
  		var regex = new RegExp("^([^"+str+"\f\n\r\t\v<>&\"'\\\\]"+("{"+minlength+","+ (maxlength<0||maxlength<=minlength?"":maxlength) +"}")+str+")*[^"+ str +"\f\n\r\t\v<>&\"'\\\\]"+("{"+minlength+","+ (maxlength<0||maxlength<=minlength?"":maxlength) +"}")+"$","g");
		return this.optional(element)||(regex.test(value)&&(limit < 0 || value.split(sep).length <= limit)&&(function(strs){
  			for(var i=0;i<strs.length;i++){
  				for(var j=i+1;j<strs.length;j++){
  					if(strs[i]==strs[j]){
  						return false;
  					}
  				}
  			}
			return true;
		})(value.split(sep)));
    }, "请输入正确的选项格式并确保选项值不重复"); 

// qq号码
jQuery.validator.addMethod("qq", function(value, element) {
	var reg = /([1-9][0-9]{4,})|([\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?)/;  
	return this.optional(element) || reg.test(value);
}, "QQ号码不正确");
//三位小数
jQuery.validator.addMethod("num3point", function(value, element) {
		var num=/^[0-9]+(\.[0-9]{1,3})?$/;
	    return this.optional(element) || num.test(value);
	}, "最多三位小数!");
jQuery.validator.addMethod("accuracy", function(value, element,param) {
		param = parseInt(param);
		if(isNaN(param)){
			param = "";
		}
		var num= new RegExp("^[0-9]+(\\.[0-9]{1,"+param+"})?$");
	    return this.optional(element) || num.test(value);
	}, "小数位数不正确!");	
// 密码组合
jQuery.validator.addMethod("pwdmix",function(value, element){
	var reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
	return this.optional(element) || reg.test(value);
},"密码必须是字符与数字的混合！");
// 密码组合
jQuery.validator.addMethod("greatthan",function(value, element,params){
	return this.optional(element) || parseFloat(value) > params;
},"大于0");
//验证身份证号码
function isIdCardNo(num) {
	var len = num.length, re;
	if (len == 15)
		re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
	else if (len == 18)
		re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
	else {
		return false;
	}
	var a = num.match(re);
	if (a != null) {
		if (len == 15) {
			var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		} else {
			var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
			var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4]
					&& D.getDate() == a[5];
		}
		if (!B) {
			return false;
		}
	}
	return true;
}
//商品编号
jQuery.validator.addMethod("goodsid",function(value, element){
	var reg = /^([\w-]){1,20}$/;
	return this.optional(element) || reg.test(value);
},"商品编号为字母和数字组合，且长度最多为20！");
//非法字符
jQuery.validator.addMethod("forbidchar",function(value, element){
	var reg = /[&\\<>'"]/;
	return this.optional(element) || !reg.test(value);
},"输入项包含非法字符，请重新输入！");
jQuery.validator.addMethod("pattern",function(value, element,params){
	try{
		var reg = new RegExp(params);
		return this.optional(element) || reg.test(value);
	}catch(e){
		return false;
	}
},"输入项不合法！");
// 验证值必须大于等于指定的值
jQuery.validator.addMethod("notlessthan", function(value, element, param) {
	var target = $(param).unbind(".validate-notlessthan").bind("blur.validate-notlessthan", function() {
		$(element).valid();
	});
	return value >= target.val();
},"输入值与验证值不符合大小逻辑关系，请重新输入！");
jQuery.validator.addMethod("remotion", function(value, element,param) {
	param = $.extend(true,{},param);
	$.each(param.data,function(k,v){
		if(typeof v == "function"){
			param.data[k] = v();
		}
	});
	var result = false;
    $.ajax($.extend(true,param,{async:false,type:"post",datatype:"json"})).done(function(res){
    	var response = res;
    	if(typeof res == "string"){
    		response=JSON.parse(res);
    	}
    	result = param.valid(response,this);
    });
    return this.optional(element) || result;
}, "修正字段");

(function ($) {
	$.extend($.validator.messages, {
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: $.validator.format("请输入一个最大为 {0} 的值"),
		min: $.validator.format("请输入一个最小为 {0} 的值")
	});
}(jQuery));
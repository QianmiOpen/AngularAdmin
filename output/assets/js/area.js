var pId;
var cId;
var aId;
function loadAreaInfo(p, c, a){
    pId = p;
    cId = c;
    aId = a;
    $.get('/area/provinceList', function(json){
    	var obj =JSON.parse(json);
        if(obj.result == 'ok'){
            var provinceId = '';
            var provinList = '<option value="">请选择</option>';
            var selectValue = undefined;
            $.each(obj.data.arealist,function(k,v){
                if(v.provcode == pId){
                    provinceId = v.provcode;
                    selectValue = v.prov;
                    provinList += '<option value="'+ v.prov +'" class="'+ v.provcode +'" selected="selected">'+ v.prov +'</option>';
                }else{
                    provinList += '<option value="'+ v.prov +'" class="'+ v.provcode +'">'+ v.prov +'</option>';
                }
            });
            $("#province").html('');
            $("#province").append(provinList);
            
            $("#province").select2('val', selectValue);
            
            $("#province").bind('change',function(){
                $("#regionid").val('');
                $("#city").html('<option value="">请选择</option>');
                $("#city").select2('val', '');
                $("#area").html('<option value="">请选择</option>');
                $("#area").select2('val', '');
                loadCity();
            });
            $("#city").bind('change',function(){
                $("#regionid").val('');
                $("#area").html('<option value="">请选择</option>');
                $("#area").select2('val', '');
                loadArea();
            });
            $("#area").bind('change',function(){
                var regionid=$(this).find("option:selected").attr("title");
                $("#regionid").val(regionid);
            });
            if(provinceId != ''){//加载默认
                loadCity(provinceId);
            }
        }else{
            alert(obj.msg);
        }
    });
}
//加载城市信息
function loadCity(provinceId){
    if(!provinceId){
        var provinceId = $("#province option:selected").attr("class");
    }
    if(provinceId && provinceId != ''){
        $.get('/area/cityList/' + provinceId, function(json){
        	var obj =JSON.parse(json);
            if(obj.result == 'ok'){
                var cityId = '';
                var cityList = '<option value="">请选择</option>';
                var selectValue = undefined;
                $.each(obj.data.arealist,function(k,v){
                    if(v.citycode == cId){
                        cityId = v.citycode;
                        selectValue = v.city;
                        cityList += '<option value="'+ v.city +'" class="'+ v.citycode +'" selected="selected">'+ v.city +'</option>';
                    }else{
                        cityList += '<option value="'+ v.city +'" class="'+ v.citycode +'">'+ v.city +'</option>';
                    }
                });
                $("#city").html('');
                $("#city").append(cityList);

                if(cityId != ''){
                    loadArea(cityId);
                }
                
                $("#city").select2('val', selectValue)
            }else{
                alert(obj.msg);
            }
        });
    }
}
//加载区/县信息
function loadArea(cityId){
    if(!cityId){
        var cityId = $("#city option:selected").attr("class");
    }
    if(cityId && cityId != ''){
        $.get('/area/areaList/' + cityId, function(json){
        	var obj =JSON.parse(json);
            if(obj.result == 'ok'){
                var areaList = '<option value="">请选择</option>';
                var selectValue = undefined;
                $.each(obj.data.arealist,function(k,v){
                    if(v.areacode == aId){
                        $("#regionid").val(v.regionid);
                        selectValue = v.area;
                        areaList += '<option value="'+ v.area +'" class="'+v.areacode+'" title="'+ v.regionid +'" selected="selected">'+ v.area +'</option>';
                    }else{
                        areaList += '<option value="'+ v.area +'" class="'+v.areacode+'" title="'+ v.regionid +'">'+ v.area +'</option>';
                    }
                });
                $("#area").html('');
                $("#area").append(areaList);
                
                $("#area").select2('val', selectValue)
            }else{
                alert(obj.msg);
            }
        });
    }else{
        var areaList = '<option value="">请选择</option>';
        $("#area").html('');
        $("#area").append(areaList);
    }
}
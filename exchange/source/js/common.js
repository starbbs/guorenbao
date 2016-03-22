require(['api_mkt','cookie'], function(api_mkt) {
    var popup_login_times = 0;
    var exchangeToken = $.cookie('exchangeToken');
    console.log(exchangeToken);
    $("#bg").width($(document).width());
    $('#bg').height($(document).height());
    $('#floor_bg').css('left', 0);
    $('#floor_bg').css('top', 0);
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);




    /**
     * 输入字段校验
     * [verify description]
     * @param  {[String]} inputData [输入数据]
     * @param  {[String]} dataType  [数据类型]
     * @return {[boolean or String]}[验证结果]
     */
    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };
    if (!exchangeToken) {
    	$(".login_regist").show();
    } else {
    	$(".login_regist").hide();
        $(".login_header").show();
        var global_loginuserphone = $.cookie("global_loginuserphone");
	    var global_loginusername = $.cookie("global_loginusername");
	    console.log("-------------"+global_loginuserphone);
	    console.log("-------------"+global_loginusername);
	    if(global_loginusername!=""&&global_loginusername){
	    	$("#logined_username").html(global_loginusername);
	    } else {
	    	$("#logined_username").html(global_loginuserphone);
	    }
        $(".popDiv").hide();
        $(".bg").hide();
    }
    //右上角登录按钮点击之后出发的事件
    $(".popup_login_btn").on("click", function() {
        popup_login_times++;
        var phone = $(".phone").val();
        var password = $(".password").val();
        var flag = verify(phone, "tel");
        console.log(flag);
        if(flag=="请输入正确的手机号码"){
        	$(".error_tips").show().html("请输入正确的手机号码");
        	return;
        }
        if(password==""){
        	$(".error_tips").show().html("请输入密码");
        	return;
        } else if(password.length>12||password.length<6){
        	$(".error_tips").show().html("请输入6~12位密码");
        	return;
        }
        if(flag==true&&password!=""&&password.length>=6&&password.length<12){
        	$(".error_tips").hide();
        	api_mkt.login({
	            phone: phone,
	            password: password
	        }, function(data) {
	            if (data.status == 200) {
	                $.cookie('exchangeToken', 'logined');
	                console.log(data.msg);
	                $(".login_regist").hide();
	                $(".login_header").show();
	                $(".popDiv").hide();
	                $(".bg").hide();
	                //data.data.phone;  data.data.name
	                global_loginuserphone = data.data.phone;
	                global_loginusername = data.data.username;
	                console.log(global_loginuserphone);
	                console.log(global_loginusername);
	                $.cookie("global_loginuserphone",global_loginuserphone);
	                $.cookie("global_loginusername",global_loginusername);
	                $("#logined_username").html(data.data.phone);
	            } else if (data.status == 305) {
	                alert(data.msg);
	            } else {
	            	$(".error_tips").show().html(data.msg);
	            }
	        });
        }
        if (popup_login_times > 3) {
            $("#authcode").show();
            $(".popup_login_btn").css("top", "250px");
            $(".bottom_div").css("top", "284px");
        } else {
            $(".popup_login_btn").css("top", "190px");
            $(".bottom_div").css("top", "226px");
        }
    });
    $(".global_loginbtn").on('click', function() {
        $(".popDiv").show();
        $(".bg").show();
    });
    $(".close_btn").on("click",function(){
    	$(".popDiv").hide();
        $(".bg").hide();
    });
    $("#logoutbtn").on("click", function() {
        console.log("xuletian");
    	$.cookie('exchangeToken','');
    	console.log("haha");
    	console.log($.cookie('exchangeToken'));
        location.reload(true);

        //退出登录
        api_mkt.userlogout({
        }, function(data) {
            if (data.status == 200) {
                alert(data.msg);
            } else if (data.status == 305) {
                alert(data.msg);
            } else {
            	//$(".error_tips").show().html(data.msg);
            }
        });
    });
});

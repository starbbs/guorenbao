require(['api_mkt', 'cookie'], function(api_mkt) {
    var exchangeToken = $.cookie('exchangeToken');
    var global_loginuserphone = $.cookie("global_loginuserphone");
	var checkFlag1=false;//校验通过标志
	var checkFlag2=false;//校验通过标志
	var checkFlag3=false;//校验通过标志
    if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else { //已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        // api_mkt.userbasic(function(data){
        //     $("#who_account").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
        // });
        $("#who_account").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
    }

    /**
     * 禁止输入框粘贴
     */
    $("input").on("paste",function(e){
		return false;
	});
    
    /**
     * 输入框通用校验
     */
    $("input").on("keydown",function(e){
		//只允许输入 ASCII的33~126的字符
		var keycode = e.which; 
		if(keycode!=8 && keycode!=9 &&keycode!=16 &&keycode!=20 && (keycode<33 || keycode>126)){
			return false;
		}
	});
    
    $(".currentPwd").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		if($(this).val().indexOf(" ")>=0 || $(this).val().length>20||$(this).val().length<6 || reg.test($(this).val()) || hanzi.test($(this).val())){
            $("#one_span").show().html("原密码错误");
            checkFlag1 = false;
        }else{
        	$("#one_span").show().html("");
        	checkFlag1 = true;
        }
    });
    $(".newPwd").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		if($(this).val().indexOf(" ")>=0 || $(this).val().length>20||$(this).val().length<6 || reg.test($(this).val()) || hanzi.test($(this).val())){
            $("#two_span").show().html("请输入6~20位非纯数字字符");
            checkFlag2 = false;
        }else{
        	$("#two_span").show().html("");
        	checkFlag2 = true;
        }
    });
    $(".confirmNewPwd").on("blur", function() {
		if($(this).val()!=$(".newPwd").val()){
        	$("#three_span").show().html("两次密码输入不一致");
        	checkFlag3 = false;
        }else{
        	$("#three_span").show().html("");
        	checkFlag3 = true;
        }
    });

    $(".next_step_btn").on("click", function() {
        if (checkFlag1 && checkFlag2 && checkFlag3) {
            api_mkt.loginpassword({
                currentPwd: $("#currentPwd").val(),
                newPwd: $("#newPwd").val(),
                confirmNewPwd: $("#confirmNewPwd").val()
            }, function(data) {
                if (data.status == 200) {
                    $(".reset_login_password_step_1").hide();
                    $(".reset_login_password_step_2").show();

                    $(".correct").show();
                    $(".rg_lf_label").hide();
                    $(".rg_rg_input").hide();
                    toIndex();
                } else if (data.status == 305) {
                    alert(data.msg);
                } else if (data.status == 400) {
                    if (data.msg == "原密码错误") {
                        $("#one_span").show().html(data.msg);
                    } else if (data.msg == "密码长度错误") {
                        $("#three_span").show().html(data.msg);
                    }
                } else {
                    $("#three_span").show().html(data.msg);
                }
            });
        }else{
        	$('.currentPwd').focus();
    		$('.currentPwd').blur();
    		
    		$('.newPwd').focus();
    		$('.newPwd').blur();
    		
    		$('.confirmNewPwd').focus();
    		$('.confirmNewPwd').blur();
        }


    });
  
    function toIndex() {
        var count = 3;
        var timer = setInterval(function() {
            count--;
            if (count > 0) {
                $("#howmanysecond").text(count);
            } else {
                clearInterval(timer);
                location.href = "./index.html";
            }
        }, 1000);
    }

});

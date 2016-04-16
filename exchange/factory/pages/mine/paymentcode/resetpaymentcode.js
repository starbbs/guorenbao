require(['api_mkt', 'cookie'], function(api_mkt) {
    var exchangeToken = $.cookie('exchangeToken');
    var global_loginuserphone = $.cookie("global_loginuserphone");
	var checkFlag1=false;//校验通过标志
	var checkFlag2=false;//校验通过标志
	var checkFlag3=false;//校验通过标志
	var checkFlag4=false;//校验通过标志
    if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else { //已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        $("#who_account").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
    }

    $(".logoimg").on("click",function(){
        location.href="./index.html";
    });
    var whether_sub_one = false;
    $("#idNumber").on("blur", function() {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if(!reg.test($(this).val())){
            $(".one_span1").show().html("身份信息有误，请重新输入");
            checkFlag1 = false;
            return;
        } else {
            $(".one_span1").hide().html("");
            checkFlag1 = true;
        }
    });
    $("#identifyingCode").on("blur", function() {
        if ($(this).val() == "") {
            $(".one_span2").show().html("验证码不能为空");
            checkFlag2 = false;
            return;
        } else {
            $(".one_span2").hide().html("");
            checkFlag2 = true;
        }
    });

    $(".next_step_btn_one").on("click", function() {
    	//
        if (checkFlag1 && checkFlag2) {
            api_mkt.resetpaypwdbefore({
                idNumber: $("#idNumber").val(),
                identifyingCode: $("#identifyingCode").val()
            }, function(data) {
                if (data.status == 200) {
                    $(".rg_lf_label").hide();
                    $(".two_rg_lf_label").show();
                    $(".rg_rg_input").hide();
                    $(".two_rg_rg_input").show();
                } else if (data.status == 305) {
                    alert(data.msg);
                } else if (data.status == 400) {
                    if (data.msg == "验证码错误") {
                        $(".one_span2").show().html(data.msg);
                    } else if(data.msg=="未实名认证"){
                        $(".one_span2").show().html(data.msg);
                    } else if(data.msg=="身份证号输入错误"){
                        $(".one_span1").show().html("身份信息有误，请重新输入");
                    }else{
                    	$(".one_span2").show().html(data.msg);
                    }
                } else {
                    $(".one_span2").show().html(data.msg);
                }
            });
        }else{
        	$('#idNumber').focus();
    		$('#idNumber').blur();
    		
    		$('#identifyingCode').focus();
    		$('#identifyingCode').blur();
        }
    });

    /**
     * 禁止输入框粘贴
     */
    $("#password").on("paste",function(e){
		return false;
	});
    
    $("#password").on("keydown",function(e){
		var keycode = e.which; 
		if(keycode!=8 && keycode!=9 &&keycode!=16 &&keycode!=20 && (keycode<33 || keycode>126)){
			return false;
		}
    });
    
    $("#password").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		var pwd=$(this).val();
		if(pwd.indexOf(" ")>=0 || pwd.length<8 || pwd.length>20 || reg.test(pwd) || hanzi.test(pwd)){
			$(".tow_span1").show().html("请输入 8~20位非纯数字字符");
			checkFlag3 = false;
            return;
		}else if ($(this).val() == "") {
            $(".tow_span1").show().html("支付密码不能为空");
            checkFlag3 = false;
            return;
        } else {
            $(".tow_span1").hide().html("");
            checkFlag3 = true;
        }
    });
    
    $("#confirmPwd").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		var pwd=$(this).val();
		if ($(this).val() != $("#password").val()) {
            $(".tow_span2").show().html("两次密码输入不一致");
            checkFlag4 = false;
            return;
        }else {
            $(".tow_span2").hide().html("");
            checkFlag4 = true;
        }
    });
    $(".next_step_btn_two").on("click", function() {
        if (checkFlag3 && checkFlag4) {
            api_mkt.resetPayPwd({
                password: $("#password").val(),
                confirmPwd: $("#confirmPwd").val(),
                idNumber: $("#idNumber").val(),
                identifyingCode: $("#identifyingCode").val()
            }, function(data) {
                if (data.status == 200) {
                    $(".correct").show();
                    $(".rg_lf_label").hide();
                    $(".two_rg_lf_label").hide();
                    $(".rg_rg_input").hide();
                    $(".two_rg_rg_input").hide();
                    toIndex();
                } else if (data.status == 305) {
                    alert(data.msg);
                } else if (data.status == 400) {
                    if (data.msg == "验证码错误") {
                        $(".one_span2").show().html(data.msg);
                    } else if (data.msg == "支付密码长度错误") {
                        $(".tow_span1").show().html(data.msg);
                    } else if (data.msg=="验证码错误,请重新发送验证码") {
                        $(".one_span2").show().html("验证码错误,请重新发送验证码");
                    }else {
                    	$(".one_span2").show().html(data.msg);
                    }
                } else {
                    $(".one_span2").show().html(data.msg);
                }
            });
        }else{
        	$('#password').focus();
    		$('#password').blur();
    		
    		$('#confirmPwd').focus();
    		$('#confirmPwd').blur();
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
                location.href = "./basicinfo.html";
            }
        }, 1000);
    }


    //获取短信验证码
    $('.getauthcode_one').click(function() {
        // if (whether_sub_one == false) {
        //     $(".one_span1").show().html("身份证号码不能为空");
        // } else {
            api_mkt.sendCodeByLoginAfter(function(data) {
                if (data.status == 200) {
                	$(".one_span2").show().html("");
                    console.log(data);
                    //60秒内只能发送一次
                    var count = 60;
                    var resend = setInterval(function() {
                        count--;
                        if (count > 0) {
                            $('.getauthcode_one').html(count + 's后重新发送');                           
                            $('.getauthcode_one').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
                        } else {
                            clearInterval(resend);
                            $('.getauthcode_one').attr('disabled',false).css({'cursor':'pointer','backgroundColor':'#0bbeee','color':'#fff'}).text('获取短信验证码');
                        }
                    }, 1000);
                } else if (data.status == 400) {
                    console.log(data.msg);
                    $(".one_span2").show().html(data.msg);
                } else if (data.status == 444) {
                    $(".one_span2").show().html(data.msg);

                }
            });
        // }
    });
});

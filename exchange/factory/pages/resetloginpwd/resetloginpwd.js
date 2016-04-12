require(['api_mkt', 'cookie'], function(api_mkt) {
    var exchangeToken = $.cookie('exchangeToken');
    var global_loginuserphone = $.cookie("global_loginuserphone");
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

    $("#phone").on("blur", function() {
        if ($(this).val() == "") {
            $("#error_one").show().html("手机号不能为空");
            mobileflag = false;
            return;
        } else {
            var phone = $("#phone").val();
            var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(phone) || !phone) {
                $('#error_one').show().text('请输入正确的手机号码');
                mobileflag = false;
            } else {
                $('#error_one').hide();
                mobileflag = true;
            }
        }
    });
    $("#identifyingCode").on("blur", function() {
        if ($(this).val() == "") {
            $("#error_two").show().html("验证码不能为空");
            return;
        } else {
            $("#error_two").hide().html("");
        }
    });
    $("#newPwd").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		var pwd=$(this).val();
		if(pwd.indexOf(" ")>0 || pwd.length<6 || pwd.length>20 || reg.test(pwd) || hanzi.test(pwd)){
			 $("#error_three").show().html("请输入6~20位非纯数字字符");
	         return;
		}
        if ($(this).val() == "") {
            $("#error_three").show().html("登录密码不能为空");
            return;
        } else {
            $("#error_three").hide().html("");
        }
    });
    $("#confirmNewPwd").on("blur", function() {
    	var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		var pwd=$(this).val();
		if(pwd.indexOf(" ")>0 || pwd.length<6 || pwd.length>20 || reg.test(pwd) || hanzi.test(pwd)){
			 $("#error_four").show().html("请输入6~20位非纯数字字符");
	         return;
		}
        if ($(this).val() == "") {
            $("#error_four").show().html("确认密码不能为空");
            return;
        }
        if ($(this).val() !== "" && $(this).val() !== $("#newPwd").val()) {
            $("#error_four").show().html("两次密码不相同");
            return;
        } else {
            $("#error_four").hide().html("");
        }
    });

    var whether_sub = true;

    var mobileflag = false;
    $(".next_step_btn").on("click", function() {
        whether_sub = true;
        $("#error_one,#error_two,#error_three,#error_four").hide().html("");
        if ($("#phone").val() == "") {
            $("#error_one").show().html("手机号不能为空");
            whether_sub = false;
            mobileflag = false;
        } else {
            var phone = $("#phone").val();
            var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(phone) || !phone) {
                $('#error_one').show().text('请输入正确的手机号码');
                whether_sub = false;
                mobileflag = false;
            } else {
                $('#error_one').hide();
                mobileflag = true;
            }
        }
        if ($("#identifyingCode").val() == "") {
            $("#error_two").show().html("验证码不能为空");
            whether_sub = false;
        }
        if ($("#newPwd").val() == "") {
            $("#error_three").show().html("登录密码不能为空");
            whether_sub = false;
        }
        if ($("#confirmNewPwd").val() == "") {
            $("#error_four").show().html("确认密码不能为空");
            whether_sub = false;
        }
        if ($("#newPwd").val() !== $("#confirmNewPwd").val()) {
            $("#error_four").show().html("两次密码不相同");
            whether_sub = false;
            return;
        }
        if (whether_sub) {
            api_mkt.resetLoginPwd({
                phone: $("#phone").val(),
                identifyingCode: $("#identifyingCode").val(),
                newPwd: $("#newPwd").val(),
                confirmNewPwd: $("#confirmNewPwd").val()
            }, function(data) {
                if (data.status == 200) {
                    //alert("重置登录密码成功");
                    $(".rg_lf_label").hide();
                    $(".rg_rg_input").hide();
                    $(".correct").show();
                    toIndex();
                    // setTimeout(function() {
                    //     location.href = "./index.html";
                    // }, 1000);
                } else if (data.status == 305) {
                    alert(data.msg);
                } else if (data.status == 400) {
                    if (data.msg == "验证码错误") {
                        $("#error_four").show().html(data.msg);
                    } else if (data.msg == "密码长度错误") {
                        $("#error_four").show().html(data.msg);
                    } else if (data.msg == "原支付密码输入错误") {
                        $("#error_one").show().html(data.msg);
                    } else if (data.msg == "支付密码必须为数字") {
                        $("#error_four").show().html(data.msg);
                    } else if (data.msg == "支付密码长度错误") {
                        $("#error_four").show().html(data.msg);
                    }
                } else {
                    $("#error_four").show().html(data.msg);
                }
            });
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

    //获取短信验证码
    $('.getauthcode').click(function() {
        if (mobileflag == false) {
            $("#error_two").show().html("请检查手机号是否输入正确");
        } else {
            api_mkt.sendCode({ "phone": $("#phone").val() }, function(data) {
                if (data.status == 200) {
                    console.log(data);
                    //30秒内只能发送一次
                    var count = 60;
                    var resend = setInterval(function() {
                        count--;
                        if (count > 0) {
                            $('.getauthcode').html(count + 's后重新发送');
                            $('.getauthcode').attr('disabled', true).css('cursor', 'not-allowed').css('background-color', '#cccccc');
                        } else {
                            clearInterval(resend);
                            $('.getauthcode').attr('disabled', false).css('cursor', 'pointer').css('background-color', '#0bbeee').html('获取验证码');
                        }
                    }, 1000);
                } else {

                }
            });
        }
    });
});

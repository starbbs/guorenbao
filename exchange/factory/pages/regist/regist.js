require(['api_mkt','cookie'], function(apimkt) {
	
	/*陈 - 添加 start*/   
	//表单校验
	$(".msg").hide();		
	//给所有regist_rg_input类+blur
	$(".regist_rg_input").blur(function(){
		//手机号
		if ($(this).is(".checkPhone")){
			var phone = $.trim($(this).val());
			var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
			if(!reg.test(phone)){
				$('.msg-phone').show();
			}else{
				$('.msg-phone').hide();
			}
		}
		//验证码
		if ($(this).is(".checkCode")){
			if(!$(this).val()){
				$('.msg-code').show();
			}else{
				$('.msg-code').hide();
			}
		}
		//登录密码
		if ($(this).is(".checkpwd")){
			var pwd = $.trim($(this).val());
			var reg = /^[0-9a-zA-Z]{6,12}$/;
			if(!reg.exec(pwd)){
				$('.msg-pwd').show().text('密码格式：6~12位非纯数字字符');
			}else{
				$('.msg-pwd').hide();
			}
		}
		//确认登录密码
		if ($(this).is(".checkConfirmPwd")){
			var pwd = $.trim($(".checkpwd").val());
			var ConfirmPwd = $(this).val();
			if(pwd !== ConfirmPwd){
				$('.msg-ConfirmPwd').show().text('确认密码与登录密码不一致');
			}else{
				$('.msg-ConfirmPwd').hide();
			}
		}
		//复选框
		if ($(this).is(".regular-checkbox")){
			$(".regular-checkbox").attr("checked","true");
			if($(this).attr("checked")==false){
				$(".regular-checkbox").attr("checked","true");
			}else{
				return false;
			}
		}
		//下一步--支付密码
		if ($(this).is(".payPwd")){
			var payPwd = $.trim($(".payPwd").val());
			var reg = /^[0-9a-zA-Z]{8,20}$/;
			if(!reg.test(payPwd)){
				$('.msg-payPwd').show().text('密码设置不符合规则');
			}else{
				$('.msg-payPwd').hide();
			}
		}
		//确认支付密码
		if ($(this).is(".payConfirmPwd")){
			var payConfirmPwd = $.trim($(".payConfirmPwd").val());
			var payPwd = $(".payPwd").val();
			if(payConfirmPwd !== payPwd){
				$('.msg-payConfirmPwd').show().text('两次输入不一致');
			}else{
				$('.msg-payConfirmPwd').hide();
			}
		}
		//实名认证 姓名
		if ($(this).is(".personName")){
			var personName = $.trim($(".personName").val());
			if(!personName){
				$('.msg-personName').show();
			}else{payPwd
				$('.msg-personName').hide();
			}
		}
		//实名认证 身份证号
		if ($(this).is(".personId")){
			var personId = $.trim($(".personId").val());
			if(!personId){
				$('.msg-personId').show();
			}else{payPwd
				$('.msg-personId').hide();
			}
		}
	});

	//下一步按钮 one two three
	$(".oneStep").click(function(){
		$(".two").css('display','flex')
		$(".one").css('display','none');
	});
	$(".twoStep").click(function(){
		$(".three").css('display','flex')
		$(".two").css('display','none');
	});
	$(".threeStep").click(function(){
		$(".four").css('display','flex')
		$(".three").css('display','none');
	});

	
	//测试
    $('.next_step_sure').click(function(){

    	$.ajax({
            type: "POST",
            dataType: "json",
            url: "http://172.16.33.3:8080/login/login",
            data: JSON.stringify({
                'phone':$('.regist-username').val(), 
		   		'identifyingCode':$('.regist-idcard').val(),
		   		'password':$('.regist-pwd').val(),
		   		'confirmPwd':$('.regist-confirmPwd').val()	
            }),
            cache: false,
            success: function(data) {
                if (data.msg == "true") {

                } else {
                    
                }
            },
            error: function() {
                console.log("提交失败");
            }
        });


    	/*apimkt.registerLogin({			
	   		'phone':$('.regist-username').val(), 
	   		'identifyingCode':$('.regist-idcard').val(),
	   		'password':$('.regist-pwd').val(),
	   		'confirmPwd':$('.regist-confirmPwd').val()		   
		}, function(data) {
			if (data.status == 200) {
				console.log(data.name);
			} else {
				//console.log(data);
			}
		});

    	apimkt.registerLogin(function(data) {
        	registerLoginFn(data);
    	});*/

    });
     
    /*陈 - 添加  end*/

	
	/*
	if ($.cookie('gopToken')) {			// 有token
		api.getGopNum({
			gopToken: $.cookie('gopToken')
		}, function(data) {
			if (data.status == 200) { 	// token有效
				gotoHome();
			} else { 					// token无效
				$.cookie('gopToken', null);
				gotoAuthorization();
			}
		});
	} else { // 没有token
		if (get.data.code) { 			// 已授权
			api.wxlogin({
				code: get.data.code
			}, function(data) {
				if (data.status == 200) {
					if (data.data.gopToken) { // 已绑定
						$.cookie('gopToken', data.data.gopToken); // 果仁账户token
						gotoHome();
					} else { // 未绑定
						$.cookie('openId', data.data.openid); // 微信id
						selectVM.userNick = viewLogin.vm.userNick = data.data.nick;
						selectVM.userImage = viewLogin.vm.userImage = data.data.img;
						gotoSelect();
					}
				} else {
					$.alert(data.msg);
				}
			});
		} else { // 未授权
			gotoAuthorization();
		}
	}
	*/
	//apimkt
});
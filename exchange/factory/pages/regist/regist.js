require(['api_mkt','cookie'], function(api_mkt) {
	
	/*陈 - 添加 start*/   
	//表单校验
	$(".msg").hide();			
	//给所有regist_rg_input类+blur
	$(".regist_rg_input").blur(function(){
		//手机号
		if ($(this).is(".checkPhone")){
			var phone = $.trim($(this).val());
			var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
			if(!reg.test(phone) || !phone){
				$('.msg-phone').show().text('请输入正确的手机号');;
				$('.checkCode-send').val('获取验证码');			
			}else{
				$('.msg-phone').hide();
				//接口1-获取验证码
				$('.checkCode-send').click(function(){
				    api_mkt.sendCode({			
				   		'phone':$('.checkPhone').val()	   
					}, function(data) {
						if (data.status !== 200) {
							console.log(data.phone);
							$('.checkCode-send').attr('disabled',true).css('cursor','not-allowed');
						} else {
							
						}
					});
				  	
			    	//60秒后重新发送
			    	var count = 60;
			    	var resend = setInterval(function(){
				    		count--;
				    		if(count > 0){
				    			$('.checkCode-send').val(count+'s后重新发送');
				    			$('.checkCode-send').attr('disabled',true).css('cursor','not-allowed');
				    		}else{
				    			clearInterval(resend);
				    			$('.checkCode-send').attr('disabled',false).css('cursor','pointer').val('获取验证码');
				    		}
				    	},1000); 
				});
			}
		}
		//验证码
		if ($(this).is(".checkCode")){
			if(!$(this).val()){
				$('.msg-code').show().text('请输入正确的验证码');
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
			//$(".regular-checkbox").attr("checked","true");
			if($(this).attr("checked") == false){
				$('.oneStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
			}else{
				$('.oneStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
			}
		}
		//下一步--支付密码
		if ($(this).is(".payPwd")){
			var payPwd = $.trim($(".payPwd").val());
			var reg = /^[0-9a-zA-Z]{8,20}$/;
			if(!reg.test(payPwd)){
				$('.msg-payPwd').show().text('8~20位非纯数字字符');
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
				$('.msg-personName').show().text('请输入正确的姓名');
			}else{payPwd
				$('.msg-personName').hide();
			}
		}
		//实名认证 身份证号
		if ($(this).is(".personId")){
			var personId = $.trim($(".personId").val());
			if(!personId){
				$('.msg-personId').show().text('请输入正确的身份证号');
			}else{payPwd
				$('.msg-personId').hide();
			}
		}
	});

	//测试
	//接口2 注册第一步 手机号注册 
    $('.oneStep').click(function(){
    	api_mkt.registerBefore({			
	   		'phone':$('.checkPhone').val(), 
	   		'identifyingCode':$('.checkCode').val(),
	   		'password':$('.checkpwd').val(),
	   		'confirmPwd':$('.checkConfirmPwd').val()	   
		}, function(data) {
			console.log(data);
            if (data.msg == "手机号码已经注册") {
            	$('.msg-phone').show().html('手机号已注册，请<a class="markasread" href="index.html">直接登录</a>');
            }else if(data.status == 200){
                $(".two").css('display','flex');
				$(".one").css('display','none');                 
            }else{
            	$('.oneStep').css('backgroundColor','#eee'); 
            }
		});

    });

	//接口3 注册第二步 设置支付密码 
	$('.twoStep').click(function(){
		api_mkt.identifyingCode({			
	   		'phone':$('.checkPhone').val(), 
	   		'identifyingCode':$('.checkCode').val(),
	   		'password':$('.checkpwd').val(),
	   		'confirmPwd':$('.checkConfirmPwd').val(),
	   		'payPwd':$('.payPwd').val(),
	   		'comfirmPayPwd':$('.payConfirmPwd').val()	   
		}, function(data) {
			if (data.status == 200) {
				console.log(data.status);
				//设置支付密码 点击-进入 实名验证
				$(".three").css('display','flex')
				$(".two").css('display','none');				
			}else{
            	$('.twoStep').css('backgroundColor','#eee');
            	console.log(data.status);
            }
		});

    });
	//接口4 注册第三步 设置实名验证
	$('.threeStep').click(function(){		
		api_mkt.realNameAuth({			
	   		'realName':$('.personName').val(),
		   	'idNumber':$('.personId').val()	   
		}, function(data) {
			if (data.status == 200) {
				console.log(data);
				//进入注册完成页
				$(".four").css('display','flex');
				$(".three").css('display','none');
				//进入注册完成页，3秒后跳转首页
				var count = 3;
				var timer = setInterval(function(){
					count--;
					if(count > 0){
						$(".toIndex").text(count+'s后自动跳转进入首页');
					}else{
						clearInterval(timer);
						location.href="http://localhost/exchange/build/index.html";
					}
				},1000);
			} else {
				console.log(data.status);
				$('.threeStep').css('backgroundColor','#eee');
			}
		});
		
    });

    //跳过实名验证
    $('.SkipThreeStep').click(function(){
    	$(".four").css('display','flex');
		$(".three").css('display','none');
    })
  	/*陈 - 添加  end*/

});
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

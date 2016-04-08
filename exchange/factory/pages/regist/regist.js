require(['api_mkt','cookie'], function(api_mkt) {
	var btnConfirm = false; 		
	//表单校验password
	$('.checkPhone, .checkCode-send, .checkpwd, .checkConfirmPwd, .payPwd, .payConfirmPwd, .personName, .personId').focus(function(){
		$(this).val('');
	});
	$(".checkPhone").keyup(function(){
        $(this).val($(this).val().replace(/[^0-9$]/g,''));
    });
	$(".checkPhone").blur(function(){
		var phone = $.trim($(this).val());
		var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
		if(!reg.test(phone)){
			$('.msg-phone').show().text('请输入正确的手机号');	
			btnConfirm = false;	
		}else{
			$('.msg-phone').hide();
			btnConfirm = true;
		}
	});

	$(".logoimg").on("click",function(){
        location.href="./index.html";
    });

	//验证码
	/*$(".checkCode").blur(function(){			
		if(!$(this).val()){
			$('.msg-code').text('请输入正确的验证码');
		}else{
			$('.msg-code').text('');
		}
	});*/
	//获取验证码
	$('.checkCode-send').click(function(){
		if(btnConfirm == false){
			$('.msg-phone').show().text('请输入您的手机号');
			$('.checkCode-send').css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
		}else{
			$('.msg-phone').hide();
			$('.checkCode-send').css({'cursor':'pointer','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
		    api_mkt.sendCode({			
		   		'phone':$('.checkPhone').val()	   
			}, function(data) {
				if (data.status !== 200) {
					//60秒后重新发送
			    	var count = 60;
			    	var resend = setInterval(function(){
				    		count--;
				    		if(count > 0){
				    			$('.checkCode-send').val(count+'s后重新发送');
				    			$('.checkCode-send').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
				    		}else{
				    			clearInterval(resend);
				    			$('.checkCode-send').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
				    		}
				    	},1000); 
				} else {
					
				}
			});
	    }
	});
	
	//登录密码
	$(".checkpwd").blur(function(){			
		var pwd = $(this).val();
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		if(!reg.test(pwd)){
			btnConfirm = false;
			$('.msg-pwd').text('密码格式：6~12位非纯数字字符');
		}else{
			$('.msg-pwd').text('');
			btnConfirm = true;
		}
	});

	//确认登录密码
	$(".checkConfirmPwd").blur(function(){	
		var pwd = $.trim($(".checkpwd").val());
		var ConfirmPwd = $(this).val();
		if(pwd !== ConfirmPwd){
			$('.msg-ConfirmPwd').show().text('两次输入不一致');
		}else{
			$('.msg-ConfirmPwd').hide();
		}
	});

	//复选框   
	$(".regular-checkbox").click(function(){
		if($(".regular-checkbox").is(':checked')){
			btnConfirm = true;
			$('.oneStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
		}else{
			btnConfirm = false;
			$('.oneStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
		}	
	});
	//注册第一步 手机号注册 
    $('.oneStep').bind('click',function(){
    	if(btnConfirm == false){
    		alert('请完善填写信息！');
    	}else{
    		api_mkt.registerBefore({			
		   		'phone':$('.checkPhone').val(), 
		   		'identifyingCode':$('.checkCode').val(),
		   		'password':$('.checkpwd').val(),
		   		'confirmPwd':$('.checkConfirmPwd').val()	   
			}, function(data) {
	            if (data.msg == "手机号码已经注册") {
	            	$('.msg-phone').show().html('手机号已注册，请<a class="markasread" href="index.html">直接登录，3秒后跳转到首页</a>');
	            	$('.oneStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
	            	$('.oneStep').unbind('click');
	            	toIndex();
	            }else if(data.status == 200){
	                $(".two").css('display','flex');
					$(".one").css('display','none');                
	            }else{
	            	
	            }
			});
    	}   	

    });
    //下一步--支付密码
	$(".payPwd").blur(function(){
		var payPwd = $.trim($(".payPwd").val());
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		if(!reg.test(payPwd)){
			btnConfirm = false;
			$('.msg-payPwd').show().text('8~20位非纯数字字符');
		}else{
			btnConfirm = true;
			$('.msg-payPwd').hide();
		}
	});

	//确认支付密码
	$('.payConfirmPwd').blur(function(){
		var payConfirmPwd = $.trim($('.payConfirmPwd').val());
		var payPwd = $(".payPwd").val();
		if(payConfirmPwd !== payPwd){
			$('.msg-payConfirmPwd').show().text('两次输入不一致');
			btnConfirm = false;
			$('.twoStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
		}else{
			$('.msg-payConfirmPwd').hide();
			btnConfirm = true;
			$('.twoStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
		}
	});

	//接口3 注册第二步 设置支付密码 
	$('.twoStep').click(function(){
		if(btnConfirm == false){
			alert('输入支付密码格式不正确');
		}else{
			api_mkt.register({			
		   		'phone':$('.checkPhone').val(), 
		   		'identifyingCode':$('.checkCode').val(),
		   		'password':$('.checkpwd').val(),
		   		'confirmPwd':$('.checkConfirmPwd').val(),
		   		'payPwd':$('.payPwd').val(),
		   		'comfirmPayPwd':$('.payConfirmPwd').val()	   
			}, function(data) {
				if (data.status == 200) {
					$('.twoStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
					$(".three").css('display','flex');
					$(".two").css('display','none');			
				}else{
	            	$('.twoStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
	            	alert('输入支付密码格式不正确');
	            }
			});
		}	

    });
    //实名认证 姓名
	$(".personName").blur(function(){
		var personName = $.trim($(".personName").val());
		if(!personName){
			btnConfirm = false;
			$('.msg-personName').show().text('请输入正确的姓名');
		}else{
			$('.msg-personName').hide();
			btnConfirm = true;
		}
	});
	//实名认证 身份证号
	$(".personId").blur(function(){
		var personId = $.trim($(".personId").val());
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   		if(!reg.test(personId)){
			btnConfirm = false;
			$('.msg-personId').show().text('请输入正确的身份证号');
		}else {
			$('.msg-personId').hide();
			btnConfirm = true;
		}
	});
	//接口4 注册第三步 设置实名验证
	$('.threeStep').click(function(){
		if(btnConfirm == false){
			alert('您填写的姓名或身份证号不正确，请重新输入。');
		}else{
			api_mkt.realNameAuth({			
		   		'realName':$('.personName').val(),
			   	'idNumber':$('.personId').val()	   
			}, function(data) {
				if (data.status == 200) {
					//进入注册完成页
					$(".four").css('display','flex');
					$(".three").css('display','none');
					$('.threeStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
					// api_mkt.login({
			  //           phone: phone,
			  //           password: password,
		   //              code:authcode_common
			  //       }, function(data) {
			  //           if (data.status == 200) {
			                
			  //           } else if (data.status == 305) {
			  //               alert(data.msg);
			  //           } else if (data.status==400) {
		   //                  $(".autocode_tips").show().html(data.msg);
		   //              } else {
			  //           	$(".error_tips").show().html(data.msg);
			  //           }
			  //       });
					toIndex();
				} else if(data.status == 400){
					$('.threeStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
					alert('您填写的姓名或身份证号不正确，请重新输入。');
				}
			});
		}
    });

    //跳过实名验证
    $('.SkipThreeStep').click(function(){
    	$(".four").css('display','flex');
		$(".three").css('display','none');
		toIndex();		
    })
    function toIndex(){
			var count = 3;
				var timer = setInterval(function(){
				count--;
				if(count > 0){
					$(".toIndex").text(count+'s后自动跳转进入首页');
				}else{
					clearInterval(timer);
					window.location.href="index.html";
				}
			},1000);		
	}

});

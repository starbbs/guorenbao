require(['api_mkt','cookie'], function(api_mkt) {
	 		
	//表单校验password
	$('.checkPhone, .checkCode-send, .checkpwd, .checkConfirmPwd, .payPwd, .payConfirmPwd, .personName, .personId').focus(function(){
		$(this).val('');
	});
	$(".checkPhone").keyup(function(){
        $(this).val($(this).val().replace(/[^0-9$]/g,''));
    });
	//验证手机号
    var btnPhone = false;
	$(".checkPhone").blur(function(){
		var phone = $.trim($(this).val());
		var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
		if(!reg.test(phone)){
			$('.msg-phone').show().text('请输入正确的手机号');	
			btnPhone = false;	
		}else{
			$('.msg-phone').hide();
			btnPhone = true;
		}
	});

	$(".logoimg").on("click",function(){
        location.href="./index.html";
    });

	//验证码
	var btnCode = false;
	$(".checkCode").blur(function(){
		var pwd = $(this).val();			
		if(!pwd || isNaN(pwd) || pwd.length !== 6){
			$('.msg-code').text('请输入正确的验证码');
			btnCode = false;
		}else{
			$('.msg-code').text('');
			btnCode = true;
		}
	});
	$(".checkCode").focus(function(){
		$(this).val('');
	});
	//获取验证码
	$('.checkCode-send').click(function(){
		if(btnPhone == false){
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
	var btnPwd = false;
	$(".checkpwd").blur(function(){			
		var pwd = $(this).val();
		//var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		if(pwd.indexOf(" ")>0 || pwd.length<6 || pwd.length>20 || reg.test(pwd) || hanzi.test(pwd)){
			btnPwd = false;
			$('.msg-pwd').text('密码格式：6~20位非纯数字字符');
		}else{
			$('.msg-pwd').text('');
			btnPwd = true;
		}
	});

	//确认登录密码
	var btnConfirmPwd = false;
	$(".checkConfirmPwd").blur(function(){	
		var pwd = $.trim($(".checkpwd").val());
		var ConfirmPwd = $(this).val();
		if(pwd !== ConfirmPwd){
			btnConfirmPwd = false;
			$('.msg-ConfirmPwd').show().text('两次输入不一致');
		}else{
			$('.msg-ConfirmPwd').hide();
			btnConfirmPwd = true;
		}
	});

	//复选框 
	var btnCheckBox = true;  
	$(".regular-checkbox").click(function(){
		if($(".regular-checkbox").is(':checked')){
			btnCheckBox = true;
			$('.msg-checked').hide();
		}else{
			btnCheckBox = false;
			$('.msg-checked').show().text('请阅读且接受服务条款').css('color','red');
		}	
	});
	//注册第一步 手机号注册 
    $('.oneStep').bind('click',function(){
    	if(btnPhone == false){
    		$('.msg-phone').show().text('请输入正确的手机号');
    	}else if(btnCode == false){
    		$('.msg-code').text('请输入正确的验证码');
    	}else if(btnPwd == false){
    		$('.msg-pwd').text('密码格式：6~20位非纯数字字符');
    	}else if(btnConfirmPwd == false){
    		$('.msg-ConfirmPwd').show().text('两次输入不一致');
    	}else if(btnCheckBox == false){
    		$('.msg-checked').text('请阅读且接受服务条款').css('color','red');
    	}else{
    		api_mkt.registerBefore({			
		   		'phone':$('.checkPhone').val(), 
		   		'identifyingCode':$('.checkCode').val(),
		   		'password':$('.checkpwd').val(),
		   		'confirmPwd':$('.checkConfirmPwd').val()	   
			}, function(data) {
	            if (data.msg == '手机号码已经注册') {
	            	$('.msg-phone').show().html('手机号已注册，请<a class="markasread" href="index.html">直接登录，3秒后跳转到首页</a>');
	            	$('.oneStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
	            	$('.oneStep').unbind('click');
	            	toIndex();
	            	$('.msg-code').text('');
	            }else if(data.status == 200){
	                $(".two").css('display','flex');
					$(".one").css('display','none'); 
	            	$('.msg-code').text('');               
	            }else if(data.msg == '验证码错误'){
	            	//alert('您输入的验证码有误，请重新输入！');
	            	$('.msg-code').text('请输入正确的验证码');
	            }
			});
    	}   	

    });
    //下一步--支付密码
    var btnPayPwd = false;
	$('.payPwd').blur(function(){
		var payPwd = $.trim($(".payPwd").val());
		//var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		var reg = new RegExp("^[0-9]*$");//纯数字
		var hanzi = /[\u4e00-\u9fa5]/;//汉字
		if(payPwd.indexOf(" ")>0 || payPwd.length<8 || payPwd.length>20 || reg.test(payPwd) || hanzi.test(payPwd)){
			btnPayPwd = false;
			$('.msg-payPwd').show().text('8~20位非纯数字字符');
		}else{
			btnPayPwd = true;
			$('.msg-payPwd').hide();
		}
	});

	//确认支付密码
	var btnConfirmPayPwd = false;
	$('.payConfirmPwd').blur(function(){
		var payConfirmPwd = $.trim($('.payConfirmPwd').val());
		var payPwd = $(".payPwd").val();
		if(payConfirmPwd !== payPwd){
			$('.msg-payConfirmPwd').show().text('两次输入不一致');
			btnConfirmPayPwd = false;
			$('.twoStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
		}else{
			$('.msg-payConfirmPwd').hide();
			btnConfirmPayPwd = true;
			$('.twoStep').css({'cursor':'pointer','backgroundColor':'#0bbeee'});
		}
	});

	//接口3 注册第二步 设置支付密码 
	$('.twoStep').click(function(){
		if(btnPayPwd == false){
			$('.msg-payPwd').show().text('8~20位非纯数字字符');
		}else if(btnConfirmPayPwd == false){
			$('.msg-payConfirmPwd').show().text('两次输入不一致');
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
		var reg=/^[\u4e00-\u9fa5]{0,}$/;
		if(!reg.exec(personName)){
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
			$('.msg-personId').show().text('您填写的姓名与身份证号不匹配。');
		}else{
			api_mkt.realNameAuth({			
		   		'realName':$('.personName').val(),
			   	'idNumber':$('.personId').val()	   
			}, function(data) {
				if (data.status == 200) {
					$('.msg-personId').hide();
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
				} else if(data.status == 304){
					$('.threeStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
					$('.msg-personId').show().text('您填写的姓名或身份证号不正确，请重新输入。');
				}else{
					$('.msg-personId').show().text(data.msg);
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

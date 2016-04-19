require(['api_mkt','cookie'], function(api_mkt) {
	 
	/**
     * 禁止输入框粘贴
     */
    $("input").on("paste",function(e){
		return false;
	});
    
    /**
     * 输入框通用校验
     */
	$("input").on("keyup",function(e){
		//只允许输入 ASCII的33~126的字符
		if(this.value.charCodeAt()<33 || this.value.charCodeAt()>126){
			$(this).val($(this).val().replace(this.value,""));
		}
	});

	$(".personName").off("keyup");
	
	//表单校验password
	/*$('.checkPhone, .checkpwd, .checkConfirmPwd, .payPwd, .payConfirmPwd, .personName, .personId').focus(function(){
		$(this).val('');
	});*/
	
	$(".checkPhone").on("keydown",function(e){
		var keycode = e.which; 
		if((keycode!=8 && keycode!=9 &&keycode!=16 &&keycode!=20 && keycode<48) || (keycode>57 && keycode<96) || keycode>105){			return false;
		}
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
					$('.msg-code').text('');
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
		if(pwd.indexOf(" ")>=0 || pwd.length<6 || pwd.length>20 || reg.test(pwd) || hanzi.test(pwd)){
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
	            	$('.msg-phone').show().html('手机号已注册，请<a class="markasread" href="index.html">直接登录</a>');
	            	//$('.oneStep').css({'cursor':'not-allowed','backgroundColor':'#eee'});
	            	$('.oneStep').unbind('click');
	            	$('.msg-code').text('');
	            }else if(data.status == 200){  
	            	//window.location.href = "regist.html?Step=one";
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
		if(payPwd.indexOf(" ")>=0 || payPwd.length<8 || payPwd.length>20 || reg.test(payPwd) || hanzi.test(payPwd)){
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
		}else{
			$('.msg-payConfirmPwd').hide();
			btnConfirmPayPwd = true;
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
					window.location.href = "regist.html?Step=two"; 			
				}else{
	            	$('.msg-payConfirmPwd').show().text(data.msg);
	            }
			});
		}	

    });
    //实名认证 姓名
    var btnConfirm1 = false;
	$(".personName").blur(function(){
		var personName = $.trim($(".personName").val());
		var reg=/[\u4e00-\u9fa5]/;//汉字
		if(!reg.exec(personName)){
			btnConfirm1 = false;
			$('.msg-personName').show().text('请填写您的姓名');
		}else{
			$('.msg-personName').hide();
			btnConfirm1 = true;
		}
	});
	//实名认证 身份证号
    var btnConfirm2 = false;
	$(".personId").blur(function(){
		var personId = $.trim($(".personId").val());
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   		if(!reg.test(personId)){
			btnConfirm2 = false;
			$('.msg-personId').show().text('请输入正确的身份证号');
		}else {
			$('.msg-personId').hide();
			btnConfirm2 = true;
		}
	});
	//接口4 注册第三步 设置实名验证
	$('.threeStep').click(function(){
		if(btnConfirm1 == false){
			$('.msg-personName').show().text('请填写您的姓名');
		}else if(btnConfirm2 == false){
			$('.msg-personId').show().text('请输入正确的身份证号');
		}else{
			api_mkt.realNameAuth({			
		   		'realName':$('.personName').val(),
			   	'idNumber':$('.personId').val()	   
			}, function(data) {
				if (data.status == 200) {
					window.location.href = "regist.html?Step=three";					
				}else{
					$('.msg-personId').show().text(data.msg);
				}
			});
		}
    });

    //跳过实名验证
    $('.SkipThreeStep').click(function(){
    	window.location.href = "regist.html?Step=three";		
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
	//接受跳转参数
	$(function() {
	    function getQueryString(name) {
	        href = decodeURIComponent(location.href);
	        // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
	        if (href.indexOf("?") == -1 || href.indexOf(name + '=') == -1) {
	            return '';
	        }
	        // 获取链接中参数部分
	        var queryString = href.substring(href.indexOf("?") + 1);
	        // 分离参数对 ?key=value&key2=value2
	        var parameters = queryString.split("&");
	        var pos, paraName, paraValue;
	        for (var i = 0; i < parameters.length; i++) {
	            // 获取等号位置
	            pos = parameters[i].indexOf('=');
	            if (pos == -1) {
	                continue;
	            }
	            // 获取name 和 value
	            paraName = parameters[i].substring(0, pos);
	            paraValue = parameters[i].substring(pos + 1);
	            // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
	            if (paraName == name) {
	                return unescape(paraValue.replace(/\+/g, " "));
	            }
	        }
	        return '';
	    };
	    var fval = getQueryString("Step");
	    if (fval=="one") {
            $(".two").css('display','flex');
			$(".one").css('display','none'); 
        	$('.msg-code').text('');
	    } else if(fval=="two"){
			$('.msg-payConfirmPwd').hide();
            $(".two").css('display','none');
			$(".one").css('display','none'); 
			$(".three").css('display','flex');
			$(".four").css('display','none');
	    } else if(fval=="three"){
	    	$('.msg-personId').hide();
            $(".two").css('display','none');
			$(".one").css('display','none'); 
			$(".three").css('display','none');
			$(".four").css('display','flex');
			toIndex();
	    }
	});

});

require(['api_mkt','cookie'], function(api_mkt) {
	
	//我的账户-实名验证校验
	var BtnConfirm = false;
	//校验姓名
	$('#realAuthName').blur(function(){
		var realAuthName = $(this).val();
		var reg = /^[\u4e00-\u9fa5]+$/;   
        if(!reg.test(realAuthName)){
			BtnConfirm = false;
			$('.msg-realAuthName').text('请输入姓名');
		}else{
			BtnConfirm = true;
			$('.msg-realAuthName').text('');
		}
	});
	//校验身份证号
	$('#realAuthId').blur(function(){
		var realAuthId = $(this).val();
		var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;   
        if(!reg.test(realAuthId)){
			BtnConfirm = false;
			$('.msg-realAuthId').text('请输入正确的身份证号');
		}else{
			BtnConfirm = true;
			$('.msg-realAuthId').text('');
		}
	});

	//按钮 
	$('.realAuthBtn').click(function(){
		if(BtnConfirm == false){
			alert('请填写正确姓名和身份证号');
		}else{
			//我的账户实名认证信息
			api_mkt.realAuth(function(data) {
				console.log(data);
		        if(data.status == 200){
		        	alert('success');               
		        }else{
		        	alert('err');
		        }
			});
		}
	});

});
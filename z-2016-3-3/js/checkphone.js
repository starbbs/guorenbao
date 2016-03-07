require(['avalon','check','mainpage'],function(avalon,check,mainpage){
	var regNum = /^\d{0,11}$/;
	console.log(mainpage);
	avalon.ready(function(){
		var mainPageVm = avalon.define({
			$id:'checkphone',
			phoneNum:'',				//手机号
			getValBtn:false,			//获取验证码按钮状态
			ajaxVal:'',                 //后台验证码
			value:'',					//用户验证码
			nextBok:false,				//下一步状态
			
			checkphone:function(){		//检测手机号
				if(check.phone(mainPageVm.phoneNum).code=='200'){
					console.log('手机验证成功');
					mainPageVm.getValBtn = true;
				}else{
					mainPageVm.getValBtn = false;
				}
			},
			
			getval:function(){		   //获取验证码
				if(mainPageVm.getValBtn){
					alert('ajax');
					
					mainPageVm.getValBtn = false;
					mainPageVm.ajaxVal = 'abcde';
					var _this = $(this);
					var s = 60;
					var timer = setInterval((function(){
						s--;
						if(s==0){
							_this.html('重新获取验证码');
							mainPageVm.getValBtn = true;
							clearInterval(timer);
							timer = null;
						} else {
							_this.html(s+'秒后重新获取');
						}
						return arguments.callee;
					})(),1000);
					
					
				}	
			},
			checkval:function(){//检测验证码
				if(mainPageVm.value == mainPageVm.ajaxVal && mainPageVm.value!=''){
					mainPageVm.nextBok = true;
				}else{
					mainPageVm.nextBok = false;	
				}
			},
			nextstep:function(){//下一步
				if(mainPageVm.nextBok){
					alert('下一步跳转');
					window.location.href='mainpage.html'
				}
			}
		});
		avalon.scan();
		console.log(avalon)
	});
		

	
	
});
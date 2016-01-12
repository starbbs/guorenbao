
// 张树垚 2015-12-30 16:55:15 创建
// H5微信端 --- 支付密码重置


require(['router','api','h5-view' ,'h5-ident', 'h5-paypass', 'h5-text'], function(router,api,View) {
    router.init(true);
	var gopToken = $.cookie('gopToken');
	var paypass = $('.paypass-page');
	var paypass_choose = new View('paypass-choose');
	var paypass_protection_1 = new View('paypass-protection-1');
	var paypass_protection_2 = new View('paypass-protection-2');
	var paypass_authentication = new View('paypass-authentication');
	var paypass_view_1 = new View('paypass-view-1');
	var paypass_view_2 = new View('paypass-view-2');
	var paypass_view_3 = new View('paypass-view-3');
	var vm = avalon.define({
		$id: 'paypass',	
		paypass1:'',
		paypass2:'',
		paypass3:'',
		realName:'',
		Idcard:'',
		question1:'',
		question2:'',
		answer1:'',
		answer2:'',
		ident:function(view){
			if(view=='paypass-protection'){
				//密保问题设置
			}else{
				//身份证认证				
				api.info({
					gopToken: gopToken
				}, function(data) {
					if (data.status == 200) {			
						if(data.data.realname){
							vm.realName="*"+data.data.realname.substr(1,data.data.realname.length-1);	
						}
					} else {
						console.log(data);
					}
				});
			}
			router.go('view/'+view);
		},
		authentication_click:function(e){
			if(vm.Idcard.length==18){
				api.checkIDcard({
					gopToken: gopToken,
					IDcard:vm.Idcard
				}, function(data) {
					if (data.status == 200) {			
						router.go('view/paypass-view-2');
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			}else{
				$.alert('身份证号码格式错误');
			}
			
		},
		paypass_click_1: function(e) {
			if(vm.paypass1.length==6){
				//验证支付密码
				api.checkPayPwd({
					gopToken: gopToken,
	        	    payPwd:vm.paypass1
	         	}, function(data) {
	         		if (data.status == 200) {
	    				router.go('view/paypass-view-2');	
	         		} else {
	         			console.log(data);
	         			$.alert(data.msg);
	         		}
	         	});
			}     	
        },
        paypass_click_2: function(e) {
        	if(vm.paypass2.length==6){
        		router.go('view/paypass-view-3');
			}    	
        },
        paypass_click_3: function(e) {
        	if(vm.paypass2==vm.paypass3 && vm.paypass3.length==6){
        		api.changePayPwd({
					gopToken: gopToken,
					payPwdNew:vm.paypass3
	         	}, function(data) {
	         		if (data.status == 200) {
	    				router.go('/');	
	         		} else {
	         			console.log(data);
	         			$.alert(data.msg);
	         		}
	         	});
			}else{
				$.alert("新密码格式错误");
			}      	
        }
	});
	
	
	
	
	avalon.scan();

	setTimeout(function() {
		paypass.addClass('on');
	});
});


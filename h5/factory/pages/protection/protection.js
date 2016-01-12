
// 余效俭 2016-1-9 14:04:45 创建
// H5微信端 --- 密保设置


require(['router', 'h5-view','api','h5-paypass', 'h5-text','cookie'], function(router,View,api) {
    router.init(true);
	var gopToken = $.cookie('gopToken');
	var protection = $('.protection');
	var protection_view_1 = new View('protection-view-1');
	var protection_view_2 = new View('protection-view-2');
	var vm = avalon.define({
		$id: 'protection',	
		question1:'',
		question2:'',
		answer1:'',		
		answer2:'',
		payPwd:'',
		paypass_click: function () { 
			if(vm.payPwd.length==6){
				//验证支付密码
				api.checkPayPwd({
					gopToken: gopToken,
	        	    payPwd:vm.payPwd
	         	}, function(data) {
	         		if (data.status == 200) {
	    				router.go('view/protection-view-1');	
	         		} else {
	         			console.log(data);
	         			$.alert(data.msg);
	         		}
	         	});
			}
			
        },
        selection_1_click: function(e) {
        	router.go('view/protection-view-2');      	
        },
        selection_2_click: function(e) {
        	//保存
        	api.checkBankCard({
        		gopToken: gopToken,
        		qtID1:vm.question1,
        	    qt1:vm.answer1,
        	    qtID2:vm.question2,
        	    qt2:vm.answer2,
        	    payPwd:vm.payPwd
         	}, function(data) {
         		if (data.status == 200) {
         			$.alert("设置成功");
         		} else {
         			console.log(data);
         		}
         	});
        }
	});
	
	
	avalon.scan();

	setTimeout(function() {
		protection.addClass('on');
	});
});


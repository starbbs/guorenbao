
// 余效俭 2016-1-9 14:04:45 创建
// H5微信端 --- 密保设置


require(['router', 'h5-view','api','h5-paypass', 'h5-text','cookie', 'h5-weixin'], function(router,View,api) {
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
        	if(!vm.question1 || !vm.answer1 || !vm.payPwd){
        		$.alert("密保问题不能为空");
        		return;
        	}
        	router.go('view/protection-view-2');      	
        },
        selection_2_click: function(e) {
        	if(!vm.question1 || !vm.answer1 || !vm.question2 || !vm.answer2 || !vm.payPwd){
        		$.alert("密保问题不能为空");
        		return;
        	}
        	if(vm.question==vm.question2 || vm.answer1==vm.answer2){
        		$.alert("问题或答案不能相同");
        		return;
        	}
        	//保存
        	api.applyQuestion({
        		gopToken: gopToken,
        		question1:vm.question1,
        		answer1:vm.answer1,
        		question2:vm.question2,
        	    answer2:vm.answer2,
        	    payPwd:vm.payPwd
         	}, function(data) {
         		if (data.status == 200) {
         			$.alert("密保问题一旦设置将不可更改，请牢记您的密保问题");
                    setTimeout(function(){
                        window.location.href = 'security.html';
                    },2000);
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


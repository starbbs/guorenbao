
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
        whichchoosed:'',
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
            var obj=document.getElementById('protection-selection-1'); 
            //index,要删除选项的序号，这里取当前选中选项的序号
            var index=obj.selectedIndex;
            //console.log(index+"heeeeeeeeeeeee");
            vm.whichchoosed = index;
            var obj2=document.getElementById('protection-selection-2');
            obj2.options.length=0;
            obj2.options.add(new Option("请选择   密保问题2",""));
            obj2.options.add(new Option("我最喜欢的歌是什么？","我最喜欢的歌是什么？"));
            obj2.options.add(new Option("我爷爷的名字是什么？","我爷爷的名字是什么？"));
            obj2.options.add(new Option("我最喜欢的宠物名字是什么？","我最喜欢的宠物名字是什么？"));
            obj2.options.add(new Option("我最喜欢的明星是谁？","我最喜欢的明星是谁？"));
            obj2.options.add(new Option("我奶奶的名字是什么？","我奶奶的名字是什么？"));
            obj2.options.add(new Option("我的高中班主任的名字是什么？","我的高中班主任的名字是什么？"));
            obj2.options.add(new Option("我的初中班主任的名字是什么？","我的初中班主任的名字是什么？"));
            obj2.options.add(new Option("我最好的朋友叫什么名字？","我最好的朋友叫什么名字？"));
            obj2.options.remove(index);
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


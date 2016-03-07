require(['router','view','userinfor'],function(router,view,userinfor){
	avalon.ready(function(){
		console.log(view);
		router.init(true);
		var userinforView = new view('userinfor');
		var mainPageVm = avalon.define({
			$id:'login',
			name:'',
			password:'',
			loginFn:function(){
				if(mainPageVm.name=='name' && mainPageVm.password=='name'){
					alert('ajax');
					
					$.extend(userinforvm,{
						name:'kw',
						password:'name',
						img:'abc.img',
						age:'23',
					});
					//window.location.href = 'userinfor.html';
					$('.showuserinfor').show();
					router.go('/view/userinfor');
				}
			}
		});
		
		 var userinforvm = avalon.define({
			$id:'userinfor',
			name:'',
			password:'',
			img:'',
			age:''
		});
		
		
		avalon.scan();
		console.log(avalon)
	});
});
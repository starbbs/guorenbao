require([],function(){
		avalon.ready(function(){
			var mainPageVm = avalon.define({
				$id:'mainPage',
				name:'',
				goToLook:function(){
					alert(111);
				}
			});
			
			alert('ajax后台传新老用户类型');
			var userCangory = '';
			if(userCangory=='新用户'){
				mainPageVm.name = '新用户';
			}else{
				mainPageVm.name = '老用户';
			}
			
			
			avalon.scan();
			console.log(avalon);
			console.log($);
		});
});
/*赋值函数  在引用界面console.log(mainpage);  得到的是var mainpage = 后面的方程
define('mainpage',['avalon'],function(avalon){
	var mainpage = function(){
		avalon.ready(function(){
			var mainPageVm = avalon.define({
				$id:'mainPage',
				name:'abc',
				goToLook:function(){
					alert(111);
				}
			});
			avalon.scan();
			console.log(avalon);
			console.log($);
		});
	};
	return mainpage;
});
*/


/*JSON   在引用界面console.log(mainpage.name);
define('mainpage',['avalon'],function(avalon){
	var mainpage = {};
	mainpage.fn = function(){
		avalon.ready(function(){
			var mainPageVm = avalon.define({
				$id:'mainPage',
				name:'abc',
				goToLook:function(){
					alert(111);
				}
			});
			avalon.scan();
			console.log(avalon);
			console.log($);
		});
	};
	mainpage.name = 'name';
	return mainpage;
});
*/
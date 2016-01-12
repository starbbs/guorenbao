
// 张树垚 2015-12-30 10:15:38 创建
// H5微信端 --- view-authentication


define('h5-view-authentication', ['h5-view', 'api','h5-text','cookie'], function(View,api) {
    var name = 'authentication';
    var gopToken = $.cookie('gopToken');
	var view = new View(name);
	var vm = view.vm = avalon.define({
		$id: name,
		realName:'',
		Idcard:'',
		next_click: function() {
			api.applyCertification({
				gopToken: gopToken,
				name:vm.realName,
				IDcard:vm.Idcard
			}, function(data) {		
				if (data.status == 200) {
					$('.not-authed').removeClass('on');
					$('.authed').addClass('on');
				} else {
					console.log(data);
				}
			});
		},
		finish_click:function(){
			router.go('/');
		}
	});
	
	api.alreadyCertification({
		gopToken: gopToken
	}, function(data) {		
		if (data.status == 200 && data.data.name) {
			vm.realName="*"+data.data.name.substr(1,data.data.name.length-1);	
			vm.Idcard=data.data.IDcard.substr(0,2)+"***********"+data.data.IDcard.substr(data.data.IDcard.length-3,2);
			$('.not-authed').removeClass('on');
			$('.authed').addClass('on');
		} else {
			console.log(data);
			$('.not-authed').addClass('on');
			$('.authed').removeClass('on');
		}
	});
	
	avalon.scan(view.native, vm);
	return view;
});


// 张树垚 2015-12-30 10:15:38 创建
// H5微信端 --- view-authentication


define('h5-view-authentication', ['h5-view', 'api','h5-dialog-alert', 'h5-text', 'cookie'], function(View, api,dialogAlert) {
	var name = 'authentication';
	var gopToken = $.cookie('gopToken');
	var view = new View(name);
	var vm = view.vm = avalon.define({
		$id: name,
		realName: '',
		Idcard: '',
		callback: $.noop,
		callbackFlag:false,
		next_click: function() {
			var reg1 = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
			if (!reg1.test(vm.realName)) {
				return $.alert('请输入中文名');
			}
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (reg.test(vm.Idcard)) {
				api.applyCertification({
					gopToken: gopToken,
					name: vm.realName,
					IDcard: vm.Idcard
				}, function(data) {
					if (data.status == 200) {
						$.alert('实名认证成功')
						if(!vm.callback()){
							$('.not-authed').removeClass('on');
							$('.authed').addClass('on');
						}
					} else {
						console.log(data);
						$.alert('身份证号或名字错误');
					}
				});
			} else {
				$.alert('身份证号格式错误');
			}
		},
		finish_click: function() {
			router.to('/');
		},
		showAuthenDes:function(){
			dialogAlert.set('为保证您的账户资金安全，请您输入真实姓名，实名信息校验正确后不可更改');
			dialogAlert.show();
		}
	});

	avalon.filters.realName = function(str) {
		return '*' + str.substr(1, str.length - 1);
	};
	avalon.filters.Idcard = function(str) {
		return str.substr(0, 2) + '***********' + str.substr(str.length - 2, 2);
	};

	api.alreadyCertification({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200 && data.data.name) {
			vm.realName = data.data.name;
			vm.Idcard = data.data.IDcard;
			$('.not-authed').removeClass('on');
			$('.authed').addClass('on');
		} else {
			console.log(data);
			$('.not-authed').addClass('on');
			$('.authed').removeClass('on');
		}
	});

	avalon.scan(view.native, vm);
	view.on('hide',function(){
		dialogAlert.hide();
	});
	return view;
});
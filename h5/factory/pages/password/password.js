// 余效俭 2016-1-12 17:47:16 创建
// H5微信端 --- 修改用户密码


require(['router', 'api', 'h5-view', 'h5-view-password', 'h5-weixin'], function(router, api, View, viewPassword) {
	router.init(true);
	var gopToken = $.cookie('gopToken');
	var password = $('.password');
	var vm = avalon.define({
		$id: 'password',
		pass: '',
		errorTime: 0,
		check_password_click: function() {
			if (!vm.pass) {
				$.alert("原密码不能为空");
				return;
			}
			if (vm.errorTime >= 3) {
				var options = {};
				var date = new Date();
				date.setTime(date.getTime() + 3 * 3600 * 1000); //锁定3小时
				options.expires = date.toGMTString();
				$.cookie('errorTime', errorTime, options);
				$.alert("密码输入错误3次,请稍后再试");
				return;
			} else if ($.cookie('errorTime') && parseInt($.cookie('errorTime')) >= 3) {
				$.alert("密码输入错误3次,请稍后再试");
				return;
			}
			api.checkPwd({
				gopToken: gopToken,
				pwd: vm.pass
			}, function(data) {
				if (data.status == 200) {
					viewPassword.set.vm = vm.pass;
					router.go('/view/password-set');
				} else {
					$.alert("密码错误");
					console.log(data);
					vm.errorTime++;
				}
			});

		}
	});

	avalon.scan();

	setTimeout(function() {
		password.addClass('on');
	});
});
// 余效俭 2016-1-9 10:47:16 创建
// H5微信端 --- 安全中心
require(['router', 'api', 'h5-view', 'h5-view-password', 'h5-view-authentication', 'h5-weixin'], function(router, api, View, viewPassword, viewAuthen) {
	router.init(true);
	var gopToken = $.cookie('gopToken');
	var security = $('.security');
	var vm = avalon.define({
		$id: 'security',
		authenticationed: false,
		authenticationedStr: '未认证',
		setProtected: false,
		setProtectedStr: '未设置',
		authentication_click: function() {
			router.go('/view/authentication');
		},
		protect_click: function(e) {
			if (!vm.setProtected) {
				window.location.href = "./protection.html";
			}
		}
	});
	var init = function() {
		api.isCertification({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				vm.authenticationed = true;
				vm.authenticationedStr = "已认证";
			} else {
				console.log(data);
			}
		});
		setTimeout(function() {
			api.isQuestion({
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					vm.setProtected = true;
					vm.setProtectedStr = "已设置";
				} else {
					console.log(data);
				}
			});
		}, 200);
	}
	avalon.scan();
	viewAuthen.vm.callback = function() {
		vm.authenticationed = true;
		vm.authenticationedStr = "已认证";
	}
	setTimeout(function() {
		security.addClass('on');
	}, 100);
	init();
});
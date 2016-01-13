
// 张树垚 2015-12-27 15:57:31 创建
// H5微信端 --- 微信授权跳转页


require(['router', 'api', 'get', 'authorization', 'h5-view', 'h5-view-login', 'h5-weixin'], function(router, api, get, authorization, View, viewLogin) {

	router.init(true);

	var select = new View('choose-select');
	var selectVM = select.vm = avalon.define({
		$id: 'choose-select',
		userNick: '昵称',
		userImage: 'images/index-2.jpg'
	});
	avalon.scan(select.native, selectVM);

	var gotoAuthorization = function() { // 跳转授权页, 未授权
		setTimeout(function() {
			location.href = authorization.default;
		}, 100);
	};
	var gotoChoose = function() { // 跳转choose分页, 已授权, 未绑定账号
		setTimeout(function() {
			router.go('/view/choose-select');
		}, 100);
	};
	var gotoHome = function() { // 跳转home页面, 已授权, 已绑定账号
		setTimeout(function() {
			location.href = 'home.html';
		}, 100);
	};

	setTimeout(function() {
		if (get.data.code) {
			// 已授权
			api.wxlogin({
				code: get.data.code
			}, function(data) {
				if (data.status == 200) {
					if (data.data.gopToken) {
						// 已绑定
						$.cookie('gopToken', data.data.gopToken); // 果仁账户token
						gotoHome();
					} else {
						// 未绑定
						selectVM.userNick = viewLogin.vm.userNick = data.data.nick; // 昵称
						selectVM.userImage = viewLogin.vm.userImage = data.data.img; // 头像
						$.cookie('openId', data.data.openid); // 微信id
						gotoChoose();
					}
				} else {
					console.log(data);
				}
			});
		} else {
			// 未授权
			gotoAuthorization();
		}
	}, 100);
});





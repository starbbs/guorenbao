
// 张树垚 2015-12-27 15:57:31 创建
// H5微信端 --- 微信授权跳转页


require(['router', 'api', 'get', 'authorization', 'h5-view', 'h5-view-login', 'h5-weixin'], function(router, api, get, authorization, View, viewLogin, weixin) {

	router.init(true);

	var select = new View('index-select');
	var selectVM = select.vm = avalon.define({
		$id: 'index-select',
		userNick: '', // 微信昵称
		userImage: '', // 微信头像
	});
	avalon.scan(select.native, selectVM);

	// $.cookie('gopToken', 'b44113035b6248b092f363618d8aeb71'); // https测试账号
	// $.cookie('gopToken', 'cb51f72310fa4d22a1c7142e8d48b214'); // 杨娟的帐号
	$.cookie('gopToken', 'ec9617ecc0204285accda688eddebf85'); //自己
	// $.cookie('gopToken', '4b35b6239f8b465cb126cae77177f2d7'); //自己133
	// $.cookie('gopToken', '60371545982b401d9cba6eea72402f01'); //13833298624
	var gotoAuthorization = function() { // 跳转授权页, 未授权
		// return;
		setTimeout(function() {
			window.location.href = authorization.default; //跳转威信授权的地址
		}, 100);
	};
	var gotoSelect = function() { // 跳转select分页, 已授权, 未绑定账号
		setTimeout(function() {
			router.go('/index-select');
		}, 100);
	};
	var gotoHome = function() { // 跳转home页面, 已授权, 已绑定账号
		setTimeout(function() {
			window.location.href = 'home.html';
		}, 100);
	};
	$.cookie('userUrl',window.href);
	console.log($.cookie('userUrl'));
	if ($.cookie('gopToken')) { // 有token
		api.getGopNum({
			gopToken: $.cookie('gopToken')
		}, function(data) {
			if (data.status == 200) { // token有效
				gotoHome();
			} else { // token无效
				$.cookie('gopToken', null);
				gotoAuthorization();
			}
		});
	} else { // 没有token
		if (get.data.code) { // 已授权
			api.wxlogin({
				code: get.data.code
			}, function(data) {
				if (data.status == 200) {
					if (data.data.gopToken) { // 已绑定
						$.cookie('gopToken', data.data.gopToken); // 果仁账户token
						gotoHome();
					} else { // 未绑定
						$.cookie('openId', data.data.openid); // 微信id
						selectVM.userNick = viewLogin.vm.userNick = data.data.nick;
						selectVM.userImage = viewLogin.vm.userImage = data.data.img;
						gotoSelect();
					}
				} else {
					$.alert(data.msg);
				}
			});
		} else { // 未授权
			gotoAuthorization();
		}
	}

});






// 张树垚 2015-12-18 13:57:23 创建
// H5微信端 --- 注册页面


require(['api', 'check', 'router', 'h5-view', 'h5-check', 'h5-ident', 'h5-text', 'h5-alert', 'h5-paypass', 'h5-weixin'], function(api, check, router, View, h5Check, h5Ident) {

	router.init(true);

	var confirmData = { // 保存确定数据
		phone: null,			// 手机号
		identifyingCode: null,	// 验证码
		gopToken: null,			// token
		password: null,			// 密码
		paypass1: null,			// 支付密码第一次
		paypass2: null,			// 支付密码第二次
		paypass: null,			// 支付密码已设置
		openId: null			// 微信openId
	};
	var phoneInput = $('#regist-mobile');
	var codeInput = $('#regist-identify');
	var passwordInput = $('#regist-password-mobile');
	var _paypass = {
		input1: $('.regist-paypass-1 input'),
		input2: $('.regist-paypass-2 input'),
		items1: $('.regist-paypass-1 .paypass-item'),
		items2: $('.regist-paypass-2 .paypass-item'),
	};
	var viewPassword = new View('regist-password');
	var viewPaypass1 = new View('regist-paypass-1');
	var viewPaypass2 = new View('regist-paypass-2');
	var vm = avalon.define({
		$id: 'regist',
		ifNext: false, // 是否可以下一步
		input: function() { // 绑定两个输入框, 均满足条件时, 请求接口验证
			vm.ifNext = false;
			h5Ident.input(phoneInput, codeInput, function() {
				vm.ifNext = true;
			});
		},
		next: function() { // 下一步
			if (vm.ifNext) {
				router.go('/view/regist-password');
			}
		},
		ifPasswordNext: false,
		passwordInput: function() {
			vm.ifPasswordNext = check.password(passwordInput.val()).result;
		},
		passwordNext: function() {
			var code = codeInput.val(); // 默认验证通过
			var phone = phoneInput.val(); // 默认验证通过
			var value = passwordInput.val();
			if (vm.ifPasswordNext && h5Check.password(passwordInput)) { // 验证密码
				api.registerall({
					phone: phone,
					identifyingCode: code,
					password: value,
				}, function(data) {
					if (data.status == 200) {
						var gopToken = data.data.gopToken;
						confirmData.phone = phone;
						confirmData.password = value;
						confirmData.identifyingCode = code;
						confirmData.gopToken = gopToken;
						$.cookie('gopToken', gopToken);
						router.go('/view/regist-paypass-1');
						// 绑定微信
						var openId = $.cookie('openId');
						if (openId) {
							api.setLoginPassword({
								gopToken: gopToken,
								password: value,
								openId: openId
							}, function(data) {
								if (data.status) {
									confirmData.openId = openId;
								} else {
									$.alert(data.msg);
								}
							});
						} else {
							$.alert('未获取到微信信息<br>无法绑定果仁宝账户');
						}
					} else {
						$.alert(data.msg);
					}
				});
			}
		},
		ifPaypass1Next: false,
		ifPaypass2Next: false,
		paypassInput: function(num) {
			// _paypass['items' + num].removeClass('on').slice(0, this.value.length).addClass('on');
			vm['ifPaypass' + num + 'Next'] = check.paypassCondition(this.value);
		},
		paypass1Next: function() {
			if (vm.ifPaypass1Next && check.paypassCondition(_paypass.input1)) {
				router.go('/view/regist-paypass-2');
				confirmData.paypass1 = _paypass.input1.val();
			}
		},
		paypass2Next: function() {
			if (vm.ifPaypass2Next && check.paypassCondition(_paypass.input2)) {
				var value = _paypass.input2.val();
				if (value == confirmData.paypass1) {
					api.setPayPassword({
						gopToken: confirmData.gopToken,
						password: confirmData.paypass1
					}, function(data) {
						if (data.status == 200) {
							$.alert('支付密码设置成功!', function() {
								location.href = 'home.html';
							});
						} else {
							$.alert(data.msg);
						}
					});
				} else {
					$.alert('请输入相同密码!');
				}
			}
		}
	});
	avalon.scan();
});


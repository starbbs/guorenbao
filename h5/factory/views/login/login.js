
// 张树垚 2015-12-16 16:11:10 创建
// H5微信端 登录


define('h5-view-login', ['h5-view', 'check', 'api', 'h5-view-password', 'h5-text', 'h5-alert', 'cookie'], function(View, check, api, viewPassword) {
	var login = new View('login');
	var vm = login.vm = avalon.define({
		$id: 'view-login',
		userNick: '袋鼠',
		userImage: '',
		click: function() {
			var phone = $('#login-mobile').val();
			var phoneResult = check.phone(phone);
			if (!phoneResult.result) {
				return $.alert(phoneResult.message);
			}
			var password = $('#login-password').val();
			var passwordResult = check.password(password);
			if (!passwordResult.result) {
				return $.alert(passwordResult.message);
			}
			api.login({
				phone: phone,
				password: password,
				openId: $.cookie('openId')
			}, function(data) {
				if (data.status != 200) {
					return $.alert(data.msg);
				}
				$.cookie('gopToken', data.data.gopToken);
				setTimeout(function() {
					window.location.href = 'home.html';
				}, 100);
			});
		}
	});
	avalon.scan(login.native, vm);
	return login;
});
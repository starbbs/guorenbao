
// 张树垚 2015-10-28 14:21:31 创建
// 登录弹窗


define(['dialog', 'top', 'check', 'api'], function(Dialog, top, check, api) {

	var dialogLogin = top.dialogLogin = new Dialog('.dialog-login');

	var vm = dialogLogin.vm = avalon.define({
		$id: 'dialog-login',
		err_code: 0, // 错误码, 0:无问题, 1:手机号错误, 2:密码错误, 3:账户被锁定
		err_msg: '', // 错误信息
		phone: '', // 手机号
		password: '', // 密码
		buttonClick: function() {
			if ($(this).hasClass('disabled')) { return; }

			// 临时添加
			return location.replace('./gamecards.htm');


			vm.err_code = 0;
			vm.err_msg = '';
			setTimeout(function() {
				if (!check.phone(vm.phone)) {
					vm.err_code = 1;
					vm.err_msg = '请输入正确的手机号';
					return;
				}
				if (!check.password(vm.password).result) {
					vm.err_code = 2;
					vm.err_msg = '您输入的密码格式有误';
					return;
				}
				api.loginCheck({
					phone: vm.phone,
					password: vm.password
				}, function(data) {
					if (data.result === '成功') {
						location.href = './home.htm';
					} else if (data.result === '失败') {
						if (/锁/.test(data.reason)) {
							vm.err_code = 3;
							vm.err_msg = '您的账户已经被锁定，请3小时后再试';
						} else if (/密码/.test(data.reason)) {
							vm.err_code = 2;
							vm.err_msg = '密码错误';
						} else if (/手机|账户|账号/.test(data.reason)) {
							vm.err_code = 1;
							vm.err_msg = '账号错误';
						} else {
							vm.err_code = 0;
							vm.err_msg = data.reason;
						}
					} else {
						alert('登录出错, 请联系技术人员查看!');
					}
				});
			}, 17);
		},
	});
	avalon.scan(dialogLogin.box.get(0), vm);

	return dialogLogin;
});







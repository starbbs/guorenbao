// 张树垚 2015-12-29 09:51:16 创建
// H5微信端 --- view-password


define('h5-view-password', ['api', 'router', 'check', 'h5-view', 'h5-ident', 'h5-dialog-success', 'h5-text'], function(api, router, check, View, ident, dialogSuccess) {

	var finish = function() {
		window.location.href = './mine.html';
	};
	var dialogShow = function() {
		var timer = null;
		var second = 3;
		dialogSuccess.set('登录密码修改成功，请牢记，3s后自动跳转');
		dialogSuccess.on('show', function() {
			timer = setInterval(function() {
				second--;
				if (second <= 0) {
					finish();
					clearInterval(timer);
					dialogSuccess.hide();
				} else {
					dialogSuccess.button.html('登录密码修改成功，请牢记，' + second + 's后自动跳转');
				}
			}, 1000);
		});
		dialogSuccess.show();
	};

	var viewPassword = {};

	var forget = viewPassword.forget = new View('password-forget');
	var forgetPhone = $('#password-forget-mobile');
	var forgetIdent = $('#password-forget-identify');
	var forgetViewModel = avalon.define({
		$id: 'password-forget',
		ifNext: false,
		phone: '', // 双向绑定
		ident: '', // 双向绑定
		identInput: function() { // 验证码输入
			forgetViewModel.ifNext = false;
			ident.input(forgetPhone, forgetIdent, function() {
				forgetViewModel.ifNext = true;
			});
		},
		next: function() {
			if (forgetViewModel.ifNext) {
				router.go('/view/password-set');
			}
		}
	});
	avalon.scan(forget.native, forgetViewModel);



	var set = viewPassword.set = new View('password-set');
	var setViewModel = avalon.define({
		$id: 'password-set',
		password: '', // 双向绑定
		ifNext: false,
		input: function() {
			setViewModel.ifNext = check.password(this.value).result;
		},
		next: function() {//新入新密码的下一步
			if (setViewModel.ifNext) {
				console.log(forgetViewModel.phone)//, forgetViewModel.ident, setViewModel.password);
				api.resetLoginPassword({
					phone: forgetViewModel.phone,
					identifyingCode: forgetViewModel.ident,
					password: setViewModel.password,
				}, function(data) {
					if (data.status == 200) {
						dialogShow();
					} else {
						$.alert(data.status + ': ' + data.msg);
					}
				});
			}
		}
	});
	avalon.scan(set.native, setViewModel);

	return viewPassword;
});
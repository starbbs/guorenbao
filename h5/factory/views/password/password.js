
// 张树垚 2015-12-29 09:51:16 创建
// H5微信端 --- view-password


define('h5-view-password', ['api', 'router', 'check', 'h5-view', 'h5-ident','h5-dialog-success', 'h5-text'], function(api, router, check, View, ident,dialogSuccess) {
    var viewPassword = {
		forget: (function() {
			var forget = new View('password-forget');
			var phoneInput = $('#password-forget-mobile');
			var identInput = $('#password-forget-identify');
			var vm = avalon.define({
				$id: 'password-forget',
				ifNext: false,
				identInput: function() { // 验证码输入
					vm.ifNext = false;
					ident.input(phoneInput, identInput, function() {
						vm.ifNext = true;
					});
				},
				next: function() {
					if (vm.ifNext) {
						router.go('/view/password-set');
					}
				}
			});
			avalon.scan(forget.native, vm);
			return forget;
		})(),
		set: (function() {
			var set = new View('password-set');
			var passwordInput = $('#password-set-mobile');
			var vm = set.vm = avalon.define({
				$id: 'password-set',
				pwdOld:null,
				identifyingCode:null,
				newPass:'',
				identifyingCode:'',
				ifNext: false,
				input: function() {
					vm.ifNext = check.password(passwordInput.val()).result;
					console.log(111);
				},
				next: function() {
					if (vm.ifNext) {
						var gopToken = $.cookie('gopToken');
						var openId = $.cookie('openId');
						api.setLoginPassword({
							gopToken: gopToken,
							openId: openId,
							password: vm.newPass,
							pwdOld:vm.pwdOld,
							identifyingCode:vm.identifyingCode
						}, function(data) {
							if (data.status == 200) {
								var successTimer = null;
								var s = 3;	
								dialogSuccess.set('登录密码修改成功，请牢记，3s后自动跳转');							
								dialogSuccess.on('show',function(){
									successTimer = setInterval(function(){
										s--;
										if(s==0){
											clearInterval(successTimer);
											dialogSuccess.hide();
											window.location.href = 'security.html';
										}else{
											dialogSuccess.button.html('登录密码修改成功，请牢记，'+s+'s后自动跳转');
										}
									},1000);
								});
								dialogSuccess.show();
								//router.go('/view/password-success');
							} else {
								$.alert(data.status + ': ' + data.msg);
							}
						});
					}
				}
			});
			avalon.scan(set.native, vm);
			return set;
		})(),
		success: (function() {
			var success = new View('password-success');
			return success;
		})(),
	};
    
    return viewPassword;
});
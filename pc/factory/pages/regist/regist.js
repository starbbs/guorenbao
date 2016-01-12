

// 张树垚 2015-06-23 15:42:58 创建
// 注册用js


require(['dom', 'api', 'top', 'router', 'dialog-login'], function(dom, api, top, router, dialogLogin) {

	var userData = { // 用户信息
		phone: '',
		pass: '',
		payPass: '',
		realName: '',
		persionId: '',
		flag: 0 // 0:跳过, 1:正常
	};

	var tips_time = 2000,
		pass = {
			step1: false,
			step2: false,
			step3: false,
			step4: false
		};
	
	var $password = $('#password'),
		$passwordRe = $('#password-re'),
		$trade = $('#trade'),
		$tradeRe = $('#trade-re'),
		$step2Click = $('#step2-click'),
		$step3Click = $('#step3-click');

	var option = {
		$id: 'regist',
		step: 0, 			// 当前进程
		mobile: '',


	// 临时增加
		temp1: function() {
			$('#regist-1').hide();
			$('#regist-2').show();
			var jump = $('#jump');
			var time = 5;
			var timer = setInterval(function() {
				time--;
				if (time <= 0) {
					clearInterval(timer);
					window.location.replace('./gamecards.htm');
				}
				jump.html(time + 's后自动跳转进入页面');
			}, 1000);
		},



	// 手机
		input_mobile_tips: '', // 手机输入框提示语
		input_mobile_focus: function() { // 手机输入框焦点
			var self = $(this).removeClass('error'),
				tips = this._tips || (this._tips = self.next());
			clearTimeout(this._tips_timer);
			vm.input_mobile_tips = '输入的手机号码将作为账户名';
			tips.fadeIn(400);
		},
		input_mobile_blur: function() { // 手机输入框失焦
			var _this = this;
			var value = this.value;
			var self = $(this);
			this._tips_timer = setTimeout(function() {
				_this._tips.fadeOut(400);
			}, tips_time);
			if ( value ) {
				if (!(/^1\d{10}$/.test(value))) {
					vm.input_mobile_tips = '请输入正确的手机号码!';
					self.addClass('error');
				} else {
					api.checkPhoneRegister({ // 验证手机号是否存在
						phone: value
					}, function(data) {
						switch(data) {
							case 'exist':
								vm.input_mobile_tips = '您输入的手机号已存在!';
								self.addClass('error');
								break;
							case 'noExist':
								vm.input_mobile_tips = '该手机号可以使用!';
								_this._tips.hide().next().addClass('show');
								break;
							default:
								console.log(data);
						}
					})
					userData.phone = vm.mobile = value;
				}
			}
		},
		input_ident_focus: function() { // 短信验证输入框焦点
			var self = $(this).removeClass('error');
		},
		input_ident_blur: function() { // 短信验证输入框失焦
			var self = $(this);
			var value = this.value;
			api.checkPhoneSeccode({ // 短信验证码是否正确
				phone: userData.phone,
				seccode: value,
				token: vm.token
			}, function(data) {
				if (data.result === '成功') {
					self.removeClass('error');
					self.next().next().addClass('show');
				} else {
					self.addClass('error');
					console.log(data);
				}
			});
		},
		token: '',
		get_ident: function() { // 获取验证短信
			var self = $(this);
			var className = 'sending';
			if ( !self.hasClass(className) && userData.phone ) {
				var time = 60,
					now = '获取短信验证码',
					next = time + '秒后重新发送',
					count = 0,
					_this = this,
					input = self.prev();
				api.sendPhoneSeccode({
					phone: userData.phone
				}, function(data) {
					if (data.result === '成功') {
						vm.token = data.token;
					} else {
						console.log(data);
						alert('验证码发送出错, 请联系技术人员');
					}
				})
				input.attr('disabled', false);
				self.html(next).addClass(className);
				this._ident_timer = setInterval(function() {
					count++;
					if (count >= time) {
						clearInterval(_this._ident_timer);
						self.html(now).removeClass(className);
					} else {
						self.html(time - count + '秒后重新发送');
					}
				}, 1000);
			};
		},
		agreeCheck: function(ev) { // 同意协议
			var span = $(this).find('.regist-agree'),
				input = span.prev();
			ev.preventDefault();
			if (input.val() == 'true') {
				input.val('false');
				span.removeClass('checked');
			} else {
				input.val('true');
				span.addClass('checked');
			}
		},
		step1_click: function(ev) {
			var box = $('#regist-1');
			var done = box.find('.regist-done');
			var agree = box.find('.regist-agree');
			var count = 0;
			done.each(function(i) {
				if ($(this).hasClass('show')) {
					count++;
				}
			});
			if (count === done.length && agree.hasClass('checked')) {
				console.log('第一步完成');
				pass.step1 = true;
			} else {
				ev.preventDefault();
			}
		},
	// 密码
		input_password_class1: '',
		input_password_class2: '',
		input_password_class3: '',
		input_password_focus: function() { // 登录密码焦点
			var self = $(this).removeClass('error'),
				tips = this._tips || (this._tips = self.next());
			clearTimeout(this._tips_timer);
			tips.fadeIn(400);
		},
		input_password_input: function() { // 登录密码输入
			var self = $(this),
				tips = this._tips || (this._tips = self.next()),
				value = this.value,
				length = value.length
			// 1. 6-20位字符
			vm.input_password_class1 = (length > 5 && length < 21) ? 'done' : 'mark';
			// 2. 只能包含字母、数字以及标点符号（除空格）
			vm.input_password_class2 = /^[a-zA-Z\d\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\|\[\]\{\}\;\:\"\'\,\<\.\>\/\?]+$/.test(value) ? 'done' : 'mark';
			// 3. 大写字母、小写字母、数字以和标点符号至少两种
			var count = 0;
			$.each([(/[A-Z]/), (/[a-z]/), (/\d/), (/[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\|\[\]\{\}\;\:\"\'\,\<\.\>\/\?]/)], function(i, re) {
				re.test(value) && count++;
			});
			vm.input_password_class3 = count > 1 ? 'done' : 'mark';
		},
		input_password_blur: function() { // 登录密码失焦
			var self = $(this),
				tips = this._tips || (this._tips = self.next()),
				_this = this;
			this._tips_timer = setTimeout(function() {
				_this._tips.fadeOut(400);
			}, tips_time);
			if ([vm.input_password_class1, vm.input_password_class2, vm.input_password_class3].indexOf('mark') > -1) {
				self.addClass('error');
			};
			checkStep2Click();
		},
		input_password_re_focus: function() { // 登录密码再次输入焦点
			$(this).removeClass('error');
		},
		input_password_re_blur: function() { // 登录密码再次输入失焦
			$(this)[this.value != $password.val() ? 'addClass' : 'removeClass']('error');
			checkStep2Click();
		},
		input_trade_class1: '',
		input_trade_class2: '',
		input_trade_focus: function() { // 交易密码输入框焦点
			var self = $(this).removeClass('error'),
				tips = this._tips || (this._tips = self.next());
			clearTimeout(this._tips_timer);
			tips.fadeIn(400);
		},
		input_trade_input: function() { // 交易密码输入框输入
			var self = $(this),
				tips = this._tips || (this._tips = self.next()),
				value = this.value;
			// 1. 交易密码为6位数字
			vm.input_trade_class1 = (/^\d{6}$/.test(value)) ? 'done' : 'mark';
			// 2. 不要使用连续或相同的数字
			vm.input_trade_class2 = ['012345', '123456', '234567', '345678', '456789', '567890'].indexOf(value) > -1 || /^\d$/.test((value / 111111) + '') ? 'mark' : 'done';
		},
		input_trade_blur: function() { // 交易密码输入框失焦
			var self = $(this),
				tips = this._tips || (this._tips = self.next()),
				_this = this;
			this._tips_timer = setTimeout(function() {
				_this._tips.fadeOut(400);
			}, tips_time);
			if ([vm.input_trade_class1, vm.input_trade_class2].indexOf('mark') > -1) {
				self.addClass('error');
			};
			checkStep2Click();
		},
		input_trade_re_focus: function() { // 交易密码再次输入焦点
			$(this).removeClass('error');
		},
		input_trade_re_blur: function() { // 交易密码再次输入失焦
			$(this)[this.value != $trade.val() ? 'addClass' : 'removeClass']('error');
			checkStep2Click();
		},
		step2_click: function (ev) {
			if ($step2Click.hasClass('disabled')) {
				ev.preventDefault();
			} else {
				userData.pass = $password.val();
				userData.payPass = $trade.val();
				pass.step2 = true;
			}
		},
		input_name_blur: function() {
			userData.realName = this.value;
			checkStep3Click()
		},
		input_person_blur: function() {
			userData.persionId = this.value;
			checkStep3Click()
		},
		step3_click: function(flag) {
			userData.flag = flag || 0;
			api.saveRegisterInfo(userData, function(data) {
				if (data.result === '成功') {
					avalon.router.navigate('/step/4');
					setTimeout(function() {
						api.loginCheck({
							phone: userData.phone,
							password: userData.pass
						}, function(data) {
							if (data.result === '成功') {
								location.href = './home.htm';
							} else {
								console.log(data);
								alert('服务器出错, 请联系技术人员');
							}
						});
					}, 5000);
				} else {
					alert('您的实名认证信息有误! ' + data.reason);
					console.log(data);
				}
			});
		}
	};
	var vm = avalon.define(option);
	avalon.scan();

	function checkStep2Click() {
		setTimeout(function() {
			$step2Click[(!$password.hasClass('error') && !$trade.hasClass('error') && $password.val() && $password.val() == $passwordRe.val() && $trade.val() && $trade.val() == $tradeRe.val())? 'removeClass' : 'addClass']('disabled')
		}, 10);
	}
	function checkStep3Click() {
		setTimeout(function() {
			$step3Click[(userData.realName && userData.persionId) ? 'removeClass' : 'addClass']('disabled')
		}, 10);
	}

	var preventTwice = false;
	avalon.router.get('/step/:num', function(num) {

		// 阻止多次连续多次触发
		if (preventTwice) {
			return false;
		}
		preventTwice = true;
		setTimeout(function() {
			preventTwice = false;
		}, 1);

		// 阻止同地址的点击触发
		if (num === vm.step) {
			return false;
		}

		// 要执行的路由规则
		// console.log('/step/%s', num)
		// var prev = parseInt(num) - 1;
		// if (prev && !pass['step' + prev]) {
		// 	avalon.router.navigate('/step/' + prev);
		// } else {
			vm.step = num;
			dom.wrap.animate({'scrollTop': 0}, 300);
		// }
	});
	router.init();

	if (vm.step !== 1) { // 强制跳到第一步
		router.go('/step/1');
	}
});
















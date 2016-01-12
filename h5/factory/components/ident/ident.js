
// 张树垚 2015-12-28 19:46:43 创建
// H5微信端 --- component-ident 获取验证码


define('h5-ident', ['api', 'check', 'h5-check', 'h5-dialog-alert', 'h5-alert'], function(api, check, h5Check) {
    var _reset = function(self) {
		self.removeClass('silver').addClass('blue').html('获取验证码');
	};
	var _scan = function(context) {
		$('[data-ident]', context).each(function(i, item) {
			var arr = item.dataset.ident.split('|');
			// arr[0] 绑定在avalon.vmodels上的名称, 或者单一input的id
			// arr[1] 绑定在vm上的属性名
			// arr[2] 根据哪个id获取验证码
			if (arr.length > 2) { // 根据ID获取验证码
				if (arr[2] === 'bankcardid') { // 根据银行卡ID
					setTimeout(function() {
						var vm = avalon.vmodels[arr[0]];
						var id = vm[arr[1]];
						var self = $(item);
						var count = 0; // 点击次数
						_reset(self);
						self.on('click', function() {
							if (self.hasClass('silver')) { return; }
							if (!id) { return; }
							count++;
							if (count > 6) {
								setTimeout(function() {
									// 第六次点击后, 给联系客服的提示
								}, 3000);
							}
							var time = 60;
							self.removeClass('blue').addClass('silver').html(time + '秒后重发');
							var timer = setInterval(function() {
								time--;
								if (time <= 0) {
									clearInterval(timer);
									_reset(self);
								} else {
									self.html(time + '秒后重发');
								}
							}, 1000);
							api.bankSendCode({
								gopToken: $.cookie('gopToken'),
								bankId: id
							}, function(data) {
								$.alert(data.status == 200 ? '验证码发送成功' : data.msg);
							});
						}).removeAttr('data-ident');
					}, 300);
				} else if (arr[2] === 'token') {
					setTimeout(function() {
						var gopToken = $.cookie('gopToken');
						var self = $(item);
						var count = 0; // 点击次数
						_reset(self);
						self.on('click', function() {
							if (self.hasClass('silver')) { return; }
							if (!gopToken) { return; }
							count++;
							if (count > 6) {
								setTimeout(function() {
									// 第六次点击后, 给联系客服的提示
								}, 3000);
							}
							var time = 60;
							self.removeClass('blue').addClass('silver').html(time + '秒后重发');
							var timer = setInterval(function() {
								time--;
								if (time <= 0) {
									clearInterval(timer);
									_reset(self);
								} else {
									self.html(time + '秒后重发');
								}
							}, 1000);
							api.phoneSendCode({
								gopToken: $.cookie('gopToken'),
							}, function(data) {
								$.alert(data.status == 200 ? '验证码发送成功' : data.msg);
							});
						}).removeAttr('data-ident');
					}, 300);
				}
			} else if (arr.length > 1) {
				setTimeout(function() {
					var vm = avalon.vmodels[arr[0]];
					var self = $(item);
					var count = 0; // 点击次数
					_reset(self);
					self.on('click', function() {
						if (self.hasClass('silver')) { return; }
						if (!check.phone(vm[arr[1]] + '').result) { return; }
						count++;
						if (count > 6) {
							setTimeout(function() {
								// 第六次点击后, 给联系客服的提示
							}, 3000);
						}
						var time = 60;
						self.removeClass('blue').addClass('silver').html(time + '秒后重发');
						var timer = setInterval(function() {
							time--;
							if (time <= 0) {
								clearInterval(timer);
								_reset(self);
							} else {
								self.html(time + '秒后重发');
							}
						}, 1000);
						api.sendCode({
							phone: vm[arr[1]]
						}, function(data) {
							$.alert(data.status == 200 ? '验证码发送成功' : data.msg);
						});
					}).removeAttr('data-ident');
				}, 300);
			} else {
				var phoneInput = $('#' + item.dataset.ident);
				var self = $(item);
				var count = 0; // 点击次数
				_reset(self);
				self.on('click', function() {
					if (self.hasClass('silver')) { return; }
					if (!h5Check.phone(phoneInput)) { return; }
					count++;
					if (count > 6) {
						setTimeout(function() {
							// 第六次点击后, 给联系客服的提示
						}, 3000);
					}
					var time = 60;
					self.removeClass('blue').addClass('silver').html(time + '秒后重发');
					var timer = setInterval(function() {
						time--;
						if (time <= 0) {
							clearInterval(timer);
							_reset(self);
						} else {
							self.html(time + '秒后重发');
						}
					}, 1000);
					api.sendCode({
						phone: phoneInput.val()
					}, function(data) {
						$.alert(data.status == 200 ? '验证码发送成功' : data.msg);
					});
				}).removeAttr('data-ident');				
			}
		});
	};
	_scan();
	var _check = function(phone, ident) { // 判断是否是格式正确的手机号和校验码
		return check.identCondition(ident) && check.ident(ident).result && check.phone(phone).result;
	};
	return {
		scan: _scan,
		check: _check,
		input: function(phoneInput, identInput, callback) { // 输入时校验, 在vm.identInput中调用, 参数为phone和ident的input以及回调, 没有输出
			var phone = phoneInput.val();
			var ident = identInput.val();
			if (_check(phone, ident)) {
				api.identifyingCode({
					phone: phone,
					identifyingCode: ident
				}, function(data) {
					if (data.status == 200) {
						callback && callback();
					} else {
						console.log(data);
					}
				});
			}
		},
		bankCheck: function(bankcardid, identInput, callback) { // 输入时校验, 用银行卡id获取验证码时
			var ident = identInput.val();
			if (check.identCondition(ident) && check.ident(ident).result) {
				api.bankIdentifyingCode({
					gopToken: $.cookie('gopToken'),
					identifyingCode: ident,
					bankId: bankcardid
				}, function(data) {
					if (data.status == 200) {
						callback && callback();
					} else {
						console.log(data);
					}
				});
			}
		}
	}
});


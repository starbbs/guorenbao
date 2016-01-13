
// 张树垚 2015-12-28 19:46:43 创建
// H5微信端 --- component-ident 获取验证码


define('h5-ident', ['api', 'check', 'h5-check', 'h5-dialog-alert', 'h5-alert'], function(api, check, h5Check) {

	var gopToken = $.cookie('gopToken');

	/**
	 * [_reset 重置ident元素]
	 * @Author   张树垚
	 * @DateTime 2016-01-13 11:23:48
	 * @param    {[jQuery]}      self     [ident元素]
	 * @return   {[null]}                 [无返回]
	 */
    var _reset = function(self) {
		self.removeClass('silver').addClass('blue').html('获取验证码');
	};
	/**
	 * [_bind description]
	 * @Author   张树垚
	 * @DateTime 2016-01-13 11:23:42
	 * @param    {[domElement]}         item          [绑定元素]
	 * @param    {[function]}           checkFun      [验证函数, 返回true则禁止下一步]
	 * @param    {[string]}             apiName       [接口名称]
	 * @param    {[function|json]}      apiData       [接口数据, 动态数据用function传]
	 * @return   {[null]}                             [无返回]
	 */
	var _bind = function(item, checkFun, apiName, apiData) {
		var count = 0; // 点击次数
		var self = $(item);
		_reset(self);
		self.on('click', function() {
			if (self.hasClass('silver')) { return; }
			if (checkFun()) { return; }
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
			api[apiName](typeof apiData === 'function' ? apiData() : apiData, function(data) {
				$.alert(data.status == 200 ? '验证码发送成功' : data.msg);
			});
		}).removeAttr('data-ident');
	};
	/**
	 * [_scan 扫描]
	 * @Author   张树垚
	 * @DateTime 2016-01-13 11:33:49
	 * @param    {[context]}      context      [jQuery的选择父级]
	 * @return   {[null]}                      [无返回]
	 */
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
						_bind(item, function() {
							return !vm[arr[1]]
						}, 'bankSendCode', function() {
							return {
								gopToken: gopToken,
								bankId: vm[arr[1]]
							}
						});
					}, 300);
				} else if (arr[2] === 'token') { // 根据gopToken --- a|b|token
					_bind(item, function() {
						return !gopToken;
					}, 'phoneSendCode', {
						gopToken: gopToken,
					});
				}
			} else if (arr.length > 1) {
				setTimeout(function() {
					var vm = avalon.vmodels[arr[0]];
					_bind(item, function() {
						return !check.phone(vm[arr[1]] + '').result;
					}, 'sendCode', function() {
						return { phone: vm[arr[1]] };
					});
				}, 300);
			} else {
				var phoneInput = $('#' + arr[0]);
				_bind(item, function() {
					return !h5Check.phone(phoneInput);
				}, 'sendCode', function() {
					return { phone: phoneInput.val() };
				});			
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
					gopToken: gopToken,
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


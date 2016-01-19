
// 张树垚 2016-01-07 18:06:48 创建
// H5微信端 --- dialog-paypass支付浮层


define('h5-dialog-paypass', ['h5-dialog', 'check', 'api', 'h5-paypass'], function(Dialog, check, api) {
	var paypass = new Dialog('paypass');
	var vm = paypass.vm = avalon.define({
		$id: 'dialog-paypass',
		close: function() {
			paypass.hide();
		},
		callback: $.noop, // 下一步
		input: function() {
			var value = this.value;
			if (check.paypassCondition(value)/* && check.paypass(value).result*/) {
				api.checkPayPwd({
					gopToken: $.cookie('gopToken'),
					payPwd: value
				}, function(data) {
					if (data.status == 200) {
						paypass.hide();
						vm.callback(value);
					} else {
						console.log(data);
					}
				});
			}
		}
	});
	var input = $('#dialog-paypass-input');
	paypass.on('show', function() {
		input.get(0).focus();
	});
	paypass.on('hide', function() {
		// 清除input的value并失焦
		input.val('').get(0).blur();
		input.get(0).paypassClear();
	});
	return paypass;
});

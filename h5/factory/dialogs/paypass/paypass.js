
// 张树垚 2016-01-07 18:06:48 创建
// H5微信端 --- dialog-paypass支付浮层


define('h5-dialog-paypass', ['h5-dialog', 'check', 'api', 'h5-paypass'], function(Dialog, check, api) {
	var paypass = new Dialog('paypass');
	var inputTimer = null;
	var vm = paypass.vm = avalon.define({
		$id: 'dialog-paypass',
		close: function() {
			paypass.hide();
		},
		callback: $.noop, // 下一步
		focus: function() { // 获取焦点时
			setTimeout(function() {
				document.body.scrollTop = 0;
			}, 100);
		},
		input: function() { // 输入时
			var value = this.value;
			clearTimeout(inputTimer);
			if (check.paypassCondition(value)/* && check.paypass(value).result*/) {
				inputTimer = setTimeout(function(){
					api.checkPayPwd({
						gopToken: $.cookie('gopToken'),
						payPwd: value
					}, function(data) {
						if (data.status == 200) {
							paypass.hide();
							vm.callback(value);
						} else {
							$.alert(data.msg);
						}
					});
				},500);
			}
		},
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

// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 银行卡信息

define('h5-bankcard-ident', ['api', 'h5-view', 'h5-ident', 'h5-text'], function(api, View) {
	var gopToken = $.cookie('gopToken');
	var bankcard_ident = new View('bankcard-ident');
	var vm = bankcard_ident.vm = avalon.define({
		$id: 'bankcard-ident',
		cardNo: '',
		bankName: '',
		cardTypeStr: '',
		cardType: '',
		checked: true,
		phone: '',
		phoneStr: '',
		identifyingCode: '',
		callback: $.noop,
		bankcard_add_click: function() {
			if (vm.identifyingCode) {
				api.bankcardAdd({
					gopToken: gopToken,
					bankName: vm.bankName,
					cardNo: vm.cardNo,
					bankPhone: vm.phone,
					bankType: vm.cardType,
					identifyingCode: vm.identifyingCode
				}, function(data) {
					if (data.status == 200) {
						$.alert('绑定成功');
						if (vm.callback) {
							vm.callback();
							router.to('/');
						};
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			} else {
				$.alert('请输入验证码');
			}
		}
	});

	return bankcard_ident;
});
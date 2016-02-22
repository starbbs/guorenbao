// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 添加银行卡


define('h5-bankcard-append', ['router', 'api', 'check', 'h5-view', 'h5-bankcard-ident', 'h5-ident', 'h5-text'], function(router, api, check, View, bankcard_ident) {

	var gopToken = $.cookie('gopToken');

	var bankcard_append = new View('bankcard-append');


	var vm = bankcard_append.vm = avalon.define({
		$id: 'bankcard-append',
		cardNo: '',
		bankName: '',
		cardTypeStr: '',
		cardType: '',
		checked: true,
		phone: '',
		phoneStr: '',
		identifyingCode: '',
		callback: $.noop,
		check: function(e) {
			if (check.cardCondition(this.value)) {
				api.checkBankCard({
					bankCard: this.value
				}, function(data) {
					if (data.status == 200) {
						vm.bankName = data.data.bankName;
						vm.cardType = data.data.cardType;
						if (data.data.cardType == 'SAVINGS_DEPOSIT_CARD') {
							vm.cardTypeStr = '储蓄卡';
							var reg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
							if (reg.test(vm.phone)) {
								vm.checked = false;
							} else {
								vm.checked = true;
							}
						} else {
							vm.cardTypeStr = '信用卡';
						}
						$('.banknameAndcardtypestr').text(vm.bankName + 　' ' + 　vm.cardTypeStr);
					} else {
						$('.banknameAndcardtypestr').text('请输入正确的卡号');
						vm.checked = true;
					}
				});
			}
		},
		checkPhone: function(e) {
			var reg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
			if (reg.test(this.value)) {
				vm.checked = false;
				if (vm.cardTypeStr == '信用卡') {
					$.alert('暂时不支持信用卡');
				}
			} else {
				vm.checked = true;
			}
		},
		bankcard_add_next_click: function() {
			if (!vm.checked) {
				$.extend(bankcard_ident.vm, {
					gopToken: gopToken,
					bankName: vm.bankName,
					cardNo: vm.cardNo,
					phone: vm.phone,
					phoneStr: vm.phoneStr,
					cardType: vm.cardType,
					callback: function() {
						vm.callback();
					},
				});
				router.go('/view/bankcard-ident');
			};
		}
	});

	bankcard_append.on('hide', function() {
		vm.cardNo = '';
		vm.phone = '';
		vm.bankName = '';
		vm.cardTypeStr = '';
		$('.banknameAndcardtypestr').text('');
	});

	return bankcard_append;
});
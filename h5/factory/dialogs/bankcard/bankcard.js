
// 张树垚 2016-01-07 16:35:45 创建
// H5微信端 --- dialog-bankcard选择银行卡


define('h5-dialog-bankcard', ['h5-dialog', 'api', 'h5-bank'], function(Dialog, api, bank) {
	var gopToken = $.cookie('gopToken');
	var bankcard = new Dialog('bankcard');
	var vm = bankcard.vm = avalon.define({
		$id: 'dialog-bankcard',
		list: [],
		index: 0,
		check: function(i) { // 选择银行卡
			vm.index = i;
		},
		close: function() {
			bankcard.hide();
		},
		add: function() { // 添加银行卡
			window.location.href = 'bankcard.html';
		}
	});
	avalon.scan(bankcard.native, vm);
	var hasRequest = false;
	bankcard.on('show', function() {
		if (hasRequest && !vm.list.length) { return; }
		api.bankcardSearch({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				vm.list = data.data.list.map(function(item) {
					return {
						id: item.id, //id
						tail: item.cardNo.substr(-4), // 尾号
						name: item.bankName, // 名称
						lang: bank.json[item.bankName], // 英文
						phone: item.bankPhone
					};
				});
			} else {
				$.alert(data.msg);
			}
		});
	});
	return bankcard;
});

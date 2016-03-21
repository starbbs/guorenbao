
// 张树垚 2016-01-07 16:35:45 创建
// H5微信端 --- dialog-bankcard选择银行卡


define('h5-dialog-bankcard', ['h5-dialog', 'api', 'router', 'h5-bank'], function(Dialog, api, router, H5bank) {
	var gopToken = $.cookie('gopToken');
	var bankcard = new Dialog('bankcard');
	var vm = bankcard.vm = avalon.define({
		$id: 'dialog-bankcard',
		list: [],
		index: 0,
		check: function(i) { // 选择银行卡
			vm.index = i;
			vm.id = vm.list[i].id;
			bankcard.hide();
		},
		close: function() {
			bankcard.hide();
		},
		add: function() { // 添加银行卡
			// window.location.href = 'bankcard.html';
			bankcard.hide();
			router.go('/bankcard-append');
		}
	});
	avalon.scan(bankcard.native, vm);
	var hasRequest = false;
	bankcard.on('show', function() {
		console.log(hasRequest, vm.list.length)
		if (hasRequest || vm.list.length) { return; }
		api.bankcardSearch({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				vm.list = H5bank.dataHandler(data.data.list);
			} else {
				$.alert(data.msg);
			}
		});
	});
	return bankcard;
});

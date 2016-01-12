
// 张树垚 2015-09-02 11:22:16 创建
// 选择银行弹窗js

define(['dialog', 'api', 'bank-list'], function(Dialog, api, bankList) {

	var dialogBank = new Dialog('.dialog-bank');

	var vm = dialogBank.vm = avalon.define({
		$id: 'dialog-bank',
		list: [], // 银行列表
		now: 0, // 当前选中银行
		click: function(event, index, item) { // 银行点击
			if (vm.now == index) { return; }
			vm.now = index;
		},
		next: $.noop // 下一步
	});
	avalon.scan(dialogBank.box.get(0), vm);

	dialogBank.beforeShow = function() {
		dialogBank.beforeShow = $.noop;
		api.getAllBankName(function(data) {
			vm.list = data.result.map(function(item) {
				return $.extend(item, bankList[item.bankname]);
			});
		});
	};
	dialogBank.setNext = function(fun) { // 设置下一步
		vm.next = function() {
			fun.call(dialogBank, vm);
		};
	};

	return dialogBank;
});




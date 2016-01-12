
// 张树垚 2015-11-18 17:49:20 创建
// 添加银行卡弹框


define('dialog-bankadd', ['dialog', 'dialog-bank', 'api', 'check'], function(Dialog, dialogBank, api, check) {

	var dialogBankadd = new Dialog('.dialog-bankadd');

	var vm = dialogBankadd.vm = avalon.define({
		$id: 'dialog-bankadd',
		name: '', // 姓名
		personId: '', // 身份证
		bankClass: '', // 银行卡图标class
		cardPlaceholder: '请输入银行卡卡号', // 银行卡输入框占位文字
		card: '', // 输入银行卡号
		phone: '', // 输入手机号
		next: function() { // 下一步点击
			
		},
		back: function() { // 返回选择银行
			dialogBank.show();
		},
	});
	avalon.scan(dialogBankadd.box.get(0), vm);

	// Dialog补充
	dialogBankadd.beforeShow = function() {
		dialogBankadd.beforeShow = null;
		api.getValidateInfo(function(data) {
			switch(data.result) {
				case '成功':
					$.extend(vm, data.data);
					break;
				case '失败':
					dialogBankadd.onFail && dialogBankadd.onFail();
					break;
				default:
					api.log('接口 getValidateInfo 出错');
			}
		});
	};

	// dialogBank补充
	dialogBank.setNext(function(dialogBankVM) {
		dialogBankadd.setBank(dialogBankVM.list[dialogBankVM.now]);
		dialogBankadd.show();
	});

	// 自身独有API
	dialogBankadd.setFail = function(fun) { // 设置未认证时回调
		this.onFail = fun;
	};
	dialogBankadd.setBank = function(now) { // 根据选择银行设置页面
		vm.bankClass = now.className;
		vm.cardPlaceholder = '输入' + (now.name || '银行') + '卡卡号';
	};
	dialogBankadd.setNext = function(fun) { // 设置下一步点击
		vm.next = fun;
	};

	// 测试
	// dialogBankadd.setBank({
	// 	className: "bank-img-youzheng",
	// 	en: "youzheng",
	// 	iconName: "bank-icon-youzheng",
	// 	id: 1,
	// 	name: "邮储银行",
	// });
	// dialogBankadd.show();

	return dialogBankadd;
});

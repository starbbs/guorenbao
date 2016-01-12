
// 张树垚 2015-10-13 17:07:47 创建
// 转账js


require(['dom', 'api', 'router', 'top', 'check', 'payment', 'filters'], function(dom, api, router, top, check, paymentVM) {

	'use strict';

	var alert = api.log; // 覆盖alert

	var subCheck = { // 提交验证
		guo: function(amount) {
			if (!check.number(amount)) {
				alert('输入果仁数有误!');
				return false;
			}
			if (parseFloat(amount) > parseFloat(vm.guo)) {
				alert('输入果仁数超过账户余额');
				return false;
			}
			return true;
		},
		rmb: function(rmb) {
			return true;
		}
	};


	/**
	 * 状态: default, success, error
	 * 有三个公用的属性
	 */
	var vm = avalon.define({
		$id: 'transfer',
	// 页面部分
		guo: 0, // 可用果仁数
		gopPrice: 0, // 果仁汇率
		hasCertified: true, // 是否已认证
		transferFee: '0.00', // 手续费, 单位:G
		amount: '', // [三个公用, 切换时重置]转出果仁数量(双向绑定)
		amountState: 'default', // 转出果仁数量input状态
	// 转账到交易所
		address: '', // 交易所地址(双向)
		getAddress: function() { // 获取交易所地址
			api.getAccountExchangeAddress(function(data) {
				if (data === 'error') { return alert('获取交易所地址出错!'); }
				vm.address = data;
			});
		},
		addressState: 'default', // 交易所验证状态
		checkAddress: function() { // 验证用户交易所信息
			var value = this.value;
			api.verifyAccountExhcangeAddress({
				address: value
			}, function(data) { // 验证用户交易所信息
				if (data === 'error') { return alert('验证用户交易所信息出错!'); }
				vm.addressState = data === 'true' || data === true ? 'success' : 'error';
			});
		},
		toGopExchange: function() {
			var data = {
				amount: '', // 要转账的果仁数量
				address: '', // 目的地址
			};
			// 验证
			// 1. 果仁数
				var amount = vm.amount;
				if (subCheck.guo(amount) === false) { return vm.amountState = 'error'; }
				data.amount = amount;
			// 2. 地址
			if (vm.addressState != 'success') { return vm.addressState = 'error'; }
			data.address = vm.address;
			// 3. 支付密码
			var pvm = paymentVM[0];
			if (pvm.state != 'success') { return pvm.state = 'error'; }
			data.payPass = pvm.paypass;
			// 发送
			api.transferToMyExchangeAccount(data, function(data) {
				switch(data) {
					case 'OK': // 成功
						// blablablabla...
						break;
					case 'login':
					case 'error':
					case 'fail':
					default:
						console.log(data);
						alert('交易失败! 钱包转账出错!');
				}
			});
		},
	// 转账到钱包
		walletType: 1, // 种类: 1.上次应用 2.输入地址
		recentAddress: '', // 钱包最近联系人地址
		recentName: '', // 钱包最近联系人备注名
		walletAddress: '', // 钱包地址(单项绑定)
		walletAddressTip: 'default', // 钱包地址验证状态: default, checked, error (确认转账时验证)
		walletId: '', // 钱包联系人id
		walletAddressFocus: function() {
			if (vm.walletType != 2) { vm.walletType = 2; }
		},
		walletAddressInput: function() {
			vm.walletId = '';
		},
		walletContacts: [], // 所有钱包联系人
		showWalletContacts: function() { // 显示钱包联系人
			if (!vm.walletContacts.length) {
				api.getAllWalletContacts(function(data) {
					if(data === 'error') { return alert('获取钱包联系人出错!'); }
					vm.walletContacts = data;
				});
			}
		},
		toGopWallet: function() { // 钱包转账按钮
			var data = {
				amount: '', // 要转账的果仁数量
				equivalentAmountOfRMB: '', // 相当于人民币的价格
				address: '', // 目的地址
				walletContactId: '', // 目标联系人id
				payPass: '' // 支付密码
			};
			// 验证
			// 1. 果仁数
				var amount = vm.amount;
				if (subCheck.guo(amount) === false) { return; }
				data.amount = amount;
			// 2. 人民币价格
				var rmb = avalon.filters.guo(amount);
				if (subCheck.rmb(rmb) === false) { return; }
				data.equivalentAmountOfRMB = rmb;
			// 3. 目的id或地址
				if (vm.walletType === 1) { // 上次应用
					data.address = recentAddress;
					data.walletContactId = '';
				} else if (vm.walletType === 2) { // 输入地址
					var id = vm.walletId;
					if(!id) {
						data.address = vm.walletAddress;
						data.walletContactId = '';
					} else {
						data.address = '';
						data.walletContactId = id;
					}
				}
			// 4. 支付密码
			data.payPass = vm.payPass;
			// 发送
			api.transferToGOPWallet(data, function(data) {
				switch(data) {
					case 'OK': // 成功
						// blablablabla...
						break;
					case 'login':
					case 'error':
					case 'fail':
					default:
						console.log(data);
						alert('交易失败! 钱包转账出错!');
				}
			});
		},
	// 转账到官网
		note: '', // 转账说明
		phone: '', // 转账收款人(单向绑定)
		phoneInput: function() { // 收款人输入(不限制文字, 如果输入id清零)
			vm.siteId = '';
		},
		siteId: '', // 收款人id
		contacts: [], // 官网联系人
		contactsClick: function(contact) { // 联系人点击
			// contact = {
			// 	"comm": "我是注释",
			// 	"contact": "1111*2222",
			// 	"id": 23,
			// 	"realName": "*雨"
			// }
			// vm.phone = '*伊莎 （138****1326）';
			vm.phone = (contact.comm || contact.realName) + ' （' + contact.contact + '）';
			vm.siteId = id;
		},
		showContacts: function() { // 显示联系人
			if (!vm.contacts.length) {
				api.getAllGopSiteContacts(function(data) {
					if(data === 'error') { return alert('获取钱包联系人出错!'); }
					vm.contacts = data;
				});
			}
			// $().fadeIn();
		},
		toGopSite: function() { // 官网转账
			var data = {
				amount: '', // 要转账的果仁数量
				equivalentAmountOfRMB: '', // 相当于人民币的价格
				phone: '', // 对方手机号
				gopsiteContactId: '', // 联系人id(与手机号只传一个即可)
				note: '', // 附带消息
				payPass: '' // 验证码(暂时不用)
			};
			// 验证
			// 1. 果仁数
				var amount = vm.amount;
				if (subCheck.guo(amount) === false) { return; }
				data.amount = amount;
			// 2. 人民币价格
				var rmb = avalon.filters.guo(amount);
				if (subCheck.rmb(rmb) === false) { return; }
				data.equivalentAmountOfRMB = rmb;
			// 3. id或手机号
				var id = vm.siteId;
				var phone = vm.phone;
				if (!id) { // 用手机号
					data.gopsiteContactId = '';
					if (!check.phone) {
						return alert('请输入争取的手机号码!');
					}
					data.phone = phone;
				} else { // 用id
					data.gopsiteContactId = id;
					data.phone = '';
				}
			// 4. 附带消息
			data.note = vm.note;
			// 5. 支付密码
			data.payPass = vm.payPass;
			// 发送
			api.transferToGOPSiteAccount(data, function(data) {
				switch(data) {
					case 'OK': // 交易成功
						// blablabla...
						break;
					case 'wrong password': // 密码错误
						alert('交易失败! 交易密码错误!');
						break;
					case 'target phone is not exist in GOPsite': // 账号错误
						alert('交易失败! 您输入的账号不存在!');
						break;
					case 'insufficient balance':
						alert('交易失败! 账户余额不足!')
						break;
					case 'login': // 登录过期
					default:
						console.log(data);
						alert('交易失败! 官网转账出错!');
				}
			});
		}
	});
	avalon.scan();
	setTimeout(function() {
		$('.transfer').animate({opacity: 1}, 300);
	}, 17);

	(function() { // 路由操作
		var $transferTab = $('.transfer-tab');
		var tabHeadHeight = $('.transfer-tab-head').get(0).offsetHeight;
		var tabIndex = -1;
		var tabNow = null;
		var tabTime = 400;
		router.get('/tab/:num', [[0, 1, 2]], function(num) {

		// 切换tab
			num = parseInt(num);
			tabIndex = num;
			tabNow = $transferTab.removeClass('on').stop().animate({height: tabHeadHeight}, tabTime).eq(tabIndex).addClass('on');
			tabNow.stop().animate({height: tabNow.get(0).scrollHeight}, tabTime);

		// vm重置
			vm.amount = '';
			vm.payPass = '';
			vm.checkPayTip = 'default';
		});
		router.init();
		setTimeout(function() {
			if (tabIndex === -1) {
				router.go('/tab/0');
			}
		}, 300);
	})();

	(function() { // 进入页面
		api.now(function(data) {
			vm.gopPrice = data.gopPrice;
		});
		api.getAccountGopNum(function(data) { // 获取果仁数量
			if (data === 'error') { return alert('获取果仁数量出错!'); }
			vm.guo = parseFloat(data);
		});
		api.isAuthenticatedUser(function(data) { // 获取认证信息
			if (data === 'error') { return alert('获取认证信息出错!'); }
			vm.hasCertified = data === 'true' || data === true ? true : false;
		});
		api.getTransferFee(function(data) { // 获取手续费
			if (data === 'error') { return alert('获取手续费出错!'); }
			vm.transferFee = parseFloat(data).toFixed(2);
		});
		api.getRencentlyWalletContact(function(data) { // 获取钱包最近联系人信息
			if (data === 'error') { return alert('获取钱包最近联系人信息出错!'); }
			vm.recentAddress = data.contact || '';
			vm.recentName = data.account || data.aliasname || '';
		});
		console.log(paymentVM)
		paymentVM.init();
	})();
});

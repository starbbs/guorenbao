

// 张树垚 2015-08-19 09:56:33 创建
// 果仁宝 买入js



require(['dom', 'api', 'router', 'top', 'check', 'bank-list', 'dialog', 'payment', 'dialog-bank', 'dialog-bankadd', 'hchart', 'filters'], function(dom, api, router, top, check, bankList, Dialog, paymentVM, dialogBank, dialogBankadd) {

	var vm = avalon.define({
		$id: 'recharge',
		router: '', // 路由控制
	// 实名认证弹层
		identifyOpen: function() { // 打开弹层
			dialogIdentify.show();
		},
		identifyNext: function() { // 下一步
			var $name = $('#identify-name');
			var $idcard = $('#identify-idcard');
			var name = $name.val();
			var idcard = $idcard.val();
			if (!check.realname(name)) {
				return $name.addClass('error');
			}
			if (!check.idcard(idcard)) {
				return $idcard.addClass('error');
			}
			// api.savePersonInfo({
			// 	realName: name,
			// 	personId: idcard
			// }, function(data) {
				data = {
					"data": {
						"personId": "3****************5",
						"realName": "张三"
					},
					"result": "成功"
				};
				if (data.result === '成功') {
					vm.name = data.data.realName;
					vm.personId = data.data.personId;
					dialogBank.show();
				} else if (data.result === '失败') {
					alert(data.reason);
				} else {
					console.log(data);
				}
			// });
		},
	// 选择银行弹层
		bankOpen: function() { // 打开弹层
			dialogBank.show();
		},
	// 添加银行卡弹层 -- 插件中
	// 失败弹层
		failReason: '',
	// 买入页面(下一步)
		gopPrice: 0, // 当前果仁市价
		money: '', // 充值金额
		quickList: [], // 快捷支付
		quickIndex: 0,
		name: '', // 名字
		personId: '', // 人的ID
		phone: '', // 电话
		quickId: '', // 电话的ID
		quickClick: function(ev, index, quick) { // 快捷支付银行点击
			var $this = $(this);
			vm.quickIndex = index;
			vm.phone = quick.phone;
			vm.quickId = quick.id;
		},
	// 验证码
		identState: 0, // 验证码发送 0:未发送, 1:发送中, 2:填写正确, 3:填写错误, 4:已发送, 5:其他
		identSend: function() { // 点击发送
			if (!vm.phone) { return; }
			if (vm.identState === 0 || vm.identState === 4) {
				vm.identState = 1;
				var self = $(this);
				var html = self.html();
				var second = 60;
				var count = function() {
					self.html(second + '秒后重新发送');
					second--;
					if (second < 0) {
						clearInterval(timer);
						self.html(html);
						vm.identState = 4;
					}
				};
				var timer = setInterval(count, 1000);
				count();
				api.sendPhoneSeccode({
					id: vm.quickId
				}, function(data) {
					if (data === '成功') {
						vm.token = data.token;
					} else {
						alert(data.reason);
					}
				});
			}
		},
		identInput: function() { // 输入
			var value = this.value;
			vm.identNextable = false;
			if (value.length === 4) {
				api.checkPhoneSeccode({
					id: vm.quickId,
					seccode: value,
					token: vm.token
				}, function(data) {
					if (data.result === '成功') {
						vm.identNextable = true;
					} else {
						alert(data.reason);
					}
				});
			}
		},
		identNextable: false, // 下一步能否点击
		identNext: function() {
			if (!identNextable) { return; }
			getGopPrice();
			api.createBuyOrderInfo({
				id: vm.quickId,
				totalMoney: vm.money
			}, function(data) {
				vm.orderId = data.orderId;
				if (data.result === '成功') {
					// 下一页
				} else {
					alert(data.reason);
				}
			});
		},
	// 确认支付
		orderId: '', // 订单号
		confirm: function() {}
	});
	avalon.scan();

	function getGopPrice() {
		api.now(function(data) {
			vm.gopPrice = data.gopPrice;
		});
	}
	getGopPrice();
	// api.total(function(data) {
	// 	vm.totalAmout = data.totalAmout;
	// });

	api.getWithdrawInfo(function(data) {
		data.list = data.list || [];
		vm.quickList = data.list.map(function(item) {
			return $.extend(item, bankList[item.bankname]);
		});
		vm.name = data.name || '';
		vm.personId = data.personId || '';
		vm.quickIndex = 0;
		vm.phone = data.list.length ? data.list[0].phone : '';
		vm.quickId = data.list.length ? data.list[0].id : '';
	});


	var dialogIdentify = new Dialog('.dialog-identify');
	// var dialogBank = new Dialog('.dialog-bank');
	// var dialogBankadd = new Dialog('.dialog-bankadd');
	var dialogFail = new Dialog('.dialog-fail');
	dialogBankadd.setNext(function() {
		var $card = $('#dialog-bankadd-card');
		var $phone = $('#dialog-bankadd-phone');
		var card = $card.val();
		var phone = $phone.val();
		if (!check.card(card)) {
			return $card.addClass('error');
		}
		if (!check.phone(phone)) {
			return $phone.addClass('error');
		}
		api.addBankCard({
			bankname: vm.bankList[vm.bankNow].name,
			cardno: card,
			phone: phone
		}, function(data) {
			data = {
				result: '成功',
				data: {
					"bankname": "中国银行",
					"cardno": "**5452",
					"id": "18",
					"phone": "158****3058"
				}
			};
			if (data.result === '成功') {
				vm.quickList.push($.extend(data.data, bankList[data.data.bankname]));
				vm.phone = data.data.phone;
				vm.quickId = data.data.id;
				dialogBankadd.hide(true);
			} else if (data.result === '失败') {
				alert(data.reason);
			} else {
				console.log(data);
			}
		});
	});


	var $check = $('.recharge-check');
	var $confirm = $('.recharge-confirm');
	var $result = $('.recharge-result');
	router.get('/:page/:desp', [['check', 'confirm', 'result'], 'all'], function(page, desp) {
		// 页面, 描述
		vm.router = '/' + page + '/' + desp;
		if (page === 'check') {
			$check.fadeIn(300).siblings().hide();
		} else if (page === 'confirm') {
			var now = vm.quickList[vm.quickIndex]; // 当前快捷支付
			if (!now) {
				router.go('/check/0');
				return;
			}
			$('#confirm-bank-img').get(0).className = now.className;
			$('#confirm-bank-num').html(now.cardno);
			$confirm.fadeIn(300, function() {
				paymentVM.init();
			}).siblings().hide();
		} else if (page === 'result') {
			vm.orderId = desp;
			api.viewResult({
				orderId: desp
			}, function(data) {
				$result.fadeIn(300).siblings().hide();
				switch(data.result) {
					case '成功': // 成功弹层
						break;
					case '失败': // 失败弹层
						break;
					case '进行中': // 成功弹层(进行中)
						break;
					case '不存在': // 跳回买入首页
						alert('您所查询的订单不存在!');
						router.go('/check/0');
						break;
					default:
						alert('请求出错! 请重新刷新页面!');
				}
			});
		} else {
			router.go('/check/0');
		}
	});
	router.init();

	setTimeout(function() {
		if (!vm.router) {
			router.go('/check/0');
		}
	}, 300);

});











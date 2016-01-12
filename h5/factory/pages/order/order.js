
// 张树垚 2016-01-09 14:29:10 创建
// H5微信端 --- 订单


require(['api', 'get', 'router', 'h5-view', 'h5-price', 'h5-bank', 'h5-ident'], function(api, get, router, View, price, H5Bank, H5Ident) {

	router.init();

	var main = $('.order');
	var gopToken = $.cookie('gopToken');
	var viewBill = new View('order-bill');

	var status = {
		PROCESSING: '进行中',
		SUCCESS: '交易成功',
		FAILURE: '交易失败',
		CLOSE: '交易关闭'
	};
	var statusClass = {
		PROCESSING: 'going',
		SUCCESS: 'success',
		FAILURE: 'fail',
		CLOSE: 'close'
	};

	var vm = avalon.define({
		$id: 'order',
		money: 0, // 总金额
		phone: '', // 要发送验证码的电话
		productDesc: '', // 订单内容
		productRealPrice: 0, // 真实价格
		gopPrice: 0, // 果仁实时价
		gopNum: 0, // 果仁数
		gopIfUse: true, // 使用果仁数
		gopUse: 0, // 使用多少果仁
		gopClick: function() { // 果仁点击
			vm.gopIfUse = !vm.gopIfUse;
			if (vm.gopIfUse) {
				vm.gopExchange();
			} else {
				vm.rmbUse = vm.money;
			}
		},
		gopMoney: 0,
		gopExchange: function() { // 换算gopMoney
			if (vm.gopNum * vm.gopPrice >= vm.money) { // 够支付
				vm.rmbUse = 0;
				vm.gopUse = vm.money / vm.gopPrice;
				vm.gopMoney = vm.money;
			} else {
				vm.rmbUse = vm.money - vm.gopNum * vm.gopPrice;
				vm.gopUse = vm.gopNum;
				vm.gopMoney = vm.gopNum * vm.gopPrice;
			}
		},
		rmbUse: 0, // 使用多少人民币
		bankList: [], // 银行卡列表
		bankSelect: {}, // 选择银行卡
		bankIndex: 0, // 选择银行卡
		bankid: 0, // 银行卡ID
		bankAdd: function() { // 添加银行卡

		},
		identInput: function() { // 验证码输入
			vm.ifConfirmPay = false;
			H5Ident.bankCheck(vm.bankid, $('#order-ident'), function() {
				vm.ifConfirmPay = true;
			});
		},
		ifConfirmPay: false,
		confirmPay: function() { // 确认支付
			if (!vm.ifConfirmPay) { return; }
		}
	});
	avalon.scan();

	if (get.data.id) { // 有订单ID, 跳转订单详情
		api.query({
			gopToken: gopToken,
			consumeOrderId: get.data.id
		}, function(data) {
			if (data.status == 200) {
				var order = data.data.consumeOrder; // 订单信息
				var product = data.data.product; // 产品信息
				if (order.status === 'PROCESSING') {
					router.go('/');
					vm.productDesc = product.productDesc;
					vm.money = order.orderMoney;
					vm.gopPrice = data.data.gopPrice;
					vm.gopNum = data.data.gopNum;
					// vm.gopNum = 20;
					vm.productRealPrice = JSON.parse(product.extraContent).price;
					vm.gopExchange();
					if (Array.isArray(data.data.bankCardList)) {
						vm.bankList = data.data.bankCardList.map(function(item) {
							item.className = H5Bank.json[item.bankName];
							item.type = H5Bank.type[item.cardType];
							item.tail = item.cardNo.substr(-4);
							return item;
						});
						vm.bankSelect = $.extend({}, vm.bankList.$model[vm.bankIndex]);
						vm.bankid = vm.bankSelect.id;
					}
					setTimeout(function() {
						main.addClass('on');
					}, 200);
					price.onChange = function(next) {
						vm.gopPrice = next;
						vm.gopExchange();
					};
					price.get();
				} else {
					router.go('/view/order-bill');
				}
			} else {
				$.alert(data.msg);
			}
		});
	} else {
		$.alert('缺少订单号');
	}

	switch(get.data.from) { // 判断来源

		case 'phonecharge': // 来自手机充值
			break;

		case 'loverelay': // 来自爱心接力
			break;

		default: // 无来源
	}
});



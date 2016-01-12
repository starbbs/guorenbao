
// 张树垚 2016-01-04 17:34:09 创建
// H5微信端 --- 买果仁


require(['router', 'h5-view', 'h5-dialog-bankcard', 'h5-price', 'h5-weixin', 'api', 'h5-text', 'h5-ident'], function(router, View, dialogBankcard, price, weixin, api) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var viewOrder = new View('purchase-order');
	var viewBill = new View('purchase-bill');

	var statusClass = {
		SUCCESS: 'success',
		FAILURE: 'fail',
		PROCESSING: 'going'
	};
	var statusContent = {
		SUCCESS: '交易成功',
		FAILURE: '交易失败',
		PROCESSING: '交易进行中'
	};

	var main = $('.purchase');
	var vm = avalon.define({
		$id: 'purchase',
		price: 0,
		money: '',
		moneyClear: function() {
			vm.money = '';
		},
		buy: function() {
			var self = $(this);
			if (self.hasClass('disabled')) { return; }
			self.addClass('disabled');
			api.createBuyinOrder({ // 创建买入订单
				gopToken: gopToken,
				orderMoney: vm.money,
				payType: 'WEIXIN_MP_PAY'
			}, function(data) {
				if (data.status == 200) {
					vmOrder.gopNum = data.data.buyinOrder.gopNum;
					vmOrder.price = data.data.buyinOrder.price;
					vmOrder.orderMoney = data.data.buyinOrder.orderMoney;
					vmOrder.click = function() {
						wx.chooseWXPay({ // 微信支付
							timestamp: data.data.WEIXIN_MP_PAY.timeStamp.replace(/s/g, 'S'), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: data.data.WEIXIN_MP_PAY.nonceStr, // 支付签名随机串，不长于 32 位
							package: data.data.WEIXIN_MP_PAY.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
							signType: data.data.WEIXIN_MP_PAY.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: data.data.WEIXIN_MP_PAY.paySign, // 支付签名
							success: function(res) {
								// 支付成功后的回调函数
								api.queryBuyinOrder({ // 买入订单详情
									gopToken: gopToken,
									buyinOrderId: data.data.buyinOrder.id,
									payType: 'WEIXIN_MP_PAY'
								}, function(data) {
									var order = data.data.buyinOrder;
									vmBill.status = order.status;
									vmBill.headClass = statusClass[order.status];
									vmBill.headContent = statusContent[order.status];
									vmBill.gopNum = order.gopNum ? order.gopNum : '';
									vmBill.failReason = order.status === 'FAILURE' ? order.payResult : '';
									vmBill.money = order.status === 'FAILURE' ? order.orderMoney : order.payMoney;
									vmBill.price = order.price;
									vmBill.createTime = order.createTime;
									vmBill.order = order.orderCode;
									vmBill.flowId = order.serialNum;
									setTimeout(function() {
										router.go('/view/purchase-bill');
									}, 100);
								});
							}
						});
					};
					setTimeout(function() {
						router.go('/view/purchase-order');
					}, 100);
				} else {
					$.alert(data.msg);
					console.log(data);
				}
			});
		}
	});
	var vmOrder = avalon.define({
		$id: 'purchase-order',
		gopNum: 0,
		price: 0,
		orderMoney: 0,
		click: $.noop
	});
	var vmBill = avalon.define({
		$id: 'purchase-bill',
		status: '',				// 订单状态
		headClass: '',			// 头部对应class
		headContent: '',		// 头部对应文字
		gopNum: 0,				// 交易果仁数
		failReason: '',			// 失败原因
		money: 0,				// 交易金额
		price: 0,				// 果仁兑换价
		createTime: '',			// 创建时间
		orderId: 0,				// 订单号
		flowId: '',				// 流水号
		finish: function() {	// 完成
			window.location.href = 'home.html';
		},
		rePay: function() {		// 重新支付
			window.history.back();
		}
	});
	avalon.scan();

	price.onFirstChange = price.onChange = function(next) {
		vm.price = next;
	};
	price.get();

	setTimeout(function() {
		main.addClass('on');
	}, 200);

	return;
});


// 张树垚 2016-01-04 17:34:09 创建
// H5微信端 --- 买果仁


require(['router', 'h5-view', 'h5-dialog-bankcard', 'h5-price', 'h5-weixin', 'api', 'check', 'h5-view-bill','h5-text', 'h5-ident', 'h5-weixin','h5-component-keyboard'
], function(router, View, dialogBankcard, price, weixin, api, check, billView) {

	router.init(true);

	var gopToken = $.cookie('gopToken');

	var viewOrder = new View('purchase-order');

	var wxPayOptions = { // 微信支付设置
		timestamp: '', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		nonceStr: '', // 支付签名随机串，不长于 32 位
		package: '', // 统一支付接口返回的prepay_id参数值，提交格式如:prepay_id=***）
		signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
		paySign: '', // 支付签名
		success: function(res) { // 成功
			price.stop();
			billView.set('BUY_IN', vmOrder.id, {
				forceStatus: 'SUCCESS',
				ifFinishButton: true
			});
			router.to('/view/bill');
		},
		fail: function(res) { // 失败
			alert('微信支付失败:\n' + JSON.stringify(res) + '\n请截图发送给开发人员, 谢谢!');
		},
		cancel: function(res) { // 取消
		},
		trigger: function(res) { // 菜单点击
		},
		complete: function(res) { // 完成
		},
	};

	var main = $('.purchase');

	var vm = avalon.define({ // 主页面
		$id: 'purchase',
		price: 0, // 果仁实时价
		money: '', // 买入金额
		ifBuy: false, // 是否可购买
		expect: '', // 预计购买
		moneyClear: function() {
			vm.money = '';
		},
		buy: function() { // 买入
			if (!vm.ifBuy) {
				return;
			}
			vm.ifBuy = false;
			api.createBuyinOrder({ // 创建买入订单
				gopToken: gopToken,
				orderMoney: $('#purchase-main-money').val(),
				payType: 'WEIXIN_MP_PAY'
			}, function(data) {
				vm.money = '';
				if (data.status == 200) {
					var order = data.data.buyinOrder;
					var pay = data.data.WEIXIN_MP_PAY;
					vmOrder.orderMoney = order.orderMoney;
					vmOrder.id = order.id;
					setOrderNum();
					$.extend(wxPayOptions, {
						timestamp: pay.timeStamp,
						nonceStr: pay.nonceStr,
						package: pay.package,
						signType: pay.signType,
						paySign: pay.paySign,
					});
					setTimeout(function() {
						router.go('/view/purchase-order');
					}, 100);
				} else {
					$.alert(data.msg);
					console.log(data);
				}
			});
		},
		gopBuyValidate: function() {
			vm.ifBuy = check.gopBuyValidate(this.value, vm.price);
			vm.expect = this.value ? 'G ' + (this.value / vm.price).toFixed(2) : '';
		},
	});
	var vmOrder = avalon.define({ // 订单页面
		$id: 'purchase-order',
		id: 0, // 订单ID
		gopNum: 0, // 买入果仁数
		price: 0, // 实时价
		orderMoney: 0, // 订单金额
		click: function() { // 下一步
			// alert(JSON.stringify(wxPayOptions));
			wx.chooseWXPay(wxPayOptions);
		},
	});
	var setOrderNum = function() {
		vmOrder.gopNum = Math.round(vmOrder.orderMoney / vmOrder.price * 100) / 100;
	};

	avalon.scan();

	price.onFirstChange = price.onChange = function(next) {
		vm.price = vmOrder.price = next;
		setOrderNum();
	};
	price.get();

	setTimeout(function() {
		main.addClass('on');
	}, 200);
});
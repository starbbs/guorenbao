// 张树垚 2016-01-04 17:34:09 创建
// H5微信端 --- 买果仁


require(['router', 'h5-view', 'h5-dialog-bankcard', 'h5-price', 'h5-weixin', 'api', 'check', 'h5-view-bill' ,
	'h5-text', 'h5-ident', 'h5-weixin'], function(router, View, dialogBankcard, price, weixin, api, check, billView) {

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
			billView.set('BUY_IN', vmOrder.id);
			billView.showFinish();
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
		}
	};

	var main = $('.purchase');
	var vm = avalon.define({ // 主页面
		$id: 'purchase',
		price: 0,
		money: '',
		ifBuy: false,
		expect: '',
		ifBottomShow: true,
		focus: function(){
			vm.ifBottomShow = false;
		},
		blur: function(){
			vm.ifBottomShow = true;
		},
		moneyClear: function() {
			vm.money = '';
		},
		buy: function() {
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
					vmOrder.orderMoney = order.orderMoney;
					vmOrder.id = order.id;
					setOrderNum();
					$.extend(wxPayOptions, data.data.WEIXIN_MP_PAY);
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
			console.log('gopBuyValidate');
			vm.ifBuy = check.gopBuyValidate(this.value, vm.price);
			vm.expect = this.value ? 'G ' + (this.value / vm.price).toFixed(2) : '';
		}
	});
	var vmOrder = avalon.define({ // 订单页面
		$id: 'purchase-order',
		id: 0, // 订单ID
		gopNum: 0, // 买入果仁数
		price: 0, // 实时价
		orderMoney: 0, // 订单金额
		click: function() { // 下一步
			wx.chooseWXPay(wxPayOptions);
		}
	});
	var setOrderNum = function() {
		vmOrder.gopNum = Math.round(vmOrder.orderMoney / vmOrder.price * 100) / 100;
	};
	/*var vmBill = avalon.define({ // 账单页面
		$id: 'purchase-bill',
		status: '', // 订单状态
		headClass: '', // 头部对应class
		headContent: '', // 头部对应文字
		gopNum: 0, // 交易果仁数
		failReason: '', // 失败原因
		money: 0, // 交易金额
		price: 0, // 果仁兑换价
		createTime: '', // 创建时间
		orderId: 0, // 订单号
		flowId: '', // 流水号
		finish: function() { // 完成
			window.location.href = 'home.html';
		},
		repay: function() { // 重新支付
			window.history.back();
		}
	});*/
	avalon.scan();

	price.onFirstChange = price.onChange = function(next) {
		vm.price = vmOrder.price = next;
		setOrderNum();
	};
	price.get();

	setTimeout(function() {
		main.addClass('on');
	}, 200);

	return;
});
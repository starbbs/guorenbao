
// 张树垚 2016-02-24 16:16:44 创建
// H5微信端 --- view-bill 账单详情分页


define('h5-view-bill', ['h5-view', 'api', 'h5-component-bill'], function(View, api, H5bill) {
	var _forceStatus = '';
	var gopToken = $.cookie('gopToken');
	var bill = new View('bill');
	var main = $('.bill');
	var initOptions = { // 初始化
		id: '', // 账单ID
		type: '', // 类型
		status: '', // 订单状态
		headClass: '', // 头部样式名
		headContent: '', // 头部内容
		waitForPay: false, // 等待支付
		gopNum: 0, // 买果仁--果仁数
		gopPrice: 0, // 买果仁--成交价
		buyMoney: 0, // 买果仁--支付金额
		failReason: '', // 失败原因
		closeReason: '', // 关闭原因
		orderMoney: 0, // 订单金额
		payMoney: 0, // 消费--支付金额
		payGop: 0, // 消费--支付果仁数
		productDesc: '', // 商品信息
		orderTime: '', // 交易时间
		createTime: '', // 创建时间
		orderCode: '', // 订单号
		serialNum: '', // 流水号
		payType: '', // 支付方式
		ifFinishButton: false, // 是否显示"完成"按钮
		ifPayButton: false, // 是否显示"前往支付"按钮
		ifRePayButton: false, // 是否显示"重新支付"按钮
		ifShowMore: false, // 是否显示"更多"
		ifClose: false, // 是否显示"关闭"
	};
	var vm = avalon.define($.extend({ // 账单vm
		$id: 'bill',
		finish: function() { // 完成 -- 完成按钮只有在买果仁流程的最后一步会显示
			bill.onFinish();
			router.go('/');
		},
		gotoPay: function() { // 前往支付
			if (bill.onGotoPay() === false) {

			} else {
				window.location.href = './order.html?from=bill&id=' + vm.id;
			}
		},
		showMore: function() { // 更多
		},
		close: function() { // 关闭订单
			switch(vm.type) {
				case 'BUY_IN': // 关闭买果仁
					api.closeBuyinOrder({
						gopToken: gopToken,
						buyinOrderId: vm.id
					}, function(data) {
						if (data.status == 200) {
							$.alert('关闭成功');
							buyInHandler(vm.type, vm.id, 'BUY_IN');
						}
					});
					break;
				case 'PAY': // 关闭消费果仁
					api.closeConsumeOrder({
						gopToken: gopToken,
						consumeOrderId: vm.id
					}, function(data) {
						if (data.status == 200) {
							$.alert('关闭成功');
							consumeHandler(vm.type, vm.id, 'PAY');
						}
					});
					break;
			}
		},
	}, initOptions));
	avalon.scan(main.get(0), vm);
	var vmSet = function(options) { // 设置账单vm
		return $.extend(vm, initOptions, options);
	};
	var set = function(type, id) { // 设置账单, 分流 -- 不做view显示
		type = (type + '').toUpperCase();
		switch (type) {
			case 'TRANSFER_OUT': // 转账, 转出
				transferOutHandler(type, id, 'TRANSFER_OUT');
				break;
			case 'TRANSFER_IN': // 转账, 转入
				transferInHandler(type, id, 'TRANSFER_IN');
				break;
			case 'BUYIN_ORDER': // 买入, 消息
			case 'BUY_IN': // 买入, 列表
				buyInHandler(type, id, 'BUY_IN');
				break;
			case 'CONSUME_ORDER': // 消费, 消息
			case 'PAY': // 消费, 列表
				consumeHandler(type, id, 'PAY');
				break;
			default:
				$.alert('未知类型的账单<br>值为 ' + type);
		}
	};

	// 数据处理
	var buyInHandler = function(type, id, name) { // 买入
		api.queryBuyinOrder({
			gopToken: gopToken,
			buyinOrderId: id,
			payType: 'WEIXIN_MP_PAY'
		}, function(data) {
			if (!data.data || !data.data.buyinOrder) {
				return;
			}
			var order = data.data.buyinOrder; // 订单
			var list = data.data.recordList; // 支付
			var waitForPay = (order.status = _forceStatus || order.status) == 'PROCESSING' && (!list || !list.length);
			vmSet({
				id: id, // 账单ID
				type: type, // 类型
				status: order.status, // 订单状态
				headClass: H5bill.statusClass[order.status], // 头部样式名
				headContent: H5bill.statusZhCN[order.status], // 头部内容
				waitForPay: waitForPay, // 等待支付
				gopNum: order.gopNum, // 买果仁--果仁数
				gopPrice: order.price, // 买果仁--成交价
				buyMoney: order.payMoney, // 买果仁--支付金额
				failReason: order.status == 'FAILURE' ? order.payResult : '', // 失败原因
				closeReason: order.status == 'CLOSE' ? order.payResult : '', // 关闭原因
				orderMoney: order.orderMoney, // 订单金额
				productDesc: order.businessDesc, // 商品信息
				orderTime: order.orderTime, // 交易时间
				createTime: order.createTime, // 创建时间
				orderCode: order.orderCode, // 订单号
				serialNum: order.serialNum, // 流水号
				payType: H5bill.payType[order.payType], // 支付方式
				ifPayButton: waitForPay, // 是否显示"前往支付"按钮
				ifClose: waitForPay, // 是否显示"关闭"
			});
		});
	};
	var consumeHandler = function(type, id, name) { // 消费
		api.query({
			gopToken: gopToken,
			consumeOrderId: id
		}, function(data) {
			if (!data.data || !data.data.consumeOrder) {
				return;
			}
			var order = data.data.consumeOrder;
			var list = data.data.recordList;
			var product = data.data.product;
			var waitForPay = (order.status = _forceStatus || order.status) == 'PROCESSING' && (!list || !list.length);
			var payMoney, payGop;
			if (order.status == 'SUCCESS' && list && list.length) {
				list.forEach(function(item) {
					item.payMoney && (payMoney = item.payMoney);
					item.payGop && (payGop = item.payGop);
				});
			}
			vmSet({
				id: id, // 账单ID
				type: type, // 类型
				status: order.status, // 订单状态
				headClass: H5bill.statusClass[order.status], // 头部样式名
				headContent: H5bill.statusZhCN[order.status], // 头部内容
				waitForPay: waitForPay, // 等待支付
				// gopNum: order.gopNum, // 买入果仁数
				// gopPrice: order.price, // 买入果仁成交价
				failReason: order.status == 'FAILURE' ? order.payResult : '', // 失败原因
				closeReason: order.status == 'CLOSE' ? order.payResult : '', // 关闭原因
				orderMoney: order.orderMoney, // 订单金额
				payMoney: payMoney, // 支付金额
				payGop: payGop, // 支付果仁数
				productDesc: product.productDesc, // 商品信息
				orderTime: order.orderTime, // 交易时间
				createTime: order.createTime, // 创建时间
				orderCode: order.orderCode, // 订单号
				serialNum: order.serialNum, // 流水号
				payType: H5bill.payType[order.payType], // 支付方式
				ifFinishButton: false, // 是否显示"完成"按钮
				ifPayButton: waitForPay, // 是否显示"前往支付"按钮
				ifRePayButton: order.status == 'FAILURE', // 是否显示"重新支付"按钮
				ifClose: waitForPay, // 是否显示"关闭"
			});
		});
	};
	var transferInHandler = function(type, id, name) { // 转入
		api.transferInQuery({
			gopToken: gopToken,
			transferInId: id
		}, function(data) {
			/*{
				"data": {
					"transferIn": {
						"transferTime": "2016-01-04 17:58:15",
						"transferAddress": "uga000000",
						"id": 11,
						"gopNum": 0.010000,
						"userId": 23,
						"status": "SUCCESS",
						”personId”: 111,
						”transContent”: ”转账说明”
					}
				},
				"msg": "success",
				"status": "200"
			}*/
			console.log(data);
			vmSet();
		});
	};
	var transferOutHandler = function(type, id, name) { // 传出
		api.transferQuery({
			gopToken: gopToken,
			transferOutId: id
		}, function(data) {
			/*{
				"data": {
					"transferOut": {
						"serviceFee": 0.010000,
						"address": "asdfghjkl",
						"updateTime": "2015-12-09 12:12:12",
						"type": "ME_WALLET",
						"gopNum": 12.340000,
						"userId": 26,
						"createTime": "2015-09-10 09:12:26",
						"phone": "13146556570",
						"transContent": "(づ￣3￣)づ╭?～",
						"personId": 1,
						"walletId": 1,
						"id": 1,
						"failureMsg": "还不知道失败原因",
						"status": "PROCESSING"
					}
				},
				"msg": "success",
				"status": "200"
			}*/
			console.log(data);
			vmSet();
		});
	};

	return $.extend(bill, {
		forceStatus: function(status) {
			_forceStatus = status;
		},
		set: set, // 设置账单
		vm: vm, // 账单vm(不建议暴露)
		showFinish: function(status) { // 是否显示"完成"
			if (!arguments.length) {
				status = true;
			}
			vm.ifFinishButton = status;
		},
		showMore: function(status) { // 是否显示"更多"
			if (!arguments.length) {
				status = true;
			}
			vm.ifShowMore = status;
		},
		onFinish: $.noop, // 点击完成时
		onGotoPay: $.noop, // 点击支付时(可 return false 取消默认)
	});
});

// 张树垚 2016-01-13 10:25:30 创建
// H5微信端 --- component-status 订单相关


define('h5-component-bill', function() {
	var bill = {
		statusClass: { // 订单状态对应class名称
			PROCESSING: 'going',
			SUCCESS: 'success',
			FAILURE: 'fail',
			CLOSE: 'close',
		},
		statusBusiness: { // 交易状态对应中文
			PROCESSING: '进行中',
			SUCCESS: '交易成功',
			FAILURE: '交易失败',
			CLOSE: '已关闭',
		},
		statusTransfer: {
			PROCESSING: {
				TRANSFER_IN: '转入进行中',
				TRANSFER_OUT: '转账进行中',
			},
			SUCCESS: {
				TRANSFER_IN: '转入成功',
				TRANSFER_OUT: '转账成功',
			},
			FAILURE: {
				TRANSFER_IN: '转入失败',
				TRANSFER_OUT: '转账失败',
			},
			CLOSE: {
				TRANSFER_IN: '已关闭',
				TRANSFER_OUT: '已关闭',
			},
		},
		typeClass: { // 类型对应class名称
			TRANSFER_IN: 'transfer',
			TRANSFER_OUT: 'transfer',
			BUY_IN: 'buy',
			PAY: 'phone',
		},
		payType: { // 支付方式
			GOP_PAY: '果仁宝支付',
			UNION_PAY: '银联支付',
			WEIXIN_MP_PAY: '微信支付',
			WEIXIN_OPEN_PAY: '微信支付',
			ALIPAY: '支付宝支付',
		},
		transferType: { // 转账方式
			WALLET_CONTACT: '钱包联系人',
			GOP_CONTACT: '果仁宝联系人',
			ME_WALLET: '我的钱包',
			GOP_MARKET: '果仁市场',
		},
		transferClass: { // 转账样式
			WALLET_CONTACT: 'address',
			GOP_CONTACT: 'address',
			ME_WALLET: 'wallet',
			GOP_MARKET: 'market',
		},
		transferStage: { // 转账阶段(同名样式)
			PROCESSING: 'half',
			SUCCESS: 'finish',
			FAILURE: '',
			CLOSE: '',
		}
	};
	return bill;
});



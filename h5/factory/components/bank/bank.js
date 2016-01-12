
// 张树垚 2016-01-10 16:59:03 创建
// H5微信端 --- components-bank 银行


define('h5-bank', function() {
	var bank = {
		json: ['中国民生银行:minsheng',
				'中国邮政储蓄银行:youzheng',
				'中国光大银行:guangda',
				'交通银行:jiaotong',
				'上海浦东发展银行:pufa',
				'上海银行:shanghai',
				'兴业银行:xingye',
				'中国建设银行:zhongjian',
				'北京农商银行:beinong',
				'北京银行:beiyin',
				'中国工商银行:gongshang',
				'广发银行:guangfa',
				'华夏银行:huaxia',
				'平安银行:pingan',
				'招商银行:zhaoshang',
				'中国银行:zhongguo',
				'中信银行:zhongxin'].reduce(function(json, item) {
					item = item.split(':');
					json[item[0]] = item[1];
					return json;
				}, {}),
		type: {
			SAVINGS_DEPOSIT_CARD: '储蓄卡',
			CREDIT_CARD: '信用卡'
		},
		dataHandler: function(list) {
			return list.map(function(item) {
				return {
					id: item.id, //id
					tail: item.cardNo.substr(-4), // 尾号
					name: item.bankName, // 名称
					lang: bank.json[item.bankName], // 英文
					phone: item.bankPhone,
					type: bank.type[item.cardType],
				};
			});
		}
	};
	
	return bank;
});


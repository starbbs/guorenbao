
// 张树垚 2016-01-10 16:59:03 创建
// H5微信端 --- components-bank 银行


define('h5-bank', function() {
	var bank = {};
	var json = bank.json = {};
	var type = bank.type = {
		SAVINGS_DEPOSIT_CARD: '储蓄卡',
		CREDIT_CARD: '信用卡'
	};
	var add = function(name, lang) {
		json[name] = lang;
	};
	add('中国民生银行','minsheng');
	add('中国邮政储蓄银行','youzheng');
	add('中国光大银行','guangda');
	add('交通银行','jiaotong');
	add('上海浦东发展银行','pufa');
	add('上海银行','shanghai');
	add('兴业银行','xingye');
	add('中国建设银行','zhongjian');
	add('北京农商银行','beinong');
	add('北京银行','beiyin');
	add('中国工商银行','gongshang');
	add('广发银行','guangfa');
	add('华夏银行','huaxia');
	add('平安银行','pingan');
	add('招商银行','zhaoshang');
	add('中国银行','zhongguo');
	add('中信银行','zhongxin');
	return bank;
});



// 张树垚 2015-09-02 11:40:58 创建
// 银行对应列表

define(['bank'], function(Bank) {
	var bankList = [];
	var add = function(name, en) {
		var bank = new Bank(name, en);
		bankList.push(bank);
		bankList[name] = bank;
	};
	add('邮储银行', 'youzheng');
	add('兴业银行', 'xingye');
	add('招商银行', 'zhaoshang');
	add('中国银行', 'zhongyin');
	add('中国建设银行', 'jianshe');
	add('中信银行', 'zhongxin');
	add('中国农业银行', 'nongye');
	add('深圳发展银行', 'shenfa');
	add('中国工商银行', 'gongshang');
	add('广东发展银行', 'guangfa');
	add('浦发银行', 'pufa');
	add('交通银行', 'jiaotong');
	add('中国光大银行', 'guangda');
	add('中国民生银行', 'minsheng');
	add('中国平安银行', 'pingan');
	return bankList;
});
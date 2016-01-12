
// 张树垚 2015-10-29 16:02:38 创建
// 过滤器


define('filters', function() {

	window.__gop = window.__gop || 0;

	// 金额转换
	avalon.filters.gop = function(value) { // 金额转果仁宝
		if (isNaN(value) || !value) { return 0; }
		return (parseFloat(value) / __gop).toFixed(2);
	};
	avalon.filters.money = function(value) { // 果仁宝转金额
		if (isNaN(value) || !value) { return 0; }
		return (parseFloat(value) * __gop).toFixed(2);
	};

	// 金额展示
	// 示例: {{item.moneyChange|sign}} {{item.moneyChange|abs|currency(' ')}} G
	avalon.filters.sign = function(str) { // 判断正负
		str = parseFloat(str);
		return str != 0 ? str > 0 ? '+' : '-' : '';
	};
	avalon.filters.sign2 = function(str) { // 判断正负2
		str = parseFloat(str);
		return str != 0 ? str > 0 ? '↑' : '↓' : '';
	};
	avalon.filters.abs = function(str) { // 绝对值
		str = parseFloat(str);
		return Math.abs(str);
	};

	// 状态翻译
	var _status = {
		waitForPay: '进行中',
		closed: '已关闭',
		processing: '进行中',
		failed: '交易失败',
		success: '交易成功'
	};
	avalon.filters.status = function(str) { // 翻译状态
		return _status[str];
	};

	// 金额颜色
	// 金额增加，是绿色，减少，是蓝色，未成功或者关闭的，是灰色
	// {{status+'#'+moneyChange|color}}
	avalon.filters.color = function(status, money) {
		if (arguments.length == 1) {
			var arr = str.split('#');
			status = arr[0];
			money = parseFloat(arr[1]);
		}
		if (status == 'closed' || status == 'failed') {
			return 'silver';
		}
		if (money > 0) {
			return 'green';
		}
		if (money < 0) {
			return 'blue';
		}
		return 'dark';
	};


	return avalon.filters;
});









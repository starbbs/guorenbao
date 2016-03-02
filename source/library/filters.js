
// 张树垚 2015-10-29 16:02:38 创建
// 过滤器


define('filters', function() {

	return $.extend(avalon.filters, {
	// 金额展示
	// 示例: {{item.moneyChange|sign}} {{item.moneyChange|abs|currency(' ')}} G
		sign: function(str) { // 判断正负
			str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
			return str != 0 ? str > 0 ? '+' : '-' : '';
		},
		sign2: function(str) { // 判断正负2
			str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
			return str != 0 ? str > 0 ? '↑' : '↓' : '';
		},
		abs: function(str) { // 绝对值
			str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
			return Math.abs(str);
		},
		fix: function(str, length) { // 四舍五入后保留多少位小数
			str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
			length = isNaN(parseInt(length)) ? 2 : parseInt(length);
			return ((Math.round(str * Math.pow(10, length))) / Math.pow(10, length)).toFixed(length);
		},
		tail: function(str, length) { // 尾数
			str = typeof str !== 'string' ? '' : parseFloat(str);
			length = isNaN(parseInt(length)) ? 4 : Math.abs(parseInt(length));
			return str.substr(- length);
		},
		omit: function(str, length) { // 省略
			var l = 5; // 默认保留长度
			length = isNaN(parseInt(length)) ? l : parseInt(length);
			return str.length > 5 ? (str.substring(0, length) + '...') : str;
		},
	});
});









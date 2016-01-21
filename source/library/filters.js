
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
			return (Math.round(str * Math.pow(10, length)) / Math.pow(10, length)).toFixed(length);
		}
	});
});









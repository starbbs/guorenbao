
// 张树垚 2015-10-29 16:02:38 创建
// 过滤器


define('filters', ['check'], function(check) {

	var filters = avalon.filters;

	var fix = function(name, str, length) { // 保留小数位
		str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
		length = isNaN(parseInt(length)) ? 2 : parseInt(length);
		var pow = Math.pow(10, length);
		return ( (Math[name](str * pow)) / pow ).toFixed(length);
	};

	return $.extend(filters, {
	// 金额展示
	// 示例: {{item.moneyChange|sign}} {{item.moneyChange|abs|currency(' ')}} G
		sign: function(str) { // 判断正负
			str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
			//3-16前写法 return str != 0 ? str > 0 ? '+' : '-' : '';
			return str >= 0 ? '+' : '-' ;
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
			return fix('round', str, length);
		},
		floorFix: function(str, length) { // 去尾后保留多少位小数
			return fix('floor', str, length);
		},
		ceilFix: function(str, length) { // 进一后保留多少位小数
			return fix('ceil', str, length);
		},
		tail: function(str, length) { // 尾数
			str = typeof str !== 'string' ? '' : parseFloat(str);
			length = isNaN(parseInt(length)) ? 4 : Math.abs(parseInt(length));
			return str.substr(- length);
		},
		omit: function(str, length, replace) { // 省略
			var l = 5; // 默认保留长度
			length = isNaN(parseInt(length)) ? l : parseInt(length);
			return str.length > 5 ? (str.substring(0, length) + (replace || '...')) : str;
		},
		address: function(str, length) { // 地址省略
			return filters.omit(str, 8, '**********');
		},
		phone: function(str) { // 手机省略
			return check.phone(str).result ? String(str).substr(0,3) + '****' + String(str).substr(-4) : str;
		},
	});
});









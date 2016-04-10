/**
 * 金额运算帮助类
 */
define('decimal', function() {
	
	var decimal = {
		precision : 2, // 精度-保留小数点后2位
	};

	/**
	 * 制保留 precision 位小数(默认两位)
	 */
	decimal.toDecimal = function(number,precision) {
		var f = parseFloat(number);
		if (isNaN(f)) {
			return 0;
		}
		if(!precision){
			precision=decimal.precision;
		}
		var f = Math.round(number * Math.pow(10,precision)) / (Math.pow(10,precision));	
		return f;
	};

	/**
	 * 判断保留了小数点多少位
	 */
	decimal.getPsercison = function(num) {
		var f = parseFloat(num);
		if (isNaN(f) || num.split(".").length<=1) {
			return 0;
		}
		var str=num.split(".")[1]+"";
		return str.length;
	};
	
	return decimal;
});

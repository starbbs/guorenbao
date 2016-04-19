/**
 * 金额运算帮助类
 */
define('decimal', function() {

	var decimal = {
		precision : 2, // 精度-保留小数点后2位
	};

	/**
	 * 制保留 precision 位小数(默认两位)向下取整
	 */
	decimal.toDecimal = function(number, precision) {
		var f = parseFloat(number);
		if (isNaN(f)) {
			return 0;
		}
		if (!precision) {
			precision = decimal.precision;
		}
		var f = Math.floor(number * Math.pow(10, precision))
				/ (Math.pow(10, precision));
		f = f.toFixed(2);
		return f;
	};

	/**
	 * 判断保留了小数点多少位
	 */
	decimal.getPsercison = function(num) {
		var f = parseFloat(num);
		if (isNaN(f) || (num+"").split(".").length <= 1) {
			return 0;
		}
		var str = (num+"").split(".")[1] + "";
		return str.length;
	};

	decimal.getTwoPs = function(str) {
		var length = 0;
		var position = 0;
		// String str = bd.toPlainString();
		if (String(str).indexOf(".") < 0) {
			return str + ".00";
		}
		length = String(str).length;
		position = String(str).indexOf(".");

		if (length < position + 3) {
			return str + "0";
		} else {
			return String(str).substring(0, position + 3);
		}
	}

	/**
	 * 获取小数的整数形式
	 */
	decimal._getIntFromFloat = function(arg) {
		if (arg.toString().indexOf(".") == -1) {
			return arg;
		} else {
			return Number(arg.toString().replace(".", ""));
		}
	}
	
	/** 
	 * 乘法
	 */
	decimal.floatMulti = function(arg1, arg2) {
		var precision1 = this.getPsercison(arg1);
		var precision2 = this.getPsercison(arg2);
		var tempPrecision = 0;

		tempPrecision += precision1;
		tempPrecision += precision2;
		var int1 = this._getIntFromFloat(arg1);
		var int2 = this._getIntFromFloat(arg2);
		return (int1 * int2) * Math.pow(10, -tempPrecision);
	}
	
	/**
	 * 加法
	 */ 
	decimal.floatAdd = function(arg1, arg2) {
		var precision1 = this.getPsercison(arg1);
		var precision2 = this.getPsercison(arg2);
		var temp = Math.pow(10, Math.max(precision1, precision2));
		return (this.floatMulti(arg1, temp) + this.floatMulti(arg2, temp))
				/ temp;
	}
	
	/**
	 * 减法
	 * arg1 被减数
	 * arg2 减数
	 */ 
	decimal.floatSubtract = function(arg1, arg2) {
		var precision1 = this.getPsercison(arg1);
		var precision2 = this.getPsercison(arg2);
		var temp = Math.pow(10, Math.max(precision1, precision2));
		return (this.floatMulti(arg1, temp) - this.floatMulti(arg2, temp))/ temp;
	}
	
	
	/**
	 * 除法
	 * arg1 被除数
	 * arg2 除数
	 */
	decimal.floatDiv = function(arg1, arg2) {
		var precision1 = this.getPsercison(arg1);
		var precision2 = this.getPsercison(arg2);
		var int1 = this._getIntFromFloat(arg1);
		var int2 = this._getIntFromFloat(arg2);
		var result = (int1 / int2) * Math.pow(10, precision2 - precision1);
		return result;
	}

	return decimal;
});

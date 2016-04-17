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
	decimal.toDecimal = function(number,precision) {
		var f = parseFloat(number);
		if (isNaN(f)) {
			return 0;
		}
		if(!precision){
			precision=decimal.precision;
		}
		var f = Math.floor(number * Math.pow(10,precision)) / (Math.pow(10,precision));
		f=f.toFixed(2);
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

	decimal.getTwoPs = function(str){
		var length = 0;
    	var position = 0;
    	//String str = bd.toPlainString();
    	if(String(str).indexOf(".") < 0){
    		return str+".00";
    	}
    	length = String(str).length;
    	position = String(str).indexOf(".");

    	if(length < position + 3){
    		console.log(str);
    		return str + "0";
    	}else{
    		return String(str).substring(0, position + 3);
    	}
	}

	
	
	return decimal;
});

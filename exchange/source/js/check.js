
// 张树垚 2015-12-28 11:30:13 创建
// H5微信端 --- 针对性优化


define('h5-check', ['check'], function(check) {
	var common = function(name, input) {
		var result = check[name](input.val());
		!result.result && $.alert(result.message);
		return result.result;
	};
	var result = [ // 已做完check格式化的校验
		'phone',
		'password',
		'paypass'
	].reduce(function(result, name) {
		result[name] = function(input) {
			return common(name, $(input));
		};
		return result;
	}, {});
	return result;
});

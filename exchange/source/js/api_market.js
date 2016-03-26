define('api_mkt', ['cookie'], function() {
	//var basePath = 'http://localhost/';
	var basePath = 'http://localhost/';
	//var basePath = "http://172.16.33.3:8080/";
	//http://ip:port/login/registerBefore
	//var basePath = 'http://ip:port/login/registerBefore';
	var api = {};
	var goIndex = function(useURL) {		//返回首页
		if (useURL) {
		}
		if (window.location.href.indexOf('/index.html') === -1) {
			return window.location.href = 'index.html';
		} else {
			alert('无法获得用户信息');
		}
	};
	// 方便cookie
	$.gopToken = function(token) {
		return $.cookie('gopToken', token);
	};
	/** [add 添加接口]
	 * @Author   张树垚
	 * @Date     2015-10-13
	 * @param    {[string]}		      name                     [api名称]
	 * @param    {[string]}           url                      [api地址]
	 * @param    {[json]}             options                  [api地址]
	 *           {[function]}         options.callback         [接口固定回调]
	 *           {[boolean]}          options.asyn             [是否异步请求]
	 *           {[array]}            options.ignoreStatus     [忽略状态码的默认提示]
	 * @特点:
	 *     1.同步请求, 连续请求会自动中断上一个
	 */
	var add = function(name, url, options) {
		if (name in api) {
			alert('api名称' + name + '已存在!');
			return;
		}
		for (var i in api) {
			if (api.hasOwnProperty(i) && api[i] === url) {
				alert('该接口地址' + url + '已添加!');
				return;
			}
		}
		var xhr = null;
		options = options || {};
		api[name] = function(data, success) { // 每个接口具体请求
			if (xhr && !options.asyn) {
				xhr.abort();
				xhr = null;
				return;
			}
			if (typeof data === 'function') {
				success = data;
				data = {};
			}
			// console.log(url);
			xhr = $.ajax({
				url: basePath + url,
				type: 'post',
				data: JSON.stringify(data),
				dataType: 'json',
				timeout: 30000,
				success: function(data) {
					if (!data) {
						// alert('1:' + name + ';' + $.cookie('gopToken'));
						return goIndex(true);
					}
					if (data.status == 300 && options.ignoreStatus && options.ignoreStatus.indexOf(300) === -1) { // {msg: "用户登录/验证失败，请重新登录", status: "300"}
						// alert(2);
						goIndex(true);
					} else if (data.status == 304 && options.ignoreStatus && options.ignoreStatus.indexOf(304) === -1) { // {msg: "服务器异常", status: "304"}
						//$.alert('服务器异常, 请联系后台人员!');
						alert('服务器异常');
					}
					options.callback && options.callback.call(this, data);
					success && success.call(this, data);
				},
				error: function(xhrObj, text, err) {
					console.log('Error: ', arguments);
					if (text === 'timeout') {
						//$.alert('请求超时...<br>请检查您的网络');
						alert('请求超时...<br>请检查您的网络');
					}
				},
				complete: function() {
					xhr = null;
				}
			});
		};
	};
	/** 打印一条醒目的信息
	 * @Author   张树垚
	 * @DateTime 2015-10-29
	 * @param    {string}     msg  [信息]
	 * @return
	 */
	api.log = function(msg) {
		console.log('\n%c' + msg,
			'color: white;' +
			'background-color: red;' +
			'padding: .4em 1.5em;' +
			'font-size: 20px;' +
			'font-weight: bold;' +
			'border-radius: 8px;' +
			'border: 2px solid gray;' +
			'text-shadow: 0px 0px 1px rgba(0,0,0,1);' +
			'height: 30px;' +
			'cursor: pointer;' +
			''
		);
	};
	add('pollinfo','trade/info');
	add('polltrade','trade/trade');
	add('homepage_tradingfloor_kline','trade/kline');
	add('depthchart','trade/depth');
	add('homepagekline','trade/kline');


	add('login','exchangeApi/login/login');

	//接口 发送验证码 
	add('sendCode','exchangeApi/common/sendCode');
	//接口 注册第一步 手机号注册
	add('registerBefore','exchangeApi/login/registerBefore');	
	//接口 注册第二步 设置支付密码 
	add('register','exchangeApi/login/register');
	//接口 注册第三步 设置实名验证 
	add('realNameAuth','exchangeApi/security/realNameAuth');

	//接口 账户明细（查询最近5条）
	add('billList','exchangeApi/bill/billList');
	//接口 账户明细（带分页）
	add('billList-page','exchangeApi/bill/billList');
	//接口 人民币充值
	add('rmbRecharge','exchangeApi/wealth/rmbRecharge');
	//接口 人民币提现
	add('rmbWithdrawals','exchangeApi/wealth/rmbWithdrawals');
	//接口 人民币充值历史（查询最近5条）
	add('rmbRechargeHistory','exchangeApi/wealth/rmbRechargeHistory');
	//接口 人民币提现历史（查询最近5条）
	add('rmbWithdrawalsHistory','exchangeApi/wealth/rmbWithdrawalsHistory');
	//接口 银行卡识别
	add('checkBankCard','exchangeApi/common/checkBankCard');
	// 接口 人民币提现管理添加 添加银行卡
	add('rmbWithdrawalsManageAdd','exchangeApi/wealth/rmbWithdrawalsManageAdd');
	// 接口 发送手机号验证码(登录后不需要手机号参数)
	add('sendCodeByLoginAfter','exchangeApi/common/sendCodeByLoginAfter');
	// 接口 果仁提现地址管理添加
	add('gopAddressManAdd','exchangeApi/wealth/gopAddressManAdd');	
	// 接口 果仁提现地址管理删除
	add('gopAddressManDel','exchangeApi/wealth/gopAddressManDel');	
	// 接口 果仁提现地址管理
	add('gopAddressMan','exchangeApi/wealth/gopAddressMan');
	// 接口 果仁提现地址修改
	add('gopAddressManUpdate','exchangeApi/wealth/gopAddressManUpdate');		
	// 接口 人民币提现管理【判断是否添加银行卡】
	add('bankList','exchangeApi/wealth/bankList');




	add('userlogout','exchangeApi/user/logout');
	add('realAuth','exchangeApi/user/realAuth');
	add('totalAssets','exchangeApi/wealth/getTotalAssets');



	add('userbasic','exchangeApi/user/basic');

	/*
	// 1.手机号注册
	add('register', '/login/register');
	// 1.1 手机号注册
	add('registerall', '/login/registerall');
	// 83.获取联系人头像（49.账单列表接口的附加接口）
	add('billPhoto', '/bill/contentPhoto', {
		asyn: true // 可同时请求多次
	});
	// 84.获取联系人信息
	add('contactInfo', '/contact/info', {
		ignoreStatus: [304] // 忽略304错误
	});
	*/
	return api;
});
// 张树垚 2015-08-20 09:22:35 创建
// 请求后端



define('api', ['cookie', 'filters', 'h5-alert', 'h5-wait'], function() {

	// var basePath = '.'; // 同域
	var basePath = 'http://116.213.142.89:8080';

	/** [api 接口集合] */
	var api = {};

	/** [add 添加接口]
	 * @Author   张树垚
	 * @Date     2015-10-13
	 * @param    {[string]}		      name                     [api名称]
	 * @param    {[string]}           url                      [api地址]
	 * @param    {[json]}             options                  [api地址]
	 *           {[function]}         options.callback         [接口固定回调]
	 *           {[boolean]}          options.asyn             [是否异步请求]
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
					if (data.status == 300) { // {msg: "用户登录/验证失败，请重新登录", status: "300"}
						if (window.location.href.indexOf('/index.html') === -1) {
							return window.location.href = 'index.html';
						}
					} else if (data.status == 304) { // {msg: "服务器异常", status: "300"}
						$.alert('服务器异常, 请联系后台人员!');
					}
					options.callback && options.callback.call(this, data);
					success && success.call(this, data);
				},
				error: function(xhrObj, text, err) {
					console.log('Error: ', arguments);
					if (text === 'timeout') {
						$.alert('请求超时...<br>请检查您的网络');
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
			'cursor: pointer;'
		);
	};

	// 临时接口: 删除账户
	add('cleanUser', '/common/cleanUser');
	window.cleanUser = function() {
		var gopToken = $.cookie('gopToken');
		if (!gopToken) {
			return api.log('>> gopToken已消失, 可能原因:\n 1.cookie过期, 请联系Java工程师手动删除\n 2.已被删除, 请联系Java工程师查询');
		}
		api.cleanUser({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				api.log('你的账户已删除成功!');
				$.cookie('gopToken', null);
			} else {
				api.log('第一次删除失败, 进行第二次删除操作');
				api.cleanUser({
					gopToken: gopToken
				}, function(data) {
					if (data.status == 200) {
						api.log('第二次删除成功, 你的账户已成功删除!');
						$.cookie('gopToken', null);
					} else {
						api.log('第二次删除失败, 请联系Java工程师');
					}
				});
			}
		});
	};

	// 1.手机号注册
	add('register', '/login/register');

	// 1.1 手机号注册
	add('registerall', '/login/registerall');

	// 2.发送手机号验证码
	add('sendCode', '/common/sendCode');

	// 3.验证手机短信验证码是否正确
	add('identifyingCode', '/common/identifyingCode');

	// 4.设置登录密码
	add('setLoginPassword', '/login/setLoginPassword');

	// 5.设置支付密码
	add('setPayPassword', '/user/setPayPassword');

	// 6.手机号登录
	add('login', '/login/login');

	// 7.微信自动登录
	add('wxlogin', '/login/wxlogin');

	// 11.我的果仁数
	add('getGopNum', '/wealth/getGopNum');

	// 12.果仁市场实时价格
	add('price', '/gop/price');

	// 13.我的收益
	add('getIncome', '/wealth/getIncome');

	// 14.年化收益列表
	add('annualIncome', '/myWealth/annualIncome');

	// 15.历史结算价格列表
	add('historyPrice', '/myWealth/historyPrice');

	// 16.联系人列表
	add('person', '/contact/person');

	// 17.修改联系人备注
	add('updateRemark', '/contact/updateRemark');

	// 18.我的信息接口(头像、昵称、手机号)
	add('info', '/user/info');

	// 19.修改我的昵称接口
	add('updateNick', '/user/updateNick');

	// 20.我的果仁市场账号信息接口
	add('gopMarketAddress', '/user/gopMarketAddress');

	// 21.添加果仁市场账号
	add('marketAdd', '/user/gopMarketAddress/add');

	// 22.删除果仁市场账号
	add('marketDel', '/user/gopMarketAddress/delete');

	// 23.查询绑定的钱包列表接口
	add('walletList', '/wallet/list');

	// 24.绑定钱包接口
	add('walletAdd', '/wallet/add');

	// 25.删除钱包接口
	add('walletDel', '/wallet/delete');

	// 26.设置默认的钱包接口
	add('walletSet', '/wallet/setDefault');

	// 27.查询绑定的银行卡接口
	add('bankcardSearch', '/bankcard/search');

	// 28.绑定银行卡接口
	add('bankcardAdd', '/bankcard/add');

	// 29.删除银行卡接口
	add('bankcardDel', '/bankcard/delete');

	// 30.是否实名认证查询接口
	add('isCertification', '/security/isCertification');

	// 31.是否填写密保问题查询接口
	add('isQuestion', '/security/isQuestion');

	// 32.查询已经实名认证的信息
	add('alreadyCertification', '/security/alreadyCertification');

	// 33.实名认证申请
	add('applyCertification', '/security/applyCertification');

	// 34.密保问题填写
	add('applyQuestion', '/security/applyQuestion');

	// 35.验证登录密码
	add('checkPwd', '/security/checkPwd');

	// 36.修改登录密码
	add('updatePwd', '/login/updatePwd');

	// 37.修改支付密码接口
	add('checkPayPwd', '/security/checkPayPwd');

	// 38.验证身份证号
	add('checkIDcard', '/security/checkIDcard');

	// 39.验证密保问题
	add('checkQuestion', '/security/checkQuestion');

	// 40.修改支付密码
	add('changePayPwd', '/security/changePayPwd');

	// 41.买果仁订单创建接口
	add('createBuyinOrder', '/gop/createBuyinOrder');

	// 42.果仁充值订单详情查询接口
	add('queryBuyinOrder', '/gop/queryBuyinOrder');

	// 43.银联支付接口
	add('orderUnionPay', '/recharge/orderUnionPay');

	// 44.转账接口
	add('transfer', '/transfer/send');

	// 45.转账交易详情查询接口
	add('transferQuery', '/transfer/query');

	// 46.消费果仁订单，手机话费充值接口
	add('phoneRecharge', '/consume/product/phoneRecharge');

	// 47.通用支付订单查询接口
	add('query', '/consume/order/query');

	// 48.通用支付订单支付接口
	add('pay', '/consume/order/pay');

	// 49.账单列表接口
	add('billList', '/bill/list');

	// 50.账单详情接口
	add('account', '/bill/account');

	// 51.消息列表接口
	add('messageInfo', '/message/info');

	// 52.消息详情接口
	add('messageSys', '/message/system');

	// 53.账户冻结状态
	add('userStatus', '/user/status');

	// 54.果仁夺宝查询活动信息
	add('duobaoAct', '/duobao/activities');

	// 55.果仁夺宝中奖用户参与码列表
	add('duobaoWin', '/duobao/winnerCodeList');

	// 56.购买果仁夺宝兑换码
	add('duobaoCode', '/duobao/bugCode');

	// 57.获取商品列表
	add('productList', '/consume/product/list');

	// 62.手机号归属地和运营商
	add('phoneInfo', '/common/phone/info');

	// 63.最近3个充值手机号码
	add('phoneLastest', '/consume/product/phoneRecharge/lastest');

	// 64.发送手机号验证码
	add('phoneSendCode', '/common/user/phone/sendCode');

	// 65.验证手机短信验证码是否正确
	add('phoneIdentifyingCode', '/common/user/phone/identifyingCode');

	// 66.发送银行手机号验证码
	add('bankSendCode', '/common/bank/phone/sendCode');

	// 67.验证银行手机短信验证码是否正确
	add('bankIdentifyingCode', '/common//bank/phone/identifyingCode');

	// 68.获取最近转果仁记录
	add('transferRecent', '/transfer/recent');

	// 68.获取密保问题 
	add('getQuestion', '/security/getQuestion');

	// 69.重置登录密码
	add('resetLoginPassword', '/login/resetLoginPassword');

	// 70.识别银行卡
	add('checkBankCard', '/common/checkBankCard');

	// 73.删除消费订单中手机充值历史记录
	add('phoneDelete', '/consume/product/phoneRecharge/clean');

	// 74.验证转果仁新目标地址
	add('transferValidate', '/transfer/validate');

	// 76.查询历史收益
	add('totalIncomeList', '/myWealth/totalIncomeList');

	// 77.用户反馈信息
	add('fankui', '/fankui/send');

	// 79.微信签名
	add('weixinInfo', '/common/weixin/signature');

	// 83.获取联系人头像（49.账单列表接口的附加接口）
	add('billPhoto', '/bill/contentPhoto', {
		asyn: true // 可同时请求多次
	});

	return api;
});
// 张树垚 2015-08-20 09:22:35 创建
// 请求后端



define('api', ['cookie', 'h5-wait'], function() {

	// var basePath = '.'; // 同域
	// var basePath = 'http://172.16.27.110:8080/'; // 郑明海本地
	// var basePath = typeof __basePath === 'undefined' ? 'http://www.goopal.me' : __basePath;
	var basePath = 'http://www.goopal.me';
	/** [api 接口集合] */
	var api = {};

	/** [add 添加接口]
	 * @Author   张树垚
	 * @Date     2015-10-13
	 * @param    {[string]}    name [api名称]
	 * @param    {[string]}    url  [api地址]
	 */
	var add = api.add = function(name, url, callback) {
		if (name in api) {
			alert('api名称' + name + '已存在!');
			return;
		}
		for (var i in api) {
			if(api.hasOwnProperty(i) && api[i] === url) {
				alert('该接口地址' + url + '已添加!');
				return;
			}
		}
		var xhr = null;
		var isRequesting = false;
		api[name] = function(data, success) { // 每个接口具体请求
			if (isRequesting) { return; }
			isRequesting = true;
			xhr && xhr.abort();
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
				success: function(data) {
					callback && callback.call(this, data);
					success && success.call(this, data);
				},
				error: function(err) {
					console.log('Error: ', err);
				},
				complete: function() {
					xhr = null;
					isRequesting = false;
				}
			});
		};
	};

	window.testLogin = function() { // 登录测试账号
		api.loginCheck({
			phone: '',
			password: ''
		}, function(data) {
		});
	};

	/** 打印一条醒目的信息
	 * @Author   张树垚
	 * @DateTime 2015-10-29
	 * @param    {string}     msg  [信息]
	 * @return
	 */
	api.log = function(msg) {
		console.log('%c' + msg,
			'color: white;' +
			'background-color: red;' +
			'padding: .4em 1.5em;' +
			'font-size: 20px;' +
			'font-weight: bold;' +
			'border-radius: 8px;' +
			'border: 1px solid gray;' +
			'text-shadow: 0px 0px 1px rgba(0,0,0,1);' +
			'margin: 5px 0;' +
			'cursor: pointer;'
		);
	};

	/** 临时接口: 删除账户
	 * 参数: 
		{
			"gopToken":"2b6c5710a7f34e1abddba47be6b59e9c"
		}
	 * 返回:
		{
			"msg": "success",
			"status": "200"
		}
	 */
	add('cleanUser', '/common/cleanUser');
	window.cleanUser = function() {
		var gopToken = $.cookie('gopToken');
		if (!gopToken) { return api.log('>> gopToken已消失, 可能原因:\n 1.cookie过期, 请联系Java工程师手动删除\n 2.已被删除, 请联系Java工程师查询'); }
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

	/** 1.手机号注册
	 * 参数:
		{
			"phone": "15079817107",
			"identifyingCode": "23323"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
			}
		}
	 */
	add('register', '/login/register');

	/** 1.1 手机号注册
	 * 参数:
		{
			"phone": "15079817107",
			"identifyingCode": "23323",
			"password": "21312321"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
			}
		}
	 */
	add('registerall', '/login/registerall');

	/** 2.发送手机号验证码
	 * 参数:
		{
			"phone": "15079817107"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"identifyingCode": "2346"
			}
		}
	 */
	add('sendCode', '/common/sendCode');

	/** 3.验证手机短信验证码是否正确
	 * 参数:
		{
			"phone": "15079817107",
			"identifyingCode": "15079817107"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('identifyingCode', '/common/identifyingCode');

	/** 4.设置登录密码
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"password": "2342432",
			"openId":"SSSSS" // (非必须)
		}
	 * 返回:
		{
		    "status":200,
		    "msg":"success"    
		}
	 */
	add('setLoginPassword', '/login/setLoginPassword');

	/** 5.设置支付密码
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"password": "2342432"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('setPayPassword', '/user/setPayPassword');

	/** 6.手机号登录
	 * 参数:
		{
			"phone": "15079817107",
			"password": "123456",
			"openId": "sssss"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
			}
		}
	 */
	add('login', '/login/login');

	/** 7.微信自动登录
	 * 参数:
		{
			"code": "ew7we8ddf93jfdij43ifdjkxeteerefioie43fedvdjifd"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34
				"userNick": "袋鼠",
				"phone": "15079817107"
			}
		}
	 */
	add('wxlogin', '/login/wxlogin');

	/** 11.我的果仁数
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"data": {
				"gopNum": 12.110000
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('getGopNum', '/wealth/getGopNum');

	/** 12.果仁市场实时价格
	 * 参数: 无
	 * 返回:
		{
			"data": {
				"price": 12.345678,
				"timestamp": "2015-12-24 09:16:54"
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('price', '/gop/price');

	/** 13.我的收益
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"data": {
				"totalIncome": 11.00,
				"yesterdayIncome": 0.00
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('getIncome', '/wealth/getIncome');

	/** 14.年化收益列表
	 * 参数:
		{
			"day": 7,
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"incomeList": [{
					"date": "2015-11-12",
					"income": "22.23"
				}, {
					"date": "2015-11-11",
					"income": "82.23"
				}]
			}
		}
	 */
	add('annualIncome', '/user/annualIncome');

	/** 15.历史结算价格列表
	 * 参数:
		{
			"day": 7,
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"incomeList": [{
					"date": "2015-11-12",
					"price": "22.23"
				}, {
					"date": "2015-11-11",
					"price": "82.23"
				}]
			}
		}
	 */
	add('historyPrice', '/user/historyPrice');

	/** 16.联系人列表
	 * 参数:
		{
			"contactType": "GOP_CONTACT",
			"contactQuery": "小猪"
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"list": [{
					"value": {
						"name": "安心",
						"phone": "158****0201"
					},
					"key": "A"
				}, {
					"value": {
						"name": ",,haha",
						"phone": "158****0210",
						"picture": "aaaaaaaaaaaaaa"
					},
					"key": "Other"
				}, {
					"value": {
						"address": "xcghv****"
					},
					"key": "未命名用户"
				}]
			}
		}
	}
	 */
	add('person', '/contact/person');

	/** 17.修改联系人备注
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"remark": "小猪快跑",
			"personId": 2
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('updateRemark', '/contact/updateRemark');

	/** 18.我的信息接口(头像、昵称、手机号)
	 * 参数:
		{
			"gopToken"：
			"e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"data": {
				"phone": "131****6570",
				"name": "*明海",
				"photo": "http://1.1.1.1/ppp.jpg"
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('info', '/user/info');

	/** 19.修改我的昵称接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"nick": "ssssssss"
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success"
		}
	 */
	add('updateNick', '/user/updateNick');

	/** 20.我的果仁市场账号信息接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"data": {
				"gopMarketAddress": "aaaa"
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('gopMarketAddress', '/user/gopMarketAddress');

	/** 21.添加果仁市场账号
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"gopMarketAddress": "sadasdasdasdasdasd"
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success"
		}
	 */
	add('marketAdd', '/user/gopMarketAddress/add');

	/** 22.删除果仁市场账号
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('marketDel', '/user/gopMarketAddress/delete');

	/** 23.查询绑定的钱包列表接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"data": {
				"walletList": [{
					"address": "123awasdassadaserawe",
					"createTime": "2015-12-17 10:38:04",
					"defaultWallet": true,
					"updateTime": "2015-12-17 10:38:04",
					"id": 19,
					"userId": 6
				}, {
					"address": "123awasdassadaserawe",
					"createTime": "2015-12-17 10:38:04",
					"defaultWallet": false,
					"updateTime": "2015-12-17 10:38:04",
					"id": 20,
					"userId": 6
				}, {
					"address": "123awasdassadaserawe",
					"createTime": "2015-12-17 10:38:04",
					"defaultWallet": false,
					"updateTime": "2015-12-17 10:38:04",
					"id": 21,
					"userId": 6
				}]
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('walletList', '/wallet/list');

	/** 24.绑定钱包接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"adderss": "dasdsadasdasdasdasd",
			"defaultWallet": true
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success"
		}
	 */
	add('walletAdd', '/wallet/add');

	/** 25.删除钱包接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"walletId": 11
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('walletDel', '/wallet/delete');

	/** 26.设置默认的钱包接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34",
			"walletId": 11
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
		}
	 */
	add('walletSet', '/wallet/setDefault');

	/** 27.查询绑定的银行卡接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"list": [{
					"cardType": SAVINGS_DEPOSIT_CARD "bankName": "建设银行",
					"cardNo": "**** **** **** 2874",
					"id": 1， "createTime": "2016-01-08 20:39:52"，
					"bankPhone": "15895910256"
				}, {
					"cardType": SAVINGS_DEPOSIT_CARD "bankName": "浦发银行",
					"cardNo": "**** **** **** 2222",
					"id": 2,
					"createTime": "2016-01-08 20:39:52"，
					"bankPhone": "15895910256"
				}]
			}
		}
	 */
	add('bankcardSearch', '/bankcard/search');

	/** 28.绑定银行卡接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
			"bankname": "建设银行",
			"cardno": "32051345454312874",
			"bankPhone": "15895910256"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('bankcardAdd', '/bankcard/add');

	/** 29.删除银行卡接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
			"cardId": 1
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('bankcardDel', '/bankcard/delete');

	/** 30.是否实名认证查询接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('isCertification', '/security/isCertification');

	/** 31.是否填写密保问题查询接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
			"data": {
				"isQuestion": "已填写问题"
			}
		}
	 */
	add('isQuestion', '/security/isQuestion');

	/** 32.查询已经实名认证的信息
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
			"data": {
				"name": "*三",
				"IDcard": "11**************22"
			}
		}
	 */
	add('alreadyCertification', '/security/alreadyCertification');

	/** 33.实名认证申请
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"name": "张三",
			"IDcard": "320882199804250022"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
			"data": {
				"result": "实名认证通过"
			}
		}
	 */
	add('applyCertification', '/security/applyCertification');

	/** 34.密保问题填写
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"qtID1": 1,
			"qt1": "answer1",
			"qtID2": 2,
			"qt2": "answer2"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('applyQuestion', '/security/applyQuestion');

	/** 35.验证登录密码
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"pwd": "tjy565464",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('checkPwd', '/security/checkPwd');

	/** 36.修改登录密码
	 * 参数:
		{
		    "gopToken":"e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
		    "pwdNew":"tjy565464",
		    "pwdOld":"123456",
		    "identifyingCode":"2323",
		}
	 * 返回:
		{
		    "status":200,
		    "msg":"success"
		}
	 */
	add('updatePwd', '/login/updatePwd');

	/** 37.修改支付密码接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"payPwd": "565464",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('checkPayPwd', '/security/checkPayPwd');

	/** 38.验证身份证号
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"IDcard": "3208821551341453",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('checkIDcard', '/security/checkIDcard');

	/** 39.验证密保问题
	 * 参数:
		{
		    "gopToken":"e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
		    "qtNumber":1,
		    "question":"我爸爸叫什么？",
		     "answer" :"xxxx"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('checkQuestion', '/security/checkQuestion');

	/** 40.修改支付密码
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"payPwdNew": "465245",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('changePayPwd', '/security/changePayPwd');

	/** 41.买果仁订单创建接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"orderMoney": 33.56,
			"payType": "WEIXIN_MP_PAY"
		}
	 * 返回:
		银联
			{
				"data": {
					"buyinOrder": {
						"payType": "UNION_PAY",
						"orderMoney": 12.35,
						"createTime": "2015-12-21 16:36:00",
						"orderCode": "201512211636006262",
						"updateTime": "2015-12-21 16:36:00",
						"id": 7,
						"userId": 26,
						"status": "PROCESSING",
						"price": 12.99,
						"gopNum": 7.987555,
						"payMoney": 12.35,
						"serialNum": "12124132413",
						"payTime": "2015-12-21 16:36:00",
						"payResult": "失败"
					},
					"UNION_PAY": {
						"bankCardList": [{
							"bankPhone": "150****7107",
							"cardType": "CREDIT_CARD",
							"bankName": "建设银行",
							"cardNo": "**** **** **** 4567",
							"id": 1
						}, {
							"bankPhone": "150****7107",
							"cardType": "CREDIT_CARD",
							"bankName": "招商银行",
							"cardNo": "**** **** **** 4567",
							"id": 1
						}]
					}
				},
				"msg": "success",
				"status": "200"
			}
		微信
			{
				"data": {
					"buyinOrder": {
						"payType": "WEIXIN_MP_PAY",
						"orderMoney": 33.56,
						"createTime": "2015-12-25 17:49:43",
						"orderCode": "201512251749438106",
						"updateTime": "2015-12-25 17:49:43",
						"id": 15,
						"userId": 26,
						"status": "PROCESSING",
						"price": 12.99,
						"gopNum": 7.987555,
						"payMoney": 12.35,
						"serialNum": "12124132413",
						"payTime": "2015-12-21 16:36:00",
						"payResult": "失败"
					},
					"WEIXIN_MP_PAY": {
						"timeStamp": "1451036985",
						"package": "prepay_id=wx2015122517492785d57168440155237893",
						"paySign": "A14D6A6DAEB341ABBDE7708811F7C535",
						"appId": "wx55923db8dfb94e44",
						"signType": "MD5",
						"nonceStr": "2823f4797102ce1a1aec05359cc16dd9"
					}
				},
				"msg": "success",
				"status": "200"
			}
	 */
	add('createBuyinOrder', '/gop/createBuyinOrder');

	/** 42.果仁充值订单详情查询接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"buyinOrderId": 33,
			"payType": "WEIXIN_MP_PAY"
		}
	 * 返回:
		银联: 成功
			{
				"data": {
					"buyinOrder": {
						"payType": "UNION_PAY",
						"orderMoney": 12.35,
						"createTime": "2015-12-21 16:36:00",
						"orderCode": "201512211636006262",
						"updateTime": "2015-12-21 16:36:00",
						"id": 7,
						"userId": 26,
						"status": "SUCCESS",
						"price": 12.99,
						"gopNum": 7.987555,
						"payMoney": 12.35,
						"serialNum": "12124132413",
						"payTime": "2015-12-21 16:36:00",
						"payResult": "成功"
					}
				},
				"msg": "success",
				"status": "200"
			}
		银联: 失败
			{
				"data": {
					"buyinOrder": {
						"payType": "UNION_PAY",
						"orderMoney": 12.35,
						"createTime": "2015-12-21 16:36:00",
						"orderCode": "201512211636006262",
						"updateTime": "2015-12-21 16:36:00",
						"id": 7,
						"userId": 26,
						"status": "FAILURE",
						"payResult": "余额不足"
					}
				},
				"msg": "success",
				"status": "200"
			}
		银联: 未支付
			{
				"data": {
					"buyinOrder": {
						"payType": "UNION_PAY",
						"orderMoney": 12.35,
						"createTime": "2015-12-21 16:36:00",
						"orderCode": "201512211636006262",
						"updateTime": "2015-12-21 16:36:00",
						"id": 7,
						"userId": 26,
						"status": "PROCESSING"
					},
					"UNION_PAY": {
						"bankCardList": [{
							"bankPhone": "150****7107",
							"cardType": "CREDIT_CARD",
							"bankName": "jianse",
							"cardNo": "**** **** **** 4567"
						}, {
							"bankPhone": "150****7107",
							"cardType": "CREDIT_CARD",
							"bankName": "jianse",
							"cardNo": "**** **** **** 4567"
						}]
					}
				},
				"msg": "success",
				"status": "200"
			}
	 */
	add('queryBuyinOrder', '/gop/queryBuyinOrder');

	/** 43.银联支付接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"orderId": 3434,
			"cardId": 3434,
			"payPwd": "123456",
			"identifyingCode": "2323",
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('orderUnionPay', '/recharge/orderUnionPay');

	/** 44.转账接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"transferType": "WALLET",
			"personId": 1 "phone": 3434,
			"address": "r8fi4jf94kfp3-d67dmfddfghggwerwwwe3r43frf",
			"serviceFee": "0.01",
			"content": "房租"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"transferId": 1
			}
		}
	 */
	add('transfer', '/transfer/send');

	/** 45.转账交易详情查询接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"transferId": 12
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success",
			"data": {
				"transferId": 1,
				"transferType": "MYWALLET",
				"dealTime": "2015-11-12 23:30:12",
				"phone": "15079817107",
				"address": "sds99d9fddfk4rtyuop234567890sdfgkjytd",
				"serviceFee": 0.01,
				"content": "买房",
				"searialNumber": "dsi3rjire9344rkrfe9jer344534345"
			}
		}
	 */
	add('transferDetail', '/deal/transferDetail');

	/** 46.消费果仁订单，手机话费充值接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"productId": 13,
			"phone": "13146556570"
		}
	 * 返回:
		{
			"data": {
				"consumeOrderId": 2
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('phoneRecharge', '/consume/product/phoneRecharge');

	/** 47.通用支付订单查询接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"consumeOrderId": 1
		}
	 * 返回:
		{
			"data": {
				"bankCardList": [{
					"cardType": "SAVINGS_DEPOSIT_CARD",
					"bankName": "建设银行",
					"cardNo": "1111222233332874",
					"id": 1， "bankPhone": "15895910256"
				}, {
					"cardType": "CREDIT_CARD",
					"bankName": "浦发银行",
					"cardNo": "1111222233334444",
					"id": 2,
					"bankPhone": "15895910256"
				}],
				"product": {
					"productDesc": "话费充值",
					"extraContent": "{\"price\":30}",
					"currency": "RMB",
					"id": 13,
					"price": 12.900000,
					"productName": "30元话费",
					"productType": "SHOUJICHONGZHIKA"
				},
				"consumeOrder": {
					"orderMoney": 30.000000,
					"productId": 13,
					"createTime": "2015-12-20 09:42:51",
					"extraContent": "{\"phone\":\"13146556570\"}",
					"currency": "RMB",
					"orderCode": "1",
					"updateTime": "2015-12-20 09:42:51",
					"id": 2,
					"userId": 26,
					"productType": "SHOUJICHONGZHIKA",
					"status": "PROCESSING"
				},
				"recordList": [{
					"payMoney": 2.00,
					"payType": "GOP_PAY",
					"tradeNo": "20151224163438600901",
					"createTime": "2015-12-24 16:34:38",
					"tradeStatus": "FAILURE",
					"updateTime": "2015-12-24 16:34:38",
					"payResult": "哈哈哈哈哈哈",
					"payGop": 2.000000
				}],
				"gopPrice": 12.345678,
				"gopNum": 0.00
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('query', '/consume/order/query');

	/** 48.通用支付订单支付接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
			"useGop": true,
			"consumeOrderId": 50,
			"identifyingCode": "23323",
			"bankCardId": 12,
			"payPassword": "22323"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('pay', '/consume/order/pay');

	/** 49.账单列表接口
	 * 参数:
		{
			"billListPage": 1,
			"billListPageSize": 15,
			"gopToken": "3a1b6c38c7994c52be8d2b5291c11e1e"
		}
	 * 返回:
		{
			"data": {
				"page": 1,
				"pageSize": 15,
				"list": [{
					"id": 136,
					"createTime": "2016-01-04 21:18:39",
					"businessDesc": "买果仁",
					"status": "CLOSE",
					"userId": 63,
					"money": -333.00,
					"businessTime": "2016-01-04 21:18:39",
					"gopPrice": 3.10,
					"businessId": 139,
					"type": "BUY_IN"
				}]
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('billList', '/bill/list');

	/** 50.账单详情接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"；
			"flowId": "dsadasfsadasfsadd";
		}
	 * 返回:
		{
			"status": 200;
			"msg": "success",
			"data": {
				"orderType": "gop",
				"orderInfo": "sdsad",
				"orderDes": "sdasd",
				"createTime": "1234",
				"orderState": "close",
				"orderaccount": "100"
			}
		}
	 */
	add('account', '/bill/account');

	/** 51.消息列表接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": "20",
			"msg": "success",
			"data": {
				"system": {
					"num": "1",
					"last": "好友转账"
				},
				"notice": {
					"num": "1",
					"last": "公告"
				}
			}
		}
	 */
	add('messageInfo', '/message/info');

	/** 52.消息详情接口
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34
		}
	 * 返回:
		{
			"status": 200;
			"msg": "success",
			"data": [{
					"ordercode": "101",
					"message": {
						orderID: "dsadas"
					}
				]
			}
	 */
	add('messageSys', '/message/system');

	/** 53.账户冻结状态
	 * 参数:
		{
			"gopToken": "e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success",
			"data": {
				"satus": "哈哈你被冻结了"
			}
		}
	 */
	add('userStatus', '/user/status');

	/** 54.果仁夺宝查询活动信息
	 * 参数: 无
	 * 返回:
		{
			"status": "200",
			"msg": "success",
			"data": {
				"activityId": 1024,
				"img": "http://www.goopal.com.cn/img/ewweweew.png",
				"prizeProductId": 333,
				"prize": "苹果iPhone6s  plus",
				"gopNum": 1000,
				"collectNum": 550,
				"ruleDesc": "用户可最少使用1果仁参与游戏，每支付1果仁，就可以得到1个幸运号码，当商品筹集的果仁达到规定数额时，后台将自动从所有幸运号码中抽出一个，如果您是幸运的获奖用户，果仁宝客服将在24小时内电话联系您！系统消息也会第一时间告诉您哦~
				注： 如果本期筹得的果仁数不足， 会将支付的果仁自动返还给您 ",
				"lastActivityId": 1023 "lastWinnerUserId": 222,
				"LastWinnerNick": "陈大同",
				"lastWinnerCode": "10086",
			}
		}
	 */
	add('duobaoAct', '/duobao/activities');

	/** 55.果仁夺宝中奖用户参与码列表
	 * 参数:
		{
			"winnerUserId": 1,
			"activityId": 1
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success",
			"data": {
				"activityId": 1024,
				"buyGopNum": 4,
				"winnerCode": "10086",
				"codeList": [{
					"code": "10045"
				}, {
					"code": "10086"
				}, {
					"code": "10042"
				}, {
					"code": "10048"
				}]
			}
		}
	 */
	add('duobaoWin', '/duobao/winnerCodeList');

	/** 56.购买果仁夺宝兑换码
	 * 参数:
		{
			"gopToken": "dsids9fwrnffodvuioer4wemfklffiow4wrekac,s;ldkflds4",
			"activityId": 1,
			"orderGop": 22,
			"payPwd": "23424"
		}
	 * 返回:
		{
			"status": "200",
			"msg": "success",
			"data": {
				"activityId": 1024,
				"consumeOrderId": 33 "productId": 4,
				"productName": "果仁夺宝",
				"beneficiary": "北京果仁宝科技有限公司",
				"orderMoney": 3,
				"orderCode": "2342342323423425756765",
				"tradeNo": "201566606066034543534"
			}
		}
	 */
	add('duobaoCode', '/duobao/bugCode');

	/** 57.获取商品列表
	 * 参数:
		{
			"productType": "SHOUJICHONGZHIKA"
		}
	 * 返回:
		{
			"data": {
				"productList": [{
					"productDesc": "话费充值",
					"createTime": "2015-12-18 11:33:17",
					"extraContent": "{\"price\":30,\"carrier\":\"联通\"}",
					"currency": "RMB",
					"updateTime": "2015-12-18 11:33:17",
					"id": 2,
					"price": 12.900000,
					"productName": "30元话费",
					"productType": "SHOUJICHONGZHIKA"
				}, {
					"productDesc": "话费充值",
					"createTime": "2015-12-18 11:33:33",
					"extraContent": "{\"price\":30}",
					"currency": "RMB",
					"updateTime": "2015-12-18 11:33:33",
					"id": 3,
					"price": 12.900000,
					"productName": "30元话费",
					"productType": "SHOUJICHONGZHIKA"
				}, {
					"productDesc": "话费充值aaaaa",
					"createTime": "2015-12-18 13:30:49",
					"extraContent": "{\"price\":30}",
					"currency": "RMB",
					"updateTime": "2015-12-20 09:52:54",
					"id": 13,
					"price": 12.900000,
					"productName": "30元话费",
					"productType": "SHOUJICHONGZHIKA"
				}]
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('productList', '/consume/product/list');

	/** 62.手机号归属地和运营商
	 * 参数:
		{
			"phone": "13146556570"
		}
	 * 返回:
		{
			"data": {
				"carrier": "北京联通",
				"province": "北京",
				"phone": "13146556570"
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('phoneInfo', '/common/phone/info');

	/** 63.最近3个充值手机号码
	 * 参数:
		{
			"gopToken": "13146asefaergesr安慰人提起igewaasgae556570"
		}
	 * 返回:
		{
			"data": {
				"phoneList": ["13146556570", "13146556590"]
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('phoneLastest', '/consume/product/phoneRecharge/lastest');

	/** 64.发送手机号验证码
	 * 参数:
		{
			"gopToken": "aaaaqqqqwwwcsdfdsfgdsgsdrgsdr"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('phoneSendCode', '/common/user/phone/sendCode');

	/** 65.验证手机短信验证码是否正确
	 * 参数:
		{
			"gopToken":"3452345234534dfg",
		  	"identifyingCode":"15079817107"
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('phoneIdentifyingCode', '/common/user/phone/identifyingCode');
	
	/** 66.发送银行手机号验证码
	 * 参数:
		{
			"gopToken": "aaaaaaa",
			"bankId": 54
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('bankSendCode', '/common/bank/phone/sendCode');

	/** 67.验证银行手机短信验证码是否正确
	 * 参数:
		{
			"gopToken": "asdafsafqw",
			"identifyingCode": "15079817107",
			"bankId": 54
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('bankIdentifyingCode', '/common//bank/phone/identifyingCode');

	/** 73.删除消费订单中手机充值历史记录
	 * 参数:
		{
			"gopToken": "65fab80e0a754dcd9f9039f63fb12c57",
			"phoneSet": ["13146556570", "13146556571", "13146556572", "13146556573"]
		}
	 * 返回:
		{
			"status": 200,
			"msg": "success"
		}
	 */
	add('phoneDelete', '/consume/product/phoneRecharge/clean');
    
    /** 70 识别银行卡
     * 参数:
		{  
  			"bankCard" : "6226220124577111"
		}
	 * 返回:
		{
			"data" : {
				"cardType" : "SAVINGS_DEPOSIT_CARD",
				"bankName" : "中国民生银行"
			},
			"msg" : "success",
			"status" : "200"
		}
	 */
	add('checkBankCard', '/common/checkBankCard');
    
    add('transferValidate', '/transfer/validate');
    
	add('transferQuery', '/transfer/query');
    
	add('transferRecent', '/transfer/recent');

	/** 77.微信签名
	 * 参数:
		{
			"url": "http://aaa.aaa.aaa/aaa.aaa.html"
		}
	 * 返回:
		{
			"data": {
				"signatureData": {
					"signature": "84dee54c8146735be5b0f0dfcf209bb7be6fde88",
					"appId": "wx55923db8dfb94e44",
					"url": "http://www.goopal.me/index.html",
					"nonceStr": "bd659fed25598453244298f3e5f95972",
					"timestamp": "1452421099814"
				}
			},
			"msg": "success",
			"status": "200"
		}
	 */
	add('weixinInfo', '/common/weixin/signature');

	/**
	 * 68.获取密保问题 
	 * {
		    "gopToken":"e8er843er834i8df8d34jddfdf89df89dffd8d8f934j43jk34"，
		    "qusetionNumber":1
		}
		
		{
		    "status":200,
		    "msg":"success",
		    "data":{"question":"我爸爸叫什么？"}
		}
	 */
	add('getQuestion', '/security/getQuestion');
	
	return api;
});
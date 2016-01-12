

// 张树垚 2015-08-20 09:22:35 创建
// 请求后端



define(function() {

	// var basePath = '.';
	// var basePath = 'http://192.168.10.111:8080/GOPServer';
	// var basePath = 'http://192.168.10.102:8080/hhhh';
	var basePath = typeof __basePath === 'undefined' ? 'http://localhost:8080/hhhh' : __basePath;

	/**
	 * [api 接口集合]
	 */
	var api = {};

	/**
	 * [add 添加接口]
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
		api[name] = function(data, success) {
			if (isRequesting) {return;}
			isRequesting = true;
			xhr && xhr.abort();
			if (typeof data === 'function') {
				success = data;
				data = null;
			}
			console.log(url);
			xhr = $.ajax({
				url: basePath + url,
				type: 'post',
				data: data,
				dataType: 'json',
				success: function(data) {
					var result = data ? data.result ? data.result: data : null;
					callback && callback.call(this, result);
					success && success.call(this, result);
				},
				error: function(err) {
					console.log('Error: ', err)
				},
				complete: function() {
					xhr = null;
					isRequesting = false;
				}
			});
		};
	};

	/**
	 * 打印一条醒目的信息
	 * @Author   张树垚
	 * @DateTime 2015-10-29
	 * @param    {string}                 msg 信息
	 * @return   {undefined}
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

	/** 公用, 登录
	 * 参数:
		phone
		password
	 * 返回:
		{"err_code":"1","err_msg":"","result":{"reason":"密码错误!","result":"失败"}}
		{"err_code":"1","err_msg":"","result":{"reason":"","result":"成功"}}
	 */
	add('loginCheck', '/login/loginCheck.do');

	window.testLogin = function() { // 登录测试账号
		api.loginCheck({
			phone: '15895923083',
			password: 'tjy123'
		}, function(data) {
			switch(data.result) {
				case '成功':
					console.log(data)
					break;
				case '失败':
					alert('登录失败! 原因: ' + data.reason);
					break;
				default:
					console.log(data);
					alert('登陆失败! 请稍后再试!');
			}
		});
	};

	/** 公用, 退出登录
	 * 参数: 无
	 * 返回: 无
	 */
	add('closeSession', '/exit/closeSession.do');

	/** 公用, 获取吸顶条数据
	 * 参数: 无
	 * 返回:
		{
			"result": {
				"name": "zhangsan",
				"phone": "158****3081",
				"photo": "http://resourceyj.qiandai.com/group13/M00/21/DB/dNVJaVYXGJiAaeXKAAvea_OGt2M257.jpg",
				"totalGops": "0.0"
			}
		}
		{"result":"null"}
	 */
	add('getUserInfoTop', '/userManage/getUserInfoTop.do'); // 获取顶部信息

	/** 公用, 验证支付密码
	 * 参数: 1个
		payPass
	 * 返回:
		{"result":"true"}
		{"result":"false"}
		{"result":"error"}
	 */
	add('verifyPayPass', '/transfer/verifyPayPass.do');

	/** 公用, 当前实时果仁价
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"gopPrice": "0.1",
				"time": "2015-10-21 15:07:26"
			}
		}
	 */
	add('now', '/price/now.do', function(data) {
		window.__gop = parseFloat(data.gopPrice);
	});

	/** 公用, 添加银行卡
	 * 参数:
	 * bankname 银行名(中文)
	 * cardno 银行卡号
	 * phone 手机号
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"data": {
					"bankname": "zhong",
					"cardno": "**5452",
					"id": "18",
					"phone": "158****3058"
				},
				"result": "成功"
			}
		}
	 */
	add('addBankCard', '/bankCard/addBankCard.do');

	/** 公用, 用户是否实名认证
	 * 参数: 无
	 * 返回:
		成功:
			{
				"err_code": "1",
				"err_msg": "",
				"result": {
					"result": "成功"，
					"data": {
						"name": "zhangsan",
						"personId": "3*****************1"
					}
				}
			}
		失败:
			{
				"err_code": "1",
				"err_msg": "",
				"result": {
					"result": "失败"
				}
			}
	 */
	add('getValidateInfo', '/userManage/getValidateInfo.do');

	/** 注册页, 验证手机号是否已经被注册
	 * 参数:
	 * phone 手机号
	 * 返回:
		{err_code: "1", err_msg: "", result: 'exist'}
		{err_code: "1", err_msg: "", result: 'noExist'}
	 */
	add('checkPhoneRegister', '/register/checkPhoneRegistered.do');

	/** 注册页, 保存用户的注册信息到数据库
	 * 参数:
		phone		手机号
		pass		登录密码
		payPass	支付密码
		realName	实名
		persionId	身份证
		flag		是否跳过, 0:跳过, 1:正常
	 * 返回
		{err_code: "1", err_msg: "", result: {result: "成功"}}
		{err_code: "1", err_msg: "", result: {result: "失败", reason: "......"}}
	 */
	add('saveRegisterInfo', '/register/saveRegisterInfo.do');


	/** 设置页, 实名认证
	 * 参数:
	 * 返回:
	 */
	add('validatePersonInfo', './userManage/validatePersonInfo.do');

	/** 设置页, 登录密码查询
	 * 参数:
	 * 返回:
	 */
	add('checkPassword', './userManage/checkPassword.do');

	/** 设置页, 支付密码查询
	 * 参数:
	 * 返回:
	 */
	add('checkPaypassword', './userManage/checkPaypassword.do');

	/** 设置页, 登录密码修改
	 * 参数:
	 * 返回:
	 */
	add('updatePasswordByOld', './userManage/updatePasswordByOld.do');

	/** 设置页, 支付密码修改
	 * 参数:
	 * 返回:
	 */
	add('updatePaypassByOld', './userManage/updatePaypassByOld.do');

	/** 设置页, 获取密保状态
	 * 参数:
	 * 返回:
	 */
	add('getAllQuestion', './userManage/getAllQuestion.do');

	/** 设置页, 保存密保信息
	 * 参数:
	 * 返回:
	 */
	add('saveQuestion', './userManage/saveQuestion.do');

	/** 设置页, 添加联系人备注
	 * 参数:
	 * 返回:
	 */
	add('setGopsiteContactComment', './contact/setGopsiteContactComment.do');

	/** 设置页, 删除一个联系人
	 * 参数:
	 * 返回:
	 */
	add('deleteAccountGopsiteContactById', './contact/deleteAccountGopsiteContactById.do');

	/** 设置页, 批量删除联系人
	 * 参数:
	 * 返回:
	 */
	add('batchDeleteAccountGopsiteContacts', './contact/batchDeleteAccountGopsiteContacts.do');


	/** 转账页, 获取交易所地址
	 * 参数: 无
	 * 返回:
		{"result":"Gopeeeorcvvffwwefffweerrefhkrrdssipje"}
		{"result":"error"}
	 */
	add('getAccountExchangeAddress', '/transfer/getAccountExchangeAddress.do');

	/** 转账页, 验证用户交易所地址
	 * 参数:
		address
	 * 返回:
		{"result":"true"}
		{"result":"false"}
		{"result":"error"}
	 */
	add('verifyAccountExhcangeAddress', '/transfer/verifyAccountExhcangeAddress.do');

	/** 转账页, 获取该用户果仁数目
	 * 参数: 无
	 * 返回:
		{"result":"100.5"}
		{"result":"error"}
	 */
	add('getAccountGopNum', '/transfer/getAccountGopNum.do');

	/** 转账页, 获取该用户是否实名认证
	 * 参数: 无
	 * 返回:
		{"result":"true"}
		{"result":"false"}
		{"result":"error"}
	 */
	add('isAuthenticatedUser', '/transfer/isAuthenticatedUser.do');

	/** 转账页, 获取手续费
	 * 参数: 无
	 * 返回:
		{"result":"0.5"}
		{"result":"error"}
	 */
	add('getTransferFee', '/transfer/getTransferFee.do');

	/** 买入页, 实名认证
	 * 参数:
		realName 名字
		personId 身份证
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"data": {
					"personId": "3****************5",
					"realName": "张三"
				},
				"result": "成功"
			}
		}
		{"err_code":"1","err_msg":"","result":{"result":"失败","reason":"......"}}
	 */
	add('savePersonInfo', '/userManage/savePersonInfo.do');

	/** 转账页, 获取钱包最近联系人
	 * 参数: 无
	 * 返回:
		{
			"result": {
				"id": 12,
				"account": "ww1221",
				"contact": "GOPernrrej*******************rnkshfaarts",
				"aliasname": "B*b"
			}
		}
		{"result":"error"}
	 */
	add('getRencentlyWalletContact', '/contact/getRencentlyWalletContact.do');

	/** 转账页, 获取钱包所有联系人
	 * 参数: 无
	 * 返回:
		{
			"result": [{
				"account": "a60cc0282ed842ffbb47005626d2a252",
				"aliasname": "swqweeess",
				"contact": "GOP******dfdd",
				"id": 3
			}, {
				"account": "a60cc0282ed842ffbb47005626d2a252",
				"aliasname": "Bob",
				"contact": "GOPe********kffdd",
				"id": 2
			}]
		}
	 */
	add('getAllWalletContacts', '/contact/getAllWalletContacts.do');

	/** 转账页, 获取官网所有联系人
	 * 参数: 无
	 * 返回:
		{
			"result": [{
				"comm": "我是注释",
				"contact": "1111*2222",
				"id": 23,
				"realName": "*雨"
			}, {
				"comm": "",
				"contact": "1111*2222",
				"id": 30,
				"realName": "*雨"
			}, {
				"comm": "",
				"contact": "1111*2222",
				"id": 31,
				"realName": "*雨"
			}]
		}
	 */
	add('getAllGopSiteContacts', '/contact/getAllGopSiteContacts.do')

	/** 转账页, 转账到官网用户 (未输入密码，此时会创建一个等待付款的订单)
	 * 参数：
		amount   要转账的果仁数量
		equivalentAmountOfRMB   相当于人民币的价格
		phone   对方手机号
		gopsiteContactId   联系人id(与手机号只传一个即可)
		note   附带消息
		payPass   支付密码
	 * 返回:
		login
		insufficient balance
		target phone is not exist in GOPsite
		wrong password
		OK
	 */
	add('transferToGOPSiteAccount', '/transfer/transferToGOPSiteAccount.do');

	/** 转账页, 付款(删除)
	 * 参数:
		orderId   订单ID  （ 该参数非必须的 ）
		payPass   支付密码
	 * 返回:
		login
		error
		wrong password
		fail
		OK
	 */
	// add('transferPay', '/transfer/transferPay.do');

	/** 转账页, 转账到钱包地址
	 * 参数:
		amount   要转账的果仁数量
		equivalentAmountOfRMB   相当于人民币的价格
		address   目的地址
		walletContactId   目标联系人id
		payPass   支付密码
	 * 返回:
		login
		error
		fail
		OK
	 */
	add('transferToGOPWallet', '/transfer/transferToGOPWallet.do');

	/** 转账页, 转账到交易所地址
	 * 参数:
		amount   要转账的果仁数量
		address   目的地址
		payPass   支付密码
	 * 返回:
		login
		error
		fail
		OK
	 */
	add('transferToMyExchangeAccount', '/transfer/transferToMyExchangeAccount.do');

	/** 收益页, 收益详情页上面四条数据
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"history": 55, // 历史收益
				"percent": 0, // 30日年化收益率
				"price": 9.8, // 结算价格(昨日零时价)
				"yesterday": 11 // 昨日收益
			}
		}
	 */
	add('getTopRecord', '/earningRecord/getTopRecord.do');

	/** 收益页, 收益详情页列表
	 * 参数:
	 * [Number] pageNum
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"count": 5,
				"list": [{
					"earningNum": 0,
					"price": "11",
					"time": "2015-10-18",
					"totalEarning": 0
				}, {
					"earningNum": 0,
					"price": "10",
					"time": "2015-10-17",
					"totalEarning": 0
				}, {
					"earningNum": 0,
					"price": "11.2",
					"time": "2015-10-16",
					"totalEarning": 0
				}, {
					"earningNum": 0,
					"price": "9.8",
					"time": "2015-10-15",
					"totalEarning": 0
				}, {
					"earningNum": 0,
					"time": "2015-10-14",
					"totalEarning": 0
				}],
				"pageNum": 1,
				"pageTotal": 1
			}
		}
	 */
	add('getEarningRecord', '/earningRecord/getEarningRecord.do');

	/** 个人首页, 获取用户资产信息
	 * 参数: 无
	 * 返回
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"address": "5386bedcbc744d83a08574b4b4863263",
				"cardNum": "0", // 银行卡
				"lastLoginTime": "2015-10-20 16:44:46.0",
				"name": "zhangsan", // 未实名认证没有这个字段
				"registerTime": "2015-10-16 17:16:44.0",
				"totalEarning": "103",
				"uid": "150****3083",
				"photo": "...." // 图片地址
			}
		}
	 */
	add('getUserInfoFromSession', '/userManage/getUserInfoFromSession.do');

	/** 个人首页, 七天单价
	 * 参数: 无
	 * 返回: 8条
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"list": [{
					"earningDate": "2015-10-21",
					"gopprice": 12,
					"traderAmout": 0,
					"week": "星期三"
				}, {
					"earningDate": "2015-10-20",
					"gopprice": 11,
					"traderAmout": 0,
					"week": "星期二"
				}, {
					"earningDate": "2015-10-19",
					"gopprice": 13.565,
					"traderAmout": 0,
					"week": "星期一"
				}, {
					"earningDate": "2015-10-18",
					"gopprice": 11,
					"traderAmout": 0,
					"week": "星期日"
				}, {
					"earningDate": "2015-10-17",
					"gopprice": 10,
					"traderAmout": 0,
					"week": "星期六"
				}, {
					"earningDate": "2015-10-16",
					"gopprice": 11.222222555,
					"traderAmout": 0,
					"week": "星期五"
				}, {
					"earningDate": "2015-10-15",
					"gopprice": 9.123451,
					"traderAmout": 0,
					"week": "星期四"
				}, {
					"earningDate": "2015-10-14",
					"gopprice": 8.2,
					"traderAmout": 0,
					"week": "星期三"
				}]
			}
		}
	 */
	add('seven', '/price/seven.do');

	/** 个人首页, 三十天单价
	 * 参数: 无
	 * 返回: 31条, 格式同上
	 */
	add('thirty', '/price/thirty.do');

	/** 个人首页, 个人首页交易记录
	 * 参数: 无
	 * 交易状态:
		waitForPay: 进行中(等待付款)
		closed: 已关闭
		processing: 进行中(已付款, 银行处理中)
		failed: 交易失败
		success: 交易成功
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"list": [{
					"message": "买入",					// 信息
					"moneyChange": "1",					// 金额变化
					"number": 1.4430080522639456E19,	// 订单号
					"opponent": "",
					"reducedTurnover": "1.00",
					"status": "success",				// 状态
					"targetType": "",
					"time": "2015-10-07 19:34:09.0",	// 时间
					"transferType": ""
				}, {
					"message": "买入",
					"moneyChange": "110",
					"number": 1.445050841198858E19,
					"opponent": "",
					"reducedTurnover": "110.00",
					"status": "success",
					"targetType": "",
					"time": "2015-10-07 19:34:09.0",
					"transferType": ""
				}, {
					"message": "买入",
					"moneyChange": "333",
					"number": 1.4430853926763475E19,
					"opponent": "",
					"reducedTurnover": "333.00",
					"status": "success",
					"targetType": "",
					"time": "2015-10-07 19:34:09.0",
					"transferType": ""
				}, {
					"message": "买入",
					"moneyChange": "3.3333333333333335",
					"number": 1.4434239982221582E19,
					"opponent": "",
					"reducedTurnover": "3.33",
					"status": "success",
					"targetType": "",
					"time": "2015-10-07 19:34:09.0",
					"transferType": ""
				}, {
					"message": "买入",
					"moneyChange": "1",
					"number": 1.4430080490230288E19,
					"opponent": "",
					"reducedTurnover": "1.00",
					"status": "success",
					"targetType": "",
					"time": "2015-10-07 19:34:09.0",
					"transferType": ""
				}]
			}
		}
	 */
	add('getLastRecord', '/transactionRecord/getLastRecord.do');

	/** 买入页, 可用快捷支付接口
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"result": {
					"list": [{
						"bankname": "jianshe",
						"cardno": "**2222",
						"id": "1",
						"phone": "158****3083"
					}, {
						"bankname": "jianshe",
						"cardno": "**3333",
						"id": "2",
						"phone": "158****3083"
					}],
					"name": "zhangsan",
					"personId": "3****************2"
				}
			}
		}
	 */
	add('getWithdrawInfo', '/bankCard/getWithdrawInfo.do');

	/** 买入页, 获得手机验证码
	 * 参数: 
	 * phone
	 * id(与phone只传一个即可)
	 * 返回: 
		{"err_code":"1","err_msg":"","result":{"reason":"失败"}}
		{"err_code":"1","err_msg":"","result":{"reason":"成功","token":"39031445511220719"}}
	 */
	add('sendPhoneSeccode', '/mobile/sendPhoneSeccode.do');

	/** 买入页, 发送手机验证码
	 * 参数:
	 * id/phone 快捷支付id或手机号
	 * seccode 验证码
	 * token 匹配
	 * 返回:
		{"err_code":"1","err_msg":"","result":{"result":"成功"}}
		{"err_code":"1","err_msg":"","result":{"reason":"验证失败","result":"失败"}}
	 */
	add('checkPhoneSeccode', '/mobile/checkPhoneSeccode.do');

	/** 买入页, 库存量
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"totalAmout": "500000"
			}
		}
	 */
	add('total', '/gopTotalAmout/total.do');

	/** 买入页, 获取所有支持银行
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"result": [{
					"bankcode": "0100",
					"bankname": "邮储银行",
					"id": "1"
				}, {
					"bankcode": "0102",
					"bankname": "中国工商银行",
					"id": "2"
				}, {
					"bankcode": "0103",
					"bankname": "中国农业银行",
					"id": "3"
				}, {
					"bankcode": "0104",
					"bankname": "中国银行",
					"id": "4"
				}, {
					"bankcode": "0105",
					"bankname": "中国建设银行",
					"id": "5"
				}, {
					"bankcode": "0301",
					"bankname": "交通银行",
					"id": "6"
				}, {
					"bankcode": "0302",
					"bankname": "中信银行",
					"id": "7"
				}, {
					"bankcode": "0303",
					"bankname": "中国光大银行",
					"id": "8"
				}, {
					"bankcode": "0305",
					"bankname": "中国民生银行",
					"id": "9"
				}, {
					"bankcode": "0306",
					"bankname": "广东发展银行",
					"id": "10"
				}, {
					"bankcode": "0307",
					"bankname": "深发展银行",
					"id": "11"
				}, {
					"bankcode": "0308",
					"bankname": "招商银行",
					"id": "12"
				}, {
					"bankcode": "0309",
					"bankname": "兴业银行",
					"id": "13"
				}, {
					"bankcode": "0340",
					"bankname": "中国平安银行",
					"id": "14"
				}]
			}
		}
	 */
	add('getAllBankName', '/bankCard/getAllBankName.do');

	/** 买入页, 创建订单
	 * 参数:
	 * id 快捷支付ID
	 * totalMoney 人民币
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"orderId": "14458542231793019208",
				"reason": "银行预留手机号码输入错误超过三次",
				"result": "失败"
			}
		}
	 */
	add('createBuyOrderInfo', '/operationBuy/createBuyOrderInfo.do');

	/** 买入页, 买入提交
	 * 参数:
	 * orderId 订单号
	 * id 快捷支付id
	 * payPass 支付密码
	 * seccode 手机验证码
	 * token 手机验证码token
	 * 返回:
		{"err_code":"1","err_msg":"","result":{"reason":"密码错误","result":"失败"}}
	 */
	add('updateBuyOrderInfo', '/operationBuy/updateBuyOrderInfo.do');

	/** 买入页, 刷新查看买入订单状态
	 * 参数:
	 * orderId 订单号
	 * 返回
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"data": {
					"account": "4bd08e3417a74c38bc5a58da948008c1",
					"bankcardNo": "1",
					"endTime": 1445593424000,
					"gopNum": 1,
					"gopPrice": 0.1,
					"orderId": "14455914681773520234",
					"startTime": 1445591468000,
					"state": "failed",
					"totalMoney": 10
				},
				"result": "失败"
			}
		}
	 */
	add('viewResult', '/operationBuy/viewResult.do');

	/** 交易记录页
	 * 参数:
		type		交易分类('0':全部, '1':买入, '2': 转账) -- type为空或者0的时候代表全部
		status		交易状态('waitForPay','closed','processing'(交易进行中),'failed','success') -- status全部的时候, 不用传递过来
		beginTime	开始时间(格式YYYY-MM-DD)
		endTime		结束时间(格式YYYY-MM-DD)
		pageNum		当前页数
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"beginTime": "2015-10-06",
				"count": 27,
				"endTime": "2015-11-06",
				"list": [{
					// time;				// 时间
					// message;				// 信息
					// number;				// 交易号
					// opponent;			// 对方
					// moneyChange;			// 金额变化
					// reducedTurnover;		// 换算交易额
					// status;				// 状态
					// transferType;		// 转账的类型('in'|'out')
					// targetType;			// 转账的地方	
					"message": "买入",
					"moneyChange": "+55G",
					"number": 1.4458542231793019E19,
					"reducedTurnover": "5.50",
					"status": "waitForPay",
					"time": "2015-10-26 18:10:23.0"
				}, {
					"message": "买入",
					"moneyChange": "+44G",
					"number": 1.4458539141533596E19,
					"reducedTurnover": "4.40",
					"status": "waitForPay",
					"time": "2015-10-26 18:05:14.0"
				}, {
					"message": "买入",
					"moneyChange": "+33G",
					"number": 1.4458539135216517E19,
					"reducedTurnover": "3.30",
					"status": "waitForPay",
					"time": "2015-10-26 18:05:13.0"
				}, {
					"message": "买入",
					"moneyChange": "+22G",
					"number": 1.4458537209783908E19,
					"reducedTurnover": "2.20",
					"status": "waitForPay",
					"time": "2015-10-26 18:02:01.0"
				}, {
					"message": "买入",
					"moneyChange": "+13G",
					"number": 1.4458537007689265E19,
					"reducedTurnover": "1.30",
					"status": "waitForPay",
					"time": "2015-10-26 18:01:41.0"
				}, {
					"message": "买入",
					"moneyChange": "+19G",
					"number": 1.44585370076851E19,
					"reducedTurnover": "1.90",
					"status": "waitForPay",
					"time": "2015-10-26 18:01:41.0"
				}, {
					"message": "买入",
					"moneyChange": "+18G",
					"number": 1.4455980150633007E19,
					"reducedTurnover": "1.80",
					"status": "waitForPay",
					"time": "2015-10-23 19:00:15.0"
				}, {
					"message": "买入",
					"moneyChange": "+17G",
					"number": 1.4455965781091836E19,
					"reducedTurnover": "1.70",
					"status": "waitForPay",
					"time": "2015-10-23 18:36:18.0"
				}, {
					"message": "买入",
					"moneyChange": "+16G",
					"number": 1.4455944670979248E19,
					"reducedTurnover": "1.60",
					"status": "waitForPay",
					"time": "2015-10-23 18:01:07.0"
				}, {
					"message": "买入",
					"moneyChange": "+15G",
					"number": 1.4455934490352986E19,
					"reducedTurnover": "1.50",
					"status": "waitForPay",
					"time": "2015-10-23 17:44:09.0"
				}],
				"page": 3,
				"pageNum": "1",
				"type": "1"
			}
		}
	 */
	add('getTransactionRecord', '/transactionRecord/getTransactionRecord.do');

	/** 交易记录页, 关闭
	 * 参数:
		orderId		订单号
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"result": "ok"
			}
		}
	 */
	add('closeTransaction', '/transactionRecord/closeTransaction.do');

	/** 交易记录页, 详情
	 * 参数:
		orderId		订单号
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"merchants": "果仁宝基金保值管理有限公司",
				"result": {
					"gopPrice": "2",
					"message": "买入",
					"moneyChange": "+1G",
					"number": "14430080490230289263",
					"opponent": "",
					"reducedTurnover": "2.00",
					"status": "closed",
					"targetType": "",
					"time": "2015-10-22 19:34:09.0",
					"transferType": ""
				}
			}
		}
	 */
	add('detail', '/transactionRecord/detail.do');

	/**
	 * 银行卡页, 获取所有快捷支付
	 * 参数: 无
	 * 返回:
		{
			"err_code": "1",
			"err_msg": "",
			"result": {
				"list": [{
					"account": "97bcee45fc424a00b77489e5e7c43c8e",
					"bankname": "中国工商银行",
					"cardno": "***********5846",
					"id": "1",
					"lastUseTime": "2015-11-16 10:42:55.0",
					"phone": "158****3080",
					"state": 0
				}, {
					"account": "97bcee45fc424a00b77489e5e7c43c8e",
					"bankname": "中国建设银行",
					"cardno": "*******4506",
					"id": "2",
					"lastUseTime": "2015-11-16 10:42:55.0",
					"phone": "158****3080",
					"state": 0
				}]
			}
		}
		"state": 0(未激活), 1(激活)
	 */
	add('getQuickPayment', '/bankCard/getQuickPayment.do');

	/** 银行卡页, 删除银行卡
	 * 参数:
		cardno 卡号
	 * 返回:
		{"err_code":"1","err_msg":"","result":{"result":"成功"}}
	 */
	add('closeBankcard', '/bankCard/closeBankcard.do');


	return api;
});






// 张树垚 2016-01-10 00:31:49 创建
// H5微信端 --- 账单


require(['router', 'api', 'get', 'filters', 'h5-view', 'h5-component-bill', 'iScroll4',
	'h5-weixin'
], function(router, api, get, filters, View, H5bill, iScroll) {

	router.init();

	var gopToken = $.cookie('gopToken');
	var page = 1; // 账单页数, 当返回列表长度小于当前列表长度时, 置零, 不再请求
	var size = 20; // 账单列表

	var main = $('.account'); // 主容器
	var init = function() { // 初始化
		switch (get.data.from) {
			case 'wx_info': // 来自微信消息
				getAccount(get.data.type, get.data.id);
				router.to('/view/account-bill');
				break;
			default:
				router.to('/');
				getList();
		}
	};

	var originList = [];
	var bottomHeight = 20; // 下拉加载的高度
	var accountScroll = new iScroll('account', {
		vScrollbar: false,
		preventDefault: true,
		click: true,
		// useTransition: true,
		onScrollMove: function() {},
		onScrollEnd: function() {
			if (this.y - bottomHeight < this.maxScrollY) {
				getList();
			}
		},
	});
	var getList = function(callback) { // 获取列表
		if (vm.loading) {
			return;
		}
		if (!page) {
			vm.loading = true;
			vm.loadingWord = '大大, 已经没有了...';
			setTimeout(function() {
				vm.loading = false;
			}, 1000);
			return;
		}
		vm.loading = true;
		api.billList({
			gopToken: gopToken,
			billListPage: page,
			billListPageSize: size
		}, function(data) {
			if (data.status == 200) {
				vm.loading = false;
				vm.list = dataHandler(originList = originList.concat(data.data.list));
				getPhotos();
				page = data.data.list.length < size ? 0 : page + 1; // 是否停止请求
				callback && callback(data);
				!main.hasClass('on') && setTimeout(function() {
					main.addClass('on');
				}, 200);
			} else {
				$.alert(data.msg);
				console.log(data);
			}
		});
	};
	var getPhotos = function() { // 获得头像和人名, 需要在vm赋值list完成后修改属性
		vm.list.forEach(function(month) {
			month.days.forEach(function(day) {
				day.bills.forEach(function(bill) {
					if (bill.type === 'transfer' && !bill.hasImg) {
						api.billPhoto({
							gopToken: gopToken,
							businessId: bill.id,
							businessType: bill.type
						}, function(data) {
							if (data.status == 200) {
								// bill.img = '111';
								// bill.desc = '111';
								bill.hasImg = true; // 防止重复多次请求
								data.data.photoUrl && (bill.img = data.data.photoUrl);
								data.data.name && (bill.desc = '转账 - ' + data.data.name);
							} else {
								console.log(data);
							}
						});
					}
				});
			});
		});
	};
	var getAccount = function(type, id) { // 获得account信息并挂载到billViewModel上, 并不负责展示
		console.log(type)
		type = (type + '').toUpperCase();
		switch (type) {
			case 'TRANSFER_OUT': // 转账, 转出
				api.transferQuery({
					gopToken: gopToken,
					transferOutId: id
				}, function(data) {
					/*{
						"data": {
							"transferOut": {
								"serviceFee": 0.010000,
								"address": "asdfghjkl",
								"updateTime": "2015-12-09 12:12:12",
								"type": "ME_WALLET",
								"gopNum": 12.340000,
								"userId": 26,
								"createTime": "2015-09-10 09:12:26",
								"phone": "13146556570",
								"transContent": "(づ￣3￣)づ╭?～",
								"personId": 1,
								"walletId": 1,
								"id": 1,
								"failureMsg": "还不知道失败原因",
								"status": "PROCESSING"
							}
						},
						"msg": "success",
						"status": "200"
					}*/
					console.log(data);
				});
				break;
			case 'TRANSFER_IN': // 转账, 转入
				api.transferInQuery({
					gopToken: gopToken,
					transferInId: id
				}, function(data) {
					/*{
						"data": {
							"transferIn": {
								"transferTime": "2016-01-04 17:58:15",
								"transferAddress": "uga000000",
								"id": 11,
								"gopNum": 0.010000,
								"userId": 23,
								"status": "SUCCESS",
								”personId”: 111,
								”transContent”: ”转账说明”
							}
						},
						"msg": "success",
						"status": "200"
					}*/
					console.log(data)
				});
				break;
			case 'BUYIN_ORDER': // 买入, 消息
			case 'BUY_IN': // 买入, 列表
				api.queryBuyinOrder({
					gopToken: gopToken,
					buyinOrderId: id,
					payType: 'WEIXIN_MP_PAY'
				}, function(data) {
					/*{ // 已支付，成功
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
								"payResult": "失败"
							}
						},
						"msg": "success",
						"status": "200"
					}*/
					/*{ // 已支付，失败
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
					}*/
					/*{ // 未支付，payType=UNION_PAY
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
					}*/
					console.log(data)
				});
				break;
			case 'CONSUME_ORDER': // 消费, 消息
			case 'PAY': // 消费, 列表
				api.query({
					gopToken: gopToken,
					consumeOrderId: id
				}, function(data) {
					/*{
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
								”gopPrice”: 2.3,
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
					}*/
					console.log(data);
				});
				break;
			default:
				$.alert('未知类型的账单<br>值为 ' + type);
		}
	};

	// 处理 getList 的工具方法 -- 开始
	var timeHandler = function(time) { // 时间处理
		// if (typeof time === 'string') {
		// 	// 输入: "2016-01-08 05:30:16"
		// 	var match = time.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2})\:(\d{2})\:(\d{2})/);
		// 	return 'year,month,day,hour,minute,second'.split(',').reduce(function(result, item, index) {
		// 		result[item] = parseInt(match[index + 1]);
		// 		return result;
		// 	}, {});
		// }
		if (time.constructor === Date) {
			return 'year:getFullYear,month:getMonth,date:getDate,day:getDay,hour:getHours,minute:getMinutes,second:getSeconds'.split(',').reduce(function(result, item) {
				item = item.split(':');
				item[1] = time[item[1]]();
				result[item[0]] = item[1];
				switch (item[0]) { // 个别特殊处理
					case 'month':
						result.month2 = item[1] + 1; // 月份(阿拉伯数字)
						result.month3 = item[1] >= 10 ? item[1] === 10 ? '十一' : '十二' : '一二三四五六七八九十' [item[1]]; // 月份(中文数字)
						break;
					case 'day':
						result.day2 = '日一二三四五六' [item[1]]; // 周(中文数字)
						break;
					case 'hour':
						result.hour2 = item[1] < 10 ? ('0' + item[1]) : ('' + item[1]);
						break;
					case 'minute':
						result.minute2 = item[1] < 10 ? ('0' + item[1]) : ('' + item[1]);
						break;
				}
				return result;
			}, {});
		}
	};
	var timeClearHour = function(time) { // 干掉小时, 分钟, 秒, 毫秒
		if (time.constructor === Date) {
			var tmp = new Date(time.getTime());
			tmp.setHours(0);
			tmp.setMinutes(0);
			tmp.setSeconds(0);
			tmp.setMilliseconds(0);
			return tmp;
		}
	};
	var timeDayDiffer = function(timeA, timeB) { // 两个时间的日期差
		if (timeA.constructor === Date && timeB.constructor === Date) {
			return Math.round((timeClearHour(timeA).getTime() - timeClearHour(timeB).getTime()) / 1000 / 60 / 60 / 24)
		}
	};
	var timeCompare = function(timeA, timeB) { // 已A为准, 返回B是A的今天, 昨天, 前天
		if (timeA.constructor === Date && timeB.constructor === Date) {
			if (timeA.getTime() >= timeB.getTime()) {
				return ['今天', '昨天', '前天'][timeDayDiffer(timeA, timeB)];
			}
		}
	};
	var parseDate = function(time) { // 把字符串时间转为对应Date实例
		// 2016-01-14 02:33:44
		var match = time.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2})\:(\d{2})\:(\d{2})/);
		return 'setFullYear,setMonth,setDate,setHours,setMinutes,setSeconds'.split(',').reduce(function(date, item, index) {
			if (item === 'setMonth') {
				match[index + 1] -= 1;
			}
			date[item](parseInt(match[index + 1]));
			return date;
		}, new Date());
		// return new Date(time);
	};

	var now = new Date(); // 当前时间
	var nowMonth = now.getMonth(); // 当前月份
	var dataAdd = function(kind, bills, item) {
		var type = H5bill.typeClass[item.type];
		var bill = {
			id: item.businessId,
			img: '',
			desc: item.businessDesc,
			status: H5bill.statusZhCN[item.status],
			type: type,
			originType: item.type
		};
		var types = {
			money: 'money',
			gop: 'gopNumber'
		};
		var coins = {
			money: '¥',
			gop: 'G'
		}
		bill.change = numHandler(item[types[kind]], coins[kind]);
		bills.push(bill);
	};
	var dataHandler = function(data) {
		return data.map(function(item) { // 确定时间
			item._date = parseDate(item.status === 'SUCCESS' ? item.businessTime : item.createTime);
			item._dateTime = item._date.getTime();
			return item;
		}).sort(function(item1, item2) { // 排序
			return item2._dateTime - item1._dateTime;
		}).reduce(function(result, item) { // 提取
			var time = timeHandler(item._date);
			var type = H5bill.typeClass[item.type];
			var bills = [];
			switch (type) { // 账单类型
				case 'phone': // 消费果仁, 果仁+人民币
					item.gopNumber && dataAdd('gop', bills, item);
					item.money && dataAdd('money', bills, item);
					break;
				case 'buy': // 买果仁, 人民币
					dataAdd('money', bills, item);
					break;
				case 'transfer': // 转果仁, 果仁
					dataAdd('gop', bills, item);
					break;
				default:
					console.log(item);
			}
			var compare = timeCompare(now, item._date);
			var day = {
				_time: item._dateTime,
				day: compare ? compare : ('周' + time.day2),
				time: compare ? (time.hour2 + ':' + time.minute2) : (time.month2 + '-' + time.date),
				bills: bills
			};
			if (result.length > 0 && result[result.length - 1].month2 === time.month2) { // 和上个月相同
				result[result.length - 1].days.push(day);
			} else { // 没有这个月份, 创建
				result.push({
					month: nowMonth === time.month ? '本月' : (time.month2 + '月'),
					month2: time.month2,
					days: [day]
				});
			}
			return result;
		}, []);
	};
	var numHandler = function(number, unit) { // 数值处理
		return (number > 0 ? '+' : '-') + ' ' + unit + ' ' + Math.abs(filters.fix(number));
	};
	// 处理 getList 的工具方法 -- 结束

	var vm = avalon.define({
		$id: 'account',
		loading: false,
		loadingWord: '加载中...',
		list: [],
		listRepeatCallback: function() { // 循环结束回调
			setTimeout(function() {
				accountScroll.refresh();
			}, 200);
		},
		showAccount: function(ev) { // 显示账单详情(事件代理)
			var data = $(ev.target).closest('.account-item').get(0).dataset;
			getAccount(data.type, data.id);
			router.go('/view/account-bill');
		}
	});
	avalon.scan(main.get(0), vm);

	var bill = $('.account-bill');
	var billView = new View('account-bill');
	var billInitOptions = { // 初始化
		type: '', // 类型
		status: '', // 订单状态
		headClass: '', // 头部样式名
		headContent: '', // 头部内容
		waitForPay: false, // 等待支付
		failReason: '', // 失败原因
		orderMoney: 0, // 订单金额
		payMoney: 0, // 支付金额
		payGop: 0, // 支付果仁数
		productDesc: '', // 商品信息
		orderTime: '', // 交易时间
		createTime: '', // 创建时间
		orderCode: '', // 订单号
		ifFinishButton: false, // 是否显示"完成"按钮
		ifPayButton: false, // 是否显示"前往支付"按钮
		ifShowMore: false, // 是否显示"更多"
	};
	var billViewModel = avalon.define($.extend({
		$id: 'account-bill',
		finish: function() { // 完成

		},
		gotoPay: function() { // 前往支付

		},
		showMore: function() { // 更多

		},
	}, billInitOptions));
	var billViewModelSet = function(options) {
		return $.extend(billViewModel, billInitOptions, options);
	};
	avalon.scan(bill.get(0), billViewModel);
	billView.on('hide', function() {
		if (!vm.list.length) { // 没有list长度时获取list
			getList();
		}
	});

	init();
});

// 张树垚 2016-01-10 00:31:49 创建
// H5微信端 --- 账单


require(['router', 'api', 'h5-weixin'], function(router, api) {

	// 1.下拉加载
	// 2.点击详情

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var page = 1; // 账单页数, 当返回列表长度小于当前列表长度时, 置零, 不再请求
	var size = 20; // 账单列表

	var main = $('.account');

	var getList = function() {
		if (!page) { return; }
	};

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
				if (item[0] === 'month') {
					result.month2 = item[1] + 1; // 月份(阿拉伯数字)
					result.month3 = item[1] >= 10 ? item[1] === 10 ? '十一' : '十二' : '一二三四五六七八九十'[item[1]]; // 月份(中文数字)
				}
				if (item[0] === 'day') {
					result.day2 = '日一二三四五六'[item[1]]; // 周(中文数字)
				}
				if (item[0] === 'hour') {
					result.hour2 = item[1] < 10 ? ('0' + item[1]) : ('' + item[1]);
				}
				if (item[0] === 'minute') {
					result.minute2 = item[1] < 10 ? ('0' + item[1]) : ('' + item[1]);
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

	var numHandler = function(number, unit) {
		return (number > 0 ? '+' : '-') + ' ' + unit + ' ' + (Math.abs(number));
	};

	var now = new Date();
	var nowMonth = now.getMonth();
	var status = {
		PROCESSING: '进行中',
		SUCCESS: '交易成功',
		FAILURE: '交易失败',
		CLOSE: '交易关闭',
	};
	var typeClasses = {
		TRANSFER_IN: 'transfer',
		TRANSFER_OUT: 'transfer',
		BUY_IN: 'buy',
		PAY: 'phone',
	};
	var parseDate = function(time) { // 把字符串时间转为对应Date实例
		// 2016-01-14 02:33:44
		var match = time.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2})\:(\d{2})\:(\d{2})/);
		return 'setFullYear,setMonth,setDate,setHours,setMinutes,setSeconds'.split(',').reduce(function(date, item, index) {
			if (item === 'setMonth') { match[index + 1] -= 1; }
			date[item](parseInt(match[index + 1]));
			return date;
		}, new Date());
		// return new Date(time);
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
			var type = typeClasses[item.type];
			var bills = [];
			if (type === 'phone') { // 消费果仁, 果仁+人民币

			} else if (type === 'buy') { // 买果仁, 人民币

			} else if (type === 'transfer') { // 转果仁, 果仁

			}
			if (typeof item.gopNumber === 'number') { // 果仁消费
				bills.push({
					id: item.id,
					img: item.targetImg,
					change: numHandler(item.gopNumber, 'G'),
					desc: item.businessDesc,
					status: status[item.status],
					type: typeClasses[item.type]
				});
			}
			if (typeof item.money === 'number') { // 金币消费
				bills.push({
					id: item.id,
					img: item.targetImg,
					change: numHandler(item.money, '¥'),
					desc: item.businessDesc,
					status: status[item.status],
					type: type
				});
			}
			if (bills.length == 0) { console.log(item); }
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
	var vm = avalon.define({
		$id: 'account',
		list: [],
		showAccount: function(ev) {
			console.log('流水号:' + $(ev.target).closest('.account-item').get(0).dataset.id);
		}
	});
	avalon.scan(main.get(0), vm);
	api.billList({
		gopToken: gopToken,
		billListPage: page,
		billListPageSize: size
	}, function(data) {
		if (data.status == 200) {
			vm.list = dataHandler(data.data.list);
			page = data.data.list.length < size ? 0 : page + 1;
			setTimeout(function() {
				main.addClass('on');
			}, 200);
		} else {
			$.alert(data.msg);
			console.log(data);
		}
	});
	return;
});


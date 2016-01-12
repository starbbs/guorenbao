
// 张树垚 2016-01-10 00:31:49 创建
// H5微信端 --- 账单


require(['router', 'api'], function(router, api) {

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
				return result;
			}, {});
		}
		// 输出:
		// 	{
		// 		year: 2016,
		// 		month: 01,
		// 		month2: 2,
		// 		month3: '二'
		// 		date: 08,
		// 		day: 1,
		// 		day2: '一',
		// 		hour: 5,
		// 		hour2: '05',
		// 		minute: 30,
		// 		second: 16
		// 	}
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
		return (number > 0 ? '+' : '-') + unit + (Math.abs(number));
	};

	var now = new Date();
	var nowMonth = now.getMonth();
	var status = {
		PROCESSING: '进行中',
		SUCCESS: '交易成功',
		FAILURE: '交易失败',
		CLOSE: '交易关闭',
	};
	var dataHandler = function(data) {
		var result = [];
		data.map(function(item) { // 确定时间
			item._date = new Date(item.status === 'SUCCESS' ? item.businessTime : item.createTime);
			item._dateTime = item._date.getTime();
			return item;
		}).sort(function(item1, item2) { // 排序
			return item1._dateTime < item2._dateTime;
		}).forEach(function(item) { // 提取
			var time = timeHandler(item._date);
			var bills = [];
			if (item.gopNumber) { // 果仁消费
				bills.push({
					id: item.id,
					img: item.targetImg,
					change: numHandler(item.gopNumber, 'G'),
					desc: item.businessDesc,
					status: status[item.status]
				});
			}
			if (item.money) { // 金币消费
				bills.push({
					id: item.id,
					img: item.targetImg,
					change: numHandler(item.money, '¥'),
					desc: item.businessDesc,
					status: status[item.status]
				});
			}
			var compare = timeCompare(now, item._date);
			var day = {
				day: compare ? compare : ('周' + time.day2),
				time: compare ? (time.hour2 + ':' + time.minute) : (time.month2 + '-' + time.date),
				bills: bills
			};
			if (result.length > 1 && result[result.length - 1].month2 === time.month2) { // 和上个月相同
				result[result.length - 1].day.push(day);
			} else { // 没有这个月份, 创建
				result.push({
					month: nowMonth === time.month ? '本月' : (time.month2 + '月'),
					month2: time.month2,
					days: [day]
				});
			}
		});
		console.log(result)
		return result;
		// result = [{
		// 	month: '10月', // 或本月
		// 	month2: 11,
		// 	days: [{
		// 		day: '今天', // 今天, 昨天, 前天或周数
		// 		time: '10:50', // 时间或日期
		// 		bills: [{
		// 			id: '', // 流水号
		// 			img: '', // 头像
		// 			change: '', // 交易变化
		// 			desc: '', // 说明
		// 			status: '交易成功', // 状态
		// 		}]
		// 	}]
		// }];
	};
	var vm = avalon.define({
		$id: 'account',
		list: [],
		showAccount: function(ev) {
			alert('流水号:' + $(ev.target).closest('.account-item').get(0).dataset.id);
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


// 张树垚 2015-08-24 16:56:17 创建
// 检测模块


define('mydate', function() {

	var mydate = {};

	$.extend(mydate,{
		timeHandler: function(time) { // 时间处理
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
							result.day2 = '日一二三四五六'[item[1]]; // 周(中文数字)
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
		},
		timeClearHour:function(time) { // 干掉小时, 分钟, 秒, 毫秒
			if (time.constructor === Date) {
				var tmp = new Date(time.getTime());
				tmp.setHours(0);
				tmp.setMinutes(0);
				tmp.setSeconds(0);
				tmp.setMilliseconds(0);
				return tmp;
			}
		},
		timeDayDiffer:function(timeA, timeB) { // 两个时间的日期差
			if (timeA.constructor === Date && timeB.constructor === Date) {
				return Math.round((this.timeClearHour(timeA).getTime() - this.timeClearHour(timeB).getTime()) / 1000 / 60 / 60 / 24);
			}
		},
		timeCompare:function(timeA, timeB) { // 已A为准, 返回B是A的今天, 昨天, 前天
			if (timeA.constructor === Date && timeB.constructor === Date) {
				if (timeA.getTime() >= timeB.getTime()) {
					return ['今天', '昨天', '前天'][this.timeDayDiffer(timeA, timeB)];
				}
			}
		},
		parseDate:function(time) { // 把字符串时间转为对应Date实例
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
		}
	});

	return mydate;
});
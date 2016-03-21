// 张树垚 2016-01-10 00:31:49 创建
// H5微信端 --- 账单


require(['router', 'api', 'get', 'filters', 'h5-component-bill', 'iScroll4', 'h5-view-bill', 'mydate',
	'h5-weixin'
], function(router, api, get, filters, H5bill, iScroll, billView, mydate) {

	router.init();
	var gopToken = $.cookie('gopToken');
	var page = 1; // 账单页数, 当返回列表长度小于当前列表长度时, 置零, 不再请求
	var size = 10; // 账单列表

	var main = $('.account'); // 主容器
	var init = function() { // 初始化
		switch (get.data.from) {
			case 'wx_info': // 来自微信消息
				billView.set(get.data.type, get.data.id);
				router.to('/bill');
				break;
			default:
				router.to('/');
				getList();
		}
	};
	var timerGetList = null;
	var originList = [];
	var bottomHeight = 20; // 下拉加载的高度
	window.accountScroll = new iScroll('account', {
		vScrollbar: false,
		preventDefault: true,
		fixedScrollbar:true,
		useTransition:true,
		click: true,
		onScrollMove: function() {
			if(this.y>=10){
				vm.loadingWord = '松开刷新';	
			}
		},
		onBeforeScrollEnd:function(){
			if(this.y>=70){
				vm.loadingWord = '加载中...';
				page = 1;
				originList = [];
				setTimeout(function(){
					getList();
				},100);	
			}
		},
		onScrollEnd: function() {
			// this.y 卷上去的
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
				vm.list = dataHandler(originList = originList.concat(data.data.list));
				console.log(originList);
				//console.log(dataHandler(originList = originList.concat(data.data.list)));
				// vm.list.pushArray(dataHandler(data.data.list));
				page = data.data.list.length < size ? 0 : page + 1; // 是否停止请求
				callback && callback(data);
				!main.hasClass('on') && setTimeout(function() {
					main.addClass('on');
				}, 200);
				setTimeout(function(){
					vm.loading = false;
				},100);
			} else {
				$.alert(data.msg);
			}
		});
	};





	var now = new Date(); // 当前时间
	var nowMonth = now.getMonth(); // 当前月份
	var dataAdd = function(kind, bills, item) { // 添加效果的数据    dataAdd('all', bills, item);
		// dataAdd('all', [], {
		// 	_date: Wed Mar 16 2016 13: 24: 11 GMT + 0800(中国标准时间),
		// 	_dateTime: 1458105851732,
		// 	businessDesc: "买果仁",
		// 	businessId: 198,
		// 	businessTime: "2016-03-16 13:56:00",
		// 	createTime: "2016-03-16 13:24:11",
		// 	extra: Object,
		// 	gopPrice: 3,
		// 	id: 769,
		// 	money: -1,
		// 	status: "CLOSE",
		// 	type: "BUY_IN",
		// 	userId: 21
		// })
		var type = H5bill.typeClass[item.type];
		var bill = { // 账单
			id: item.businessId,
			img: '', // 头像
			name: '', // 姓名
			desc: item.businessDesc,
			status: H5bill.statusBusiness[item.status], //交易状态中文  进行中  交易成功/失败。。。
			type: type,
			originType: item.type,
			iconClass: '',
		};
		var types = { // 类型
			money: 'money',
			gop: 'gopNumber'
		};
		var coins = { // 货币
			money: '¥',
			gop: 'G'
		};
		var filter = { // 过滤器
			money: 'fix',
			gop: 'floorFix'
		};
		if (type === 'transfer' && item.extra) {
			bill.img = item.extra.photo || ''; // 转账头像
			if (item.extra.name) { // 转账目标
				bill.desc += ' - ' + filters.omit(item.extra.name); // 转出-L
				bill.name = filters.omit(item.extra.name);          // L
			}
			if (item.extra.transferOutType === 'ME_WALLET' || item.extra.transferInType === 'ME_WALLET') {
				bill.desc += ' - 我的钱包';
				bill.iconClass = 'wallet';
			}
		}
		if (type === 'phone') {
			if (item.extra && item.extra.phoneInfo) {
				item.extra.phoneInfo.carrier && (bill.desc += ' - ' + item.extra.phoneInfo.carrier); // 运营商
			}
		}
		if (kind === 'all') {
			// console.log(item.extra);
			if (item.extra.recordList.length) {
				item.extra.recordList.forEach(function(item) {
					switch(item.payType) {
						case 'GOP_PAY':
							bill.change = numHandler(-item.payGop, coins['gop'], filter['gop']);
							break;
						case 'UNION_PAY':
							bill.change = numHandler(-item.payMoney, coins['money'], filter['money']);
							break;
						default:
							console.log('err:', item);
					}
					bills.push($.extend({}, bill));
				});
			} else {
				bill.change = numHandler(item.money, coins['money'], filter['money']);
				bills.push(bill);
			}
		} else {
			bill.change = numHandler(item[types[kind]], coins[kind], filter[kind]);
			bills.push(bill);
		}
	};
	var dataHandler = function(data) { //时间处理同时获取交易的信息
		// data 列表所有的数据条目
		return data.map(function(item) { // 确定时间
			return $.extend(item, {
				// _date: mydate.parseDate(item.status === 'SUCCESS' ? item.businessTime : item.createTime),
				_date: mydate.parseDate(item.businessTime),
			});
		}).sort(function(item1, item2) { // 排序
			return item2._date.getTime() - item1._date.getTime();
		}).reduce(function(result, item) { // 提取
			var time = mydate.timeHandler(item._date); 	//time格式如下
			// item._date ==> Wed Mar 16 2016 13:24:11 GMT+0800 (中国标准时间)
			// 把 date格式的数据 转化成
			// {
			// 	year: '2016',
			//	month: '2',
			//	month2: '3',
			//	month3: '三',
			//	date: 16,
			//	day: 3,
			//	day2:'三',
			//	hour: 13,
			//	hour2: '13',
			//	minute: 24,
			//	minute2: '24'
			// }
			var type = H5bill.typeClass[item.type];
			var bills = [];
			// item是data里面的每一条数据
			switch (type) { // 账单类型
				case 'phone': // 消费果仁, 果仁+人民币
					dataAdd('all', bills, item); // dataAdd主要是给bills添加交易的信息
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
			now = new Date();
			var compare = mydate.timeCompare(now, item._date); //返回 今天 昨天 前天
			var day = {
				id: item.businessId,
				day: compare ? compare : ('周' + time.day2),
				time: compare ? (time.hour2 + ':' + time.minute2) : (time.month2 + '-' + time.date),
				type: type,
				originType: item.type,
				bills: bills,
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
	var numHandler = function(number, unit, filter) { // 数值处理
		return (number > 0 ? '+' : '-') + ' ' + unit + ' ' + filters[filter](Math.abs(number));
	};
	// 处理 getList 的工具方法 -- 结束

	// 账单列表  vm
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
			var target=listTarget= $(ev.target).closest('.account-item');
			if (target.length) {
				var data = target.get(0).dataset;
				var options = {};
				data.name && (options.transferName = data.name);
				data.img && (options.transferImg = data.img);
				billView.set(data.type, data.id, options);
				//           "BUY_IN",  "215"     {}
				router.go('/bill');
			}
		}
	});
	avalon.scan(main.get(0), vm);

	// 帐单详情
	billView.on('hide', function() {
		if (!vm.list.length) { // 没有list长度时获取list
			getList();
		}
	});
	//此函数为oncfirm事件时候的回调函数
	//console.log(vm.list);
	billView.onClose = function(vmid , vmtime) {
		for(var i=0; i<vm.list.length; i++){
			for(var j=0; j<vm.list[i].days.length; j++){
				if(vm.list[i].days[j].id == vmid){//先查找ID所在的days数组  再保存ID所在数组到本月第一条  再删除前数组  再从days头添加id所在的数组  2016-03-18 15:48:49
					vm.list[i].days[j].time = vmtime.substr(vmtime.indexOf(' ')+1,5);
					for(var x=0; x<vm.list[i].days[j].bills.length; x++ ){
						vm.list[i].days[j].bills[x].status = '已关闭';
					}
					var closeArrDay = vm.list[i].days[j];
					vm.list[i].days.splice(j,1);
					vm.list[0].days.unshift(closeArrDay);
					break;
				}
			}
		}		
		setTimeout(function(){
			window.history.go(-1);
		},1500);
	};

	/*
	vm.list.every(function(month) {
		console.log(month);
		return month.days.every(function(day) {
			if (day.id === 225) {
				data = day;
				return false;
			}
			return true;
		});
	});
	data.bills.forEach(function(item) {
		item.status = 'yiguanbi'
	})
	*/
	init();
});
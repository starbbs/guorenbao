// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-price', 'h5-view', 'touch-slide', 'mydate', 'iscrollLoading', 'filters', 'hchart', 'h5-weixin'], function(router, api, price, View, TouchSlide, mydate, iscrollLoading) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var main = $('.wealth');
	var pageNum = 1;
	var bottomHeight = 20;
	var pageSize = 15;
	var historyListArr = [];
	var history = new View('wealth-history');
	var historyVM = history.vm = avalon.define({
		$id: 'wealth-history',
		total: 0,
		loading: false,
		loadingWord: '加载中...',
		list: []
	});
	avalon.scan(history.native, historyVM);

	//wealthScroll用于存放iscrollLoading.set新生成的iscroll4生成的对象   iscrollLoading用于存放iscroll4相应的函数 
	//开关控制上拉或下拉刷新		wealthScroll用于加载完列表进行刷新
	var wealthScroll = iscrollLoading.set('wealth-history', {
		userUp: false,
		userDown: true
	});
	/*
	iscrollLoading.on('onBeforeScrollStart',function(){
		console.log('开始移动前，绑定的附加事件');
	});
	*/
	iscrollLoading.scrollEnd = function(pageNum) {
		console.log(' 开始获取' + pageNum);
		if (historyVM.loading) {
			return;
		}
		if (!pageNum) {
			historyVM.loading = true;
			historyVM.loadingWord = '大大, 已经没有了...';
			setTimeout(function() {
				historyVM.loading = false;
				historyVM.loadingWord = '加载中...';
			}, 300);
			return;
		}
		historyVM.loading = true;
		api.totalIncomeList({
			gopToken: gopToken,
			pageNo: pageNum,
			pageSize: pageSize,
		}, function(data) {
			if (data.status == 200) {
				if (data.data.list.length) {
					pageNum = data.data.list.length < pageSize ? 0 : pageNum + 1;
					//此处不用再计算累计收益 因为页面刷新时180行已经计算过了
					//生成今日（期）
					var timerA = new Date();
					for (var i = 0; i < data.data.list.length; i++) {
						//转成date对象
						var timerB = mydate.parseDate(data.data.list[i]['createTime']);
						//向前错一天  今日是昨日的收益  昨日是前天的收益 
						timerB.setDate(timerB.getDate() - 1);
						//转化成今日昨日前日的表示
						if (mydate.timeCompare(timerA, timerB)) {
							data.data.list[i]['createTime'] = mydate.timeCompare(timerA, timerB);
						} else {
							data.data.list[i]['createTime'] = mydate.date2String(timerB); //日期转字符串
						}
					}
					setTimeout(function() {
						historyVM.loading = false;
						wealthScroll.refresh();
					}, 300);
					historyListArr = historyListArr.concat(data.data.list);
					historyVM.list = historyListArr;
				}

			} else {
				$.alert(data.msg);
			}
		});
	};

	var listCache = {};
	var vm = avalon.define({
		$id: 'wealth',
		price: 0,
		gopNum: 0,
		total: 0,
		yesterday: 0,
		historyDay: 7,
		historyClick: function(day) {
			vm.historyDay = day;
			chartHistorySet();
		},
		showHistory: function() { //展示历史财富
			//console.log(historyVM.total);
			if (!historyVM.list.length) {
				iscrollLoading.scrollEnd(pageNum);
			}
			router.go('/wealth-history');
		}
	});
	avalon.scan(main.get(0), vm);

	// 历史首页图表
	var chartHistory = $('#chart-history');
	var chartHistoryData = [];
	var chartHistoryDate = [];
	var chartHistoryHandler = function(list) {
		chartHistoryData.length = 0;
		chartHistoryDate.length = 0;
		list.forEach(function(item) {
			chartHistoryData.push(item.price);
			chartHistoryDate.push(item.date.replace(/^\d{4}-(\d{2})-(\d{2}).*$/, function(s, s1, s2) {
				return s1 + '/' + s2;
			}));
		});
	};
	var chartHistorySet = function() {
		api.historyPrice({
			historyDay: vm.historyDay,
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				// chartHistoryHandler([
				// 	{id: 8, createTime: "2016-01-19 00:00:00", price: 2, date: "2016-01-19"},
				// 	{id: 9, createTime: "2016-01-20 00:00:00", price: 5, date: "2016-01-20"},
				// 	{id: 10, createTime: "2016-01-21 00:00:00", price: 7, date: "2016-01-21"},
				// 	{id: 11, createTime: "2016-01-22 00:00:00", price: 4, date: "2016-01-22"},
				// 	{id: 12, createTime: "2016-01-23 00:00:00", price: 1, date: "2016-01-23"},
				// 	{id: 13, createTime: "2016-01-24 00:00:00", price: 2, date: "2016-01-24"},
				// 	{id: 14, createTime: "2016-01-25 00:00:00", price: 9, date: "2016-01-25"}
				// ]);
				chartHistoryHandler(data.data.list);
				chartHistory.highcharts({
					chart: {
						// type: 'areaspline' // 带阴影的线
					},
					colors: ['#3d70ee'],
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					legend: {
						x: 150,
						y: 100,
					},
					xAxis: {
						// tickInterval: 3, // x坐标轴脚标间隔
						tickInterval: (function() {
							return chartHistoryData.length - 1;
						})(),
						labels: {
							formatter: function() {
								return chartHistoryDate[this.value];
							}
						}
					},
					yAxis: {
						title: {
							text: ''
						},
						tickInterval: (function() {
							return avalon.filters.fix(Math.round(Math.max.apply(Math, chartHistoryData) * 1.1) / 4);
						})(),
						labels: {
							formatter: function() {
								return this.value.toFixed(2);
							}
						}
					},
					plotOptions: {
						series: {
							marker: {
								enabled: false // 去掉线上的点
							}
						},
						area: {
							marker: {
								enabled: false,
								// symbol: 'circle',
								// radius: 1,
								// states: {
								// 	hover: {
								// 		enabled: false
								// 	}
								// }
							}
						}
					},
					series: [{
						name: '历史价格',
						data: chartHistoryData
					}]
				});
			} else {
				$.alert(data.msg);
			}
		});
	};
	chartHistorySet();

	price.onFirstChange = function(next) {
		vm.price = next;
	};
	//                    当前价格 上次价格 改变大小 
	price.onChange = function(next, now, change) {
		vm.priceChange = change;
		vm.price = now;
	};
	price.get();

	api.getGopNum({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			vm.gopNum = data.data.gopNum;
		} else {
			console.log(data);
		}
	});

	api.getIncome({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			vm.total = historyVM.total = data.data.totalIncome;
			vm.yesterday = data.data.yesterdayIncome;
		} else {
			console.log(data);
		}
	});

	setTimeout(function() {
		main.addClass('on');
	}, 100);
});
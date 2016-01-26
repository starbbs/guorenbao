// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-price', 'h5-view', 'filters', 'hchart', 'h5-weixin'], function(router, api, price, View) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var main = $('.wealth');
	var history = new View('wealth-history');
	var historyVM = history.vm = avalon.define({
		$id: 'wealth-history',
		total: 0,
		list: []
	});
	avalon.scan(history.native, historyVM);

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
		showHistory: function() {
			if (!historyVM.list.length) {
				api.totalIncomeList({
					gopToken: gopToken
				}, function(data) {
					if (data.status == 200) {
						historyVM.list = data.data.list;
					} else {
						$.alert(data.msg);
					}
				});
			}
			router.go('/view/wealth-history');
		}
	});
	avalon.scan(main.get(0), vm);

	// 历史首页图表
	var chartHistory = $('#chart-history');
	var chartHistorySet = function() {
		api.historyPrice({
			historyDay: vm.historyDay,
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				chartHistory.highcharts({
					chart: {
						type: 'areaspline'
					},
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
						tickInterval: 1,
						labels: {
							formatter: function() {
								return this.value;
								return chartDate[this.value];
							}
						}
					},
					yAxis: {
						title: {
							text: ''
						},
						labels: {
							formatter: function() {
								return this.value;
							}
						}
					},
					plotOptions: {
						area: {
							marker: {
								enabled: false,
								symbol: 'circle',
								radius: 1,
								states: {
									hover: {
										enabled: true
									}
								}
							}
						}
					},
					series: [{
						name: '日收益',
						data: [1,2,3,4,5,6,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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
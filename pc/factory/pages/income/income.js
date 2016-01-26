
// 张树垚 2015-10-17 16:11:20 创建
// 收益详情js


require(['dom', 'api', 'router', 'top', 'hchart'], function(dom, api, router, top) {

	'use strict';

	function fixed(num, fix) {
		return parseFloat(num).toFixed(fix);
	}

	api.getTopRecord(function(data) {
		vm.history = fixed(data.history, 2);
		vm.percent = fixed(data.percent, 4);
		vm.price = fixed(data.price, 3);
		vm.yesterday = fixed(data.yesterday, 2);
	});

	var chartDate = ['07/08', '07/09', '07/10', '07/11', '07/12', '07/13', '07/14'];
	var chartData = [0.2, 0.5, 0.9, 0.4, 0.7, 0.8, 0.5];
	var chartBox = $('.income-chart-content');
	var chartCreate = function() {
		chartBox.highcharts({
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
				data: chartData
			}]
		});
	};
	// chartCreate();
	// setTimeout(function() {
	// 	chartData = [0.5, 0.2, 0.3, 0.2, 0.1, 0.0, 0.0];
	// 	chartCreate();
	// }, 2000);

	var getList = function(page) {
		page = page || 1;
		if (page <= 0) { return; }
		api.getEarningRecord({
			pageNum: page
		}, function(data) {
			vm.count = data.count;
			vm.now = data.pageNum;
			vm.num = data.pageTotal;
			vm.list = data.list;
			// [{
			// 	"earningNum": 0,
			// 	"price": "11",
			// 	"time": "2015-10-18",
			// 	"totalEarning": 0
			// },....];
			chartDate = [];
			chartData = [];
			data.list.forEach(function(item) {
				chartDate.unshift(item.time.substring(5).replace('-', '/'));
				chartData.unshift(item.earningNum);
			});
			chartCreate();
		});
	};
	getList();

	var vm = avalon.define({
		$id: 'income',
		history: '--', // 历史累计收益
		percent: '--',
		price: '--',
		yesterday: '--',
		list: [],
		count: 0, // 总条数
		now: 1, // 当前页数
		num: 1, // 总页数
		prev: function() { // 上一页
			getList(vm.now - 1);
		},
		next: function() { // 下一页
			getList(vm.now + 1);
		}
	});
	avalon.scan();

	router.init();
});





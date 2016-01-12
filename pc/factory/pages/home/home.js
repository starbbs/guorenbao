

// 张树垚 2015-07-24 14:31:36 创建
// 果仁宝 个人首页js



require(['dom', 'api', 'router', 'top', 'check', 'filters', 'hchart'], function(dom, api, router, top, check, filters) {

	var imgDefault = './images/temp-1.jpg';

	api.getUserInfoFromSession(function(data) { // 获取用户信息
		// vm.address = data.address; // "5386bedcbc744d83a08574b4b4863263"
		vm.cardNum = data.cardNum; // "0" // 银行卡
		vm.lastLoginTime = data.lastLoginTime.replace(/\.0$/, ''); // "2015-10-20 16:44:46.0"
		vm.name = data.name || ''; // "zhangsan" // 未实名认证没有这个字段
		// vm.registerTime = data.registerTime; // "2015-10-16 17:16:44.0"
		// vm.totalEarning = data.totalEarning; // "103"
		vm.uid = data.uid; // "150****3083"
		vm.photo = data.photo || imgDefault;
	});
	api.getTopRecord(function(data) { // 获取收益信息
		vm.history = data.history; // 55 // 历史收益
		vm.percent = data.percent.toFixed(); // 0 // 30日年化收益率
		// vm.price = data.price; // 9.8 // 结算价格(昨日零时价)
		vm.yesterday = data.yesterday; // 11 // 昨日收益
	});
	api.getAccountGopNum(function(data) { // 获取当前果仁数
		vm.guo = parseFloat(data);
	});
	api.getLastRecord(function(data) { // 获取交易列表
		vm.list = data.list;
	});

	function getGopPrice() { // 获取果仁实时价
		api.now(function(data) {
			vm.gopPrice = parseFloat(data.gopPrice);
			vm.time = data.time;
		});
	}
	getGopPrice();

	var chart = $('.home-chart-center-main-chart');
	var chartList = []; // 原数据
	var chartDate = []; // 日期
	var chartData = []; // 表格数据
	function getChartData(day) { // 获取表格数据
		vm.chartLength = {seven: '一周', thirty: '30天'}[day];
		// day: 'seven|thirty'
		api[day](function(data) {
			chartList = data.list;
			chartDate = [];
			chartData = [];
			var first = chartList[0].gopprice;
			var last = chartList[chartList.length - 1].gopprice;
			vm.chartRate =  ((first - last) / last * 100).toFixed(2);
			chartList.forEach(function(item, i) {
				if (i != chartList.length - 1) {
					chartDate.unshift(item.earningDate.substring(5).replace('-', '/'));
					chartData.unshift(parseFloat(item.gopprice.toFixed(3)));
				}
			});
			chart.highcharts({
				chart: {
					type: 'area'
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				legend: {
					x: 0,
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
						},
						point: {
							events: {
								mouseOver: function(e) {
									var index = e.target.index;
									var data = chartList[chartList.length - 1 - index - 1];
									var last = chartList[chartList.length - 1 - index];
									vm.chartDate = data.earningDate;
									vm.chartDay = data.week;
									vm.chartPrice = data.gopprice.toFixed(3);
									vm.chartPercent = ((data.gopprice - last.gopprice) / last.gopprice * 100).toFixed(2);
								}
							}
						}
					}
				},
				series: [{
					name: '历史单价',
					data: chartData
				}]
			});
		});
	}

	var vm = avalon.define({
		$id: 'home',
		cardNum: '', // 银行卡数目
		lastLoginTime: '', // 上次登录时间
		name: '', // 名字
		uid: '', // uid
		photo: imgDefault, // 图片地址
		guo: '', // 用户当前果仁数
		history: 0, // 历史累计收益
		percent: '', // 30日年化收益率
		yesterday: 0, // 昨日收益
		gopPrice: 0, // 果仁实时价格
		time: '', // 果仁价格时间
		refresh: function(ev) { // 刷新果仁实时价格
			ev.preventDefault();
			getGopPrice();
		},
		tab: function(day) {
			var self = $(this);
			if (!self.hasClass('on')) {
				getChartData(day);
				self.siblings().removeClass('on');
				self.addClass('on');
			}
		},
		chartLength: '', // 最近一周/30天
		chartRate: '', // 涨跌幅
		chartDate: '--',
		chartDay: '--',
		chartPrice: '',
		chartPercent: '',
		list: [],
	});
	avalon.scan();
	$('.home').animate({opacity: 1}, 400);
	getChartData('seven');

	router.init();
});

















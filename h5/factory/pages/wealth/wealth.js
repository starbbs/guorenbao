
// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-price', 'h5-view', 'filters'], function(router, api, price, View) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var wealth = $('.wealth');
	var history = new View('wealth-history');
	var historyVM = history.vm = avalon.define({
		$id: 'wealth-history',
		total: 0
	});
	avalon.scan(history.native, historyVM);

	var vm = avalon.define({
		$id: 'wealth',
		price: 0,
		gopNum: 0,
		total: 0,
		yesterday: 0,
		showHistory: function() {
			router.go('/view/wealth-history');
		}
	});
	avalon.scan(wealth.get(0), vm);

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
		wealth.addClass('on');
	}, 100);
});


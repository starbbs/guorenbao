

// 张树垚 2015-08-04 17:08:14 创建
// 果仁宝 交易记录js



require(['dom', 'top', 'router', 'api', 'filters'], function(dom, top, router, api, filters) {

	var vm = avalon.define({
		$id: 'records',
		type: '', // 交易分类
		status: '', // 交易状态
		beginTime: '', // 开始时间
		endTime: '', // 结束时间
		pageNum: 1, // 当前页数
		count: 0, // 总条数
		page: 1, // 总页数
		list: [], // 列表
		color: filters.color, // 金额颜色
	});

	var detailVM = avalon.define({
		$id: 'records-detail',
		merchants: '', // 交易方
		gopPrice: '', // 果仁当时价格
		message: '', // 信息
		moneyChange: '', // 果仁变化
		number: '', // 订单号
		opponent: '', // 交易对象
		reducedTurnover: '', // 换算交易额
		status: '', // 交易状态
		targetType: '', // 转账的地方(exchange|gopwallet|gopsite)
		time: '', // 时间
		transferType: '', // 转账的类型(in|out)
		color: filters.color, // 金额颜色
	});

	var $detail = $('.records-detail');
	var hasGetList = false; // 已获取列表
	var hasRouter = false; // 已触发路由
	var getList = function() {
		hasGetList = true;
		api.getTransactionRecord({
			type: vm.type,
			status: vm.status,
			beginTime: vm.beginTime,
			endTime: vm.endTime,
			pageNum: vm.pageNum
		}, function(data) {
			$.extend(vm, data);
		});
	};
	var getDetail = function(orderId) {
		api.detail({
			orderId: orderId
		}, function(data) {
			if (!data.result) {
				return router.go('/detail/0');
			}
			$.extend(detailVM, { merchants: data.merchants }, data.result);
		});
	};

	avalon.scan();

	router.get('/detail/:num', ['all'], function(num) {
		console.log(num);

		hasRouter = true;

		if (num == 0) {
			$detail.fadeOut(300);
			!hasGetList && getList(); // 如果返回时没有列表, 则请求列表
		} else {
			$detail.fadeIn(300);
			getDetail(num);
		}
	});
	setTimeout(function() {
		$('.records').animate({opacity: 1}, 300);
		!hasRouter && getList(); // 如果没有触发路由, 则请求列表
	}, 300);
	router.init();
});













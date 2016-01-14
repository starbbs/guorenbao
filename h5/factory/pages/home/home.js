
// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-price', 'h5-weixin'], function(router, api, price) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var home = $('.home');
	var vm = avalon.define({
		$id: 'home',
		price: 0,
		priceChange: 0,
		visible: true,
		visibleChange: function() {
			vm.visible = !vm.visible;
		},
		gopNum: 0
	});
	avalon.scan(home.get(0), vm);

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
			setTimeout(function() {
				home.addClass('on');
			}, 100);
		} else {
			console.log(data);
		}
	});
});


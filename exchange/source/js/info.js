define('mkt_info', ['api_mkt'], function(api_mkt) {
	var price = {
		interval: 3000, // 请求间隔
		timer: null, // 定时器
		now: false, // 当前价格
		stop: function() {
			clearTimeout(price.timer);
		},
		//onUpdate: $.noop, // 价格更新时回调, 传参(当前价格, 上一次价格)
		onChange: updateprice, // 价格改变时回调, 传参(当前价格, 上一次价格, 改变大小)
		//onFirstChange: $.noop, // 第一次改变时回调, 传参(当前价格)
	};
	var once = price.once = function(callback) {
		api_mkt.pollinfo(function(data) {
			if (data.status == 200) {
				callback && callback(data.data.price);
			} else {
				console.log(data);
			}
		});
	};

	var updateprice = function(callback){
		console.log('asdfjkl');

	}

	var get = price.get = function() {
		once(function(next){
			console.log(next);
		});


		// once(function(next) {
		// 	var now = price.now;
		// 	var change = next - now;
		// 	if (now === false) {
		// 		price.onFirstChange(next);
		// 	}
		// 	price.onUpdate(next, now);
		// 	if (change && now !== false) {
		// 		price.onChange(next, now, change);
		// 	}
		// 	price.now = next;
		// 	price.timer = setTimeout(price.get, price.interval);
		// });
	};
	return price;
});

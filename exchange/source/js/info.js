define('mkt_info', ['api_mkt'], function(api_mkt) {
	var price = {
		interval: 1000, // 请求间隔
		timer: null, // 定时器
		stop: function() {
			clearTimeout(price.timer);
		},
		onChange: updateprice, // 价格改变时回调, 传参(当前价格, 上一次价格, 改变大小)
	};
	var once = price.once = function(callback) {
		api_mkt.pollinfo(function(data) {
			//if (data.status == 200) {
			//console.log(data);
			callback && callback(data);
			// if(1){
			// 	callback && callback("asfdjkl");
			// } else {
			// 	console.log(data);
			// }
		});
	};
	var updateprice = function(haha){
		var thelatestprice = JSON.parse(haha['order'][0]).price;
		$('#thelatestprice').html(thelatestprice);      //最新成交价赋值
		var turnover = Number(haha['24Total']).toFixed(2);
		$('#turnover').html(turnover);  		        //24小时成交量
		var low24 = Number(haha['24low']);
		var high24 = Number(haha['24high']);
		$('#thehighest_price').html(low24.toFixed(2));  //
		$('#thelowest_price').html(high24.toFixed(2));  //
		var high24 = Number(haha['24high']);
		
		var total = Number(haha['total']);
		var unknow = Number((thelatestprice/24)-1);
		$('#cumulativevolume').html(total.toFixed(2));
		$('#pricechangeratio').html(unknow.toFixed(2)+"%");
	}
	var get = price.get = function() {
		once(function(next){
			updateprice(next);
			price.timer = setTimeout(price.get, price.interval);
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

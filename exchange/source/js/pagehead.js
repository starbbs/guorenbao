define('mkt_pagehead', ['api_mkt'], function(api_mkt) {


	var price = {
		interval: 1000,
		timer: null,
		stop: function() {
			clearTimeout(price.timer);
		},
		onChange: updateprice,
	};
	var once = price.once = function(callback) {
		api_mkt.pollinfo(function(data) {
			callback && callback(data);
		});
	};
	//页面顶部的最新成交价和24小时成交量的轮询
	var updateprice = function(haha){
		var thelatestprice = JSON.parse(haha['order'][0]).price;
		$('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
		var turnover = Number(haha['24Total']).toFixed(2);
		$('#turnover').html(turnover);  //页面顶部 24小时成交量
	}
	var get = price.get = function() {
		once(function(next){
			updateprice(next);
			price.timer = setTimeout(price.get, price.interval);
		});
	};
	return price;
});

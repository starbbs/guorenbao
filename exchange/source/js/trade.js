define('mkt_trade', ['api_mkt'], function(api_mkt) {
	var trade = {
		interval: 1000, // 请求间隔
		timer: null, // 定时器
		stop: function() {
			clearTimeout(trade.timer);
		},
		onChange: updatebuy_sell, // 价格改变时回调, 传参(当前价格, 上一次价格, 改变大小)
	};
	var once = trade.once = function(callback) {
		api_mkt.polltrade(function(data) {
			callback && callback(data);
		});
	};
	var updatebuy_sell = function(haha){
		// var thelatestprice = JSON.parse(haha['order'][0]).price;
		// $('#thelatestprice').html(thelatestprice);      //最新成交价赋值
		// var turnover = Number(haha['24Total']).toFixed(2);
		// $('#turnover').html(turnover);  		        //24小时成交量
		// var low24 = Number(haha['24low']);
		// var high24 = Number(haha['24high']);
		// $('#thehighest_price').html(low24.toFixed(2));  //
		// $('#thelowest_price').html(high24.toFixed(2));  //
		// var high24 = Number(haha['24high']);
		
		// var total = Number(haha['total']);
		// var unknow = Number((thelatestprice/24)-1);
		// $('#cumulativevolume').html(total.toFixed(2));
		// $('#pricechangeratio').html(unknow.toFixed(2)+"%");

		//table_three
		/*<div class="table_row">
            <div class="table_con">12:08:09</div>
            <div class="table_con sell_color">卖出</div>
            <div class="table_con">3.12</div>
            <div class="table_con">3200.00</div>
        </div>*/
        //console.log(haha);
        //console.log(haha['sell']);
        //console.log(JSON.parse(haha['sell']));

        var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);

        // var sell_list_html = "";
        // for (var i = 0; i < list_sell.length; i++) {
        // 	console.log(list_sell[i]);
        // 	//$("<div class='table_row'></div>")
			
			        	
        // }


	}
	var get = trade.get = function() {
		once(function(next){
			updatebuy_sell(next);
			trade.timer = setTimeout(trade.get, trade.interval);
		});
	};
	return trade;
});

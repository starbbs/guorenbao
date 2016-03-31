define('mkt_info', ['api_mkt'], function(api_mkt) {
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
	//首页+交易大厅的价格轮询
	var updateprice = function(haha){
		//console.log(JSON.parse(haha['order'][0]));
		//console.log(JSON.parse(haha['order'][0]).price);
		
		var thelatestprice;
		if(haha['order']){
			var thelatestprice  = JSON.parse(haha['order'][0]).price;
			$('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
		}
		var turnover = Number(haha['24Total']).toFixed(2);
		$('#turnover').html(turnover);  //页面顶部 24小时成交量

		
		$('#thelatestprice_floor').html(thelatestprice); //交易大厅 最新成交价
		$('#thelatestprice_em').html(thelatestprice); //首页轮播图下面最新成交价
		var low24 = Number(haha['24low']);  //最低价
		var high24 = Number(haha['24high']);//最高价
		$('#thehighest_price').html(high24.toFixed(2));  //首页 最高价
		$('#thelowest_price').html(low24.toFixed(2));  //首页 最低价

		$('#thehighest_price_floor').html(high24.toFixed(2));  //交易大厅 最高价
		$('#thelowest_price_floor').html(low24.toFixed(2));  //交易大厅 最低价

		var total = Number(haha['total']);
		var unknow = Number((thelatestprice/24)-1);
		$('#cumulativevolumeem').html(total.toFixed(2));  //首页 累计成交量
		$('#thecumulativevolume_floor').html(total.toFixed(2));  //交易大厅 累计成交量

		$('#pricechangeratio').html(unknow.toFixed(2)+"%");  //涨跌幅
        var bid_history_list_html = "";
        var orderlist = haha['order'];
        if(orderlist!=null){
        	for (var i = 0; i < orderlist.length; i++) {
	        	var orderliststr = JSON.parse(orderlist[i]);
	        	var timestr = orderliststr.time;
	        	var buyorsell = orderliststr.type;
	        	if(buyorsell=="BUY"){
	        		buyorsell = "买入";
	        		sell_color = "buy_color";
	        	}
	        	if(buyorsell=="SELL"){
	        		buyorsell = "卖出";
	        		sell_color = "sell_color";
	        	}
	        	bid_history_list_html +="<div class='table_row'>"+
	        	"<div class='table_con'>"+timestr+"</div><div class='table_con "+sell_color+"'>"+buyorsell+"</div>"+
	        	"<div class='table_con'>"+orderliststr.price+"</div><div class='table_con'>"+orderliststr.num+"</div>"+
	        	"</div>";
	        }
        }
        $("#table_three").html(bid_history_list_html);
	}
	var get = price.get = function() {
		once(function(next){
			updateprice(next);
			price.timer = setTimeout(price.get, price.interval);
		});
	};
	return price;
});

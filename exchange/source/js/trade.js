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
		//console.log(haha);
        var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);
        var sell_list_html = "";
        var buy_list_html = "";
        for (var i = 0; i < list_sell.length; i++) {
        	sell_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>卖"+(i+1)+"</div><div class='table_con'>"+list_sell[i][0]+"</div>"+
        	"<div class='table_con'>"+list_sell[i][1]+"</div><progress value='"+list_sell[i][1]+"' max='100'></progress></div></div>";
        }
        for (var i = 0; i < list_buy.length; i++) {
        	buy_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>买"+(i+1)+"</div><div class='table_con'>"+list_buy[i][0]+"</div>"+
        	"<div class='table_con'>"+list_buy[i][1]+"</div><progress value='"+list_buy[i][1]+"' max='100'></progress></div></div>";
        }
        $("#table_one").html(buy_list_html);
        $("#table_two").html(sell_list_html);
	}
	var get = trade.get = function() {
		once(function(next){
			updatebuy_sell(next);
			trade.timer = setTimeout(trade.get, trade.interval);
		});
	};
	return trade;
});

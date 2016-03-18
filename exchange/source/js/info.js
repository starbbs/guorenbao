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

	var formatDate = function(now) {
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //return year + "-" + month + "-" + date + "   ";
        
        if(hour<10){
        	hour = "0"+hour;
        }
        if(minute<10){
        	minute = "0"+minute;
        }
        if(second<10){
        	second = "0"+second;
        }
        //return hour + ":" + minute + ":" + second;
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    }

	var updateprice = function(haha){
		var thelatestprice = JSON.parse(haha['order'][0]).price;
		$('#thelatestprice').html(thelatestprice);
		var turnover = Number(haha['24Total']).toFixed(2);
		$('#turnover').html(turnover);
		var low24 = Number(haha['24low']);
		var high24 = Number(haha['24high']);
		$('#thehighest_price').html(low24.toFixed(2));  //
		$('#thelowest_price').html(high24.toFixed(2));  //
		var high24 = Number(haha['24high']);
		
		var total = Number(haha['total']);
		var unknow = Number((thelatestprice/24)-1);
		$('#cumulativevolumeem').html(total.toFixed(2));
		$('#pricechangeratio').html(unknow.toFixed(2)+"%");
        var bid_history_list_html = "";
        var orderlist = haha['order'];
        for (var i = 0; i < orderlist.length; i++) {
        	var orderliststr = JSON.parse(orderlist[i]);
        	var d = new Date(orderliststr.time);
        	var timestr = formatDate(d);
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

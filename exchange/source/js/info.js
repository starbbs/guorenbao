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
        return hour + ":" + minute + ":" + second;
        //return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    }
    //var d = new Date(1230999938);
    //alert(formatDate(d));

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
		$('#cumulativevolume').html(total.toFixed(2));
		$('#pricechangeratio').html(unknow.toFixed(2)+"%");

		//table_three
		/*<div class="table_row">
            <div class="table_con">12:08:09</div>
            <div class="table_con sell_color"></div>
            <div class="table_con">3.12</div>
            <div class="table_con">3200.00</div>
        </div>*/
        
        //console.log(haha);
        //console.log("hi")

        var bid_history_list_html = "";

        var orderlist = haha['order'];
        //console.log(orderlist.length)
        for (var i = 0; i < orderlist.length; i++) {
        	//console.log(orderlist[i]);
        	//var timestr = orderlist[i]['time'];
        	var timestr = JSON.parse(orderlist[i]);
        	
        	console.log(timestr);
        	bid_history_list_html +="<div class='table_row'>"+
        	"<div class='table_con'></div><div class='table_con sell_color'></div>"+
        	"<div class='table_con'>3.12</div><div class='table_con'>3.12</div>"+
        	"</div>";
			formatDate(new Date(timestr));
        }
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

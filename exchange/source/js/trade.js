define('mkt_trade', ['api_mkt'], function(api_mkt) {
	var trade = {
		interval: 1000, // 请求间隔
		timer: null, // 定时器
		stop: function() {
			clearTimeout(trade.timer);
		},
		buyaprice:0,//买一价
		sellaprice:0,//卖一价
		onChange: updatebuy_sell, // 价格改变时回调, 传参(当前价格, 上一次价格, 改变大小)
	};
	var once = trade.once = function(callback) {
		api_mkt.polltrade(function(data) {
			callback && callback(data);
		});
	};
	//首页轮询更新买入委托、卖出委托
	var updatebuy_sell = function(haha){
        var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);
        var sell_list_html = "";
        var buy_list_html = "";
        var buyaprice = "";
    	var sellaprice = "";
        var listsell_array = [];
        for (var i = 0; i < list_sell.length; i++) {
        	listsell_array.push(list_sell[i][1]);
        }
        var maxsell = Math.max.apply(null, listsell_array);   //求卖出最大值
        var listbuy_arry = [];
        for (var i = 0; i < list_buy.length; i++) {
        	listbuy_arry.push(list_buy[i][1]);
        }
        var maxbuy = Math.max.apply(null, listbuy_arry);     //求买入最大值
        var myarr = [];
        myarr.push(maxbuy,maxsell);
        var maxval = Math.max.apply(null,myarr);
        for (var i = 0; i < list_sell.length; i++) {
        	sellaprice = list_sell[0][0];
        	var progressval = (list_sell[i][1]/maxval)*100>=0.4?(list_sell[i][1]/maxval)*100:0.5;
        	sell_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>卖"+(i+1)+"</div><div class='table_con'>"+list_sell[i][0].toFixed(2)+"</div>"+
        	"<div class='table_con'>"+list_sell[i][1].toFixed(2)+"</div><progress value='"+progressval+"' max='100'></progress></div></div>";
        }
        for (var i = 0; i < list_buy.length; i++) {
        	buyaprice = list_buy[0][0];
        	var progressval = (list_buy[i][1]/maxval)*100>=0.4?(list_buy[i][1]/maxval)*100:0.5;
        	buy_list_html += "<div class='table_row'>"+
        	"<div class='table_con'>买"+(i+1)+"</div><div class='table_con'>"+list_buy[i][0].toFixed(2)+"</div>"+
        	"<div class='table_con'>"+list_buy[i][1].toFixed(2)+"</div><progress value='"+progressval+"' max='100'></progress></div></div>";
        }
        $('#buyonece_price').html(buyaprice?buyaprice.toFixed(2):"");        //最高卖价
		$('#sellonece_price').html(sellaprice?sellaprice.toFixed(2):"");      //最低卖价


        if(buy_list_html==""){
            $(".no-record-picture1").show();
        } else {
            $(".no-record-picture1").hide();
            $("#table_one").html(buy_list_html);
        }

        if(sell_list_html==""){
            $(".no-record-picture2").show();
        } else {
            $(".no-record-picture2").hide();
            $("#table_two").html(sell_list_html);
        }
        //$("#table_one").html(buy_list_html);         //买入委托
        // $("#table_two").html(sell_list_html);		 //卖出委托
	}
	//交易大厅轮询更新价格
	var updatebuy_sell_floor = function(haha){
		var list_sell = JSON.parse(haha['sell']);
        var list_buy = JSON.parse(haha['buy']);
		var list_sell_array = [];
        for (var i = 0; i < list_sell.length; i++) {
        	list_sell_array.push(list_sell[i][0]);
        }
        var maxlist_sell = Math.max.apply(null,list_sell_array);
        //console.log(maxlist_sell);  //最高卖价
        var list_buy_array = [];
        for (var i = 0; i < list_buy.length; i++) {
        	list_buy_array.push(list_buy[i][0]);
        }
        var maxlist_buy = Math.min.apply(null,list_buy_array);
        var buyaprice = "";
        var sellaprice = "";
        if(list_sell.length!=0){
        	sellaprice = list_sell[0][0];
        }
        if(list_buy.length!=0){
        	buyaprice = list_buy[0][0];
        }
		//buyaprice=9.1;// TODO 测试
		//sellaprice=1;// TODO 测试
		$('#buyonece_price_floor').html(buyaprice?buyaprice.toFixed(2):"");  //交易市场买一价
		trade.buyaprice=buyaprice;      
		$('#sellonece_price_floor').html(sellaprice?sellaprice.toFixed(2):"");//交易市场卖一价
		trade.sellaprice=sellaprice;
		var list_sell_html = "";
		var buy_list_html = "";
		$("#sellseccon").html("");
		$("#buysec").html("");
		if(list_buy.length!=0){

			if(list_buy.length<=5){
				$("#wbr_m_best_sell").html(list_buy[0][0]);  //最佳买价
				for(var i=0;i<list_buy.length;i++){
		            buy_list_html += "<div class='table_row'>"
		            +"<div class='table_con buyprice'>买"+(i+1)+"</div>"
		            +"<div class='table_con'>¥"+list_buy[i][0].toFixed(2)+"</div>"
		            +"<div class='table_con'>"+list_buy[i][1].toFixed(2)+"</div>"
		            +"<div class='table_con'>¥"+(list_buy[i][0]*list_buy[i][1]).toFixed(2)+"</div></div>";
				}
			} else {
				var list_buy_five = [];
				list_buy_five.push(list_buy[0]);
				list_buy_five.push(list_buy[1]);
				list_buy_five.push(list_buy[2]);
				list_buy_five.push(list_buy[3]);
				list_buy_five.push(list_buy[4]);
				$("#wbr_m_best_sell").html(list_buy[0][0]);  //最佳买价
				for(var i=0;i<list_buy_five.length;i++){
		            buy_list_html += "<div class='table_row'>"
		            +"<div class='table_con buyprice'>买"+(i+1)+"</div>"
		            +"<div class='table_con'>¥"+list_buy_five[i][0].toFixed(2)+"</div>"
		            +"<div class='table_con'>"+list_buy_five[i][1].toFixed(2)+"</div>"
		            +"<div class='table_con'>¥"+(list_buy_five[i][0]*list_buy_five[i][1]).toFixed(2)+"</div></div>";
				}
			}
			$(".table_row_line").show();
			
			$("#sellseccon").html(buy_list_html);
		}

		if(list_sell.length!=0){
			if(list_sell.length<=5){
				$("#wbr_m_best_buy").html(list_sell[0][0]);  //最佳卖价
				// console.log(list_sell);
				for(var i=list_sell.length-1;i>=0;i--){
		            list_sell_html += "<div class='table_row'>"
		            +"<div class='table_con saleprice'>卖"+(i+1)+"</div>"
		            +"<div class='table_con'>¥"+list_sell[i][0].toFixed(2)+"</div>"
		            +"<div class='table_con'>"+list_sell[i][1].toFixed(2)+"</div>"
		            +"<div class='table_con'>¥"+(list_sell[i][0]*list_sell[i][1]).toFixed(2)+"</div></div>";
				}
			} else {
				var list_sell_five = [];
				list_sell_five.push(list_sell[0]);
				list_sell_five.push(list_sell[1]);
				list_sell_five.push(list_sell[2]);
				list_sell_five.push(list_sell[3]);
				list_sell_five.push(list_sell[4]);
				$("#wbr_m_best_buy").html(list_sell_five[0][0]);  //最佳卖价
				for(var i=list_sell_five.length-1;i>=0;i--){
		            list_sell_html += "<div class='table_row'>"
		            +"<div class='table_con saleprice'>卖"+(i+1)+"</div>"
		            +"<div class='table_con'>¥"+list_sell_five[i][0].toFixed(2)+"</div>"
		            +"<div class='table_con'>"+list_sell_five[i][1].toFixed(2)+"</div>"
		            +"<div class='table_con'>¥"+(list_sell_five[i][0]*list_sell_five[i][1]).toFixed(2)+"</div></div>";
				}
			}
			$(".table_row_line").show();
			
			$("#buysec").html(list_sell_html);
		}
		
	}

	//首页的轮询
	var get = trade.get = function() {
		once(function(next){
			updatebuy_sell(next);
			trade.timer = setTimeout(trade.get, trade.interval);
		});
	};
	//交易大厅的轮询
	var getfloor = trade.getfloor = function(){
		once(function(next){
			updatebuy_sell_floor(next);
			trade.timer = setTimeout(trade.getfloor, trade.interval);
		})
	}
	return trade;
});

define('mkt_info', ['api_mkt','decimal'], function(api_mkt,decimal) {
    var price = {
        interval: 1000,
        timer: null,
        stop: function() {
            clearTimeout(price.timer);
        },
        onChange: updateprice,
        onChange2: $.noop
    };
    var once = price.once = function(callback) {
        api_mkt.pollinfo(function(data) {
            callback && callback(data);
        });
    };

    var getTwoPs = function(str){
		var length = 0;
    	var position = 0;
    	if(String(str).indexOf(".") < 0){
    		return str+".00";
    	}
    	length = String(str).length;
    	position = String(str).indexOf(".");
    	if(length < position + 3){
    		return str + "0";
    	}else{
    		return String(str).substring(0, position + 3);
    	}
	}
    //首页+交易大厅的价格轮询
    var updateprice = function(haha) {
        var thelatestprice;
        var thelatestprice_second;
        if (haha['order']) {
            thelatestprice = JSON.parse(haha['order'][0]).price;
            thelatestprice = getTwoPs(thelatestprice);
            $('#thelatestprice').html(thelatestprice); //页面顶部 最新成交价
            thelatestprice_second = JSON.parse(haha['order'][1]).price;
        }
        var floor_two = $("#floor_two").val();     //剩余人民币数
        var floor_four = $("#floor_four").val();   //冻结人民币数
        var floor_one = $("#floor_one").val();     //剩余果仁数
        var floor_three = $("#floor_three").val(); //冻结果仁数
        // console.log("floor_two"+floor_two);
        // console.log("floor_four"+floor_four);
        // console.log("floor_one"+floor_one);
        // console.log("floor_three"+floor_three);
        var totalAssets = decimal.floatAdd(floor_two, floor_four);
        var totalNuts = decimal.floatAdd(floor_one, floor_three);
        var totalvalue = decimal.floatAdd(decimal.floatMulti(totalNuts, thelatestprice), totalAssets);
        $('.iallshow').html(decimal.getTwoPs(totalvalue)); //总资产
        // thelatestprice = 4;
        // thelatestprice_second = 1;
        var turnover = Number(haha['24Total']).toFixed(2);
        $('#turnover').html(turnover); //页面顶部 24小时成交量
        $('#thelatestprice_floor').html(thelatestprice); //交易大厅 最新成交价
        $('#thelatestprice_em').html(thelatestprice); //首页轮播图下面最新成交价
        if (thelatestprice != "" && thelatestprice_second == "") {}
        // console.log("thelatestprice"+thelatestprice);
        // console.log("thelatestprice_second"+thelatestprice_second);
        if (thelatestprice != "" && thelatestprice_second != "") {
            if (thelatestprice > thelatestprice_second) {
                $(".quoted_price_first").css("color", "#dd0900"); //红色
                $("#thelatestprice_em")[0] ? $("#thelatestprice_em")[0].style.backgroundImage = "url(./images/index_arrow_rise.png)" : "";
                $(".new_color").css("color", "#dd0900");
                $("#thelatestprice_floor")[0] ? $("#thelatestprice_floor")[0].style.backgroundImage = "url(./images/floor_arrow_rise.png)" : "";
            }
            if (thelatestprice < thelatestprice_second) {
                $(".quoted_price_first").css("color", "#00951c"); //蓝色
                $("#thelatestprice_em")[0] ? $("#thelatestprice_em")[0].style.backgroundImage = "url(./images/index_big_down.png)" : "";
                $(".new_color").css("color", "#00951c");
                $("#thelatestprice_floor")[0] ? $("#thelatestprice_floor")[0].style.backgroundImage = "url(./images/floor_big_down.png)" : "";
            }
        }
        var low24 = Number(haha['24low']); //最低价
        var high24 = Number(haha['24high']); //最高价
        var price24 = Number(haha['24Price']); //24小时之前价

        $('#thehighest_price').html(high24.toFixed(2)); //首页 最高价
        $('#thelowest_price').html(low24.toFixed(2)); //首页 最低价
        $('#thehighest_price_floor').html(high24.toFixed(2)); //交易大厅 最高价
        $('#thelowest_price_floor').html(low24.toFixed(2)); //交易大厅 最低价
        var total = Number(haha['total']);
        // price24 = 2;  //最新成交价*(1+x) = 24小时之前价格
        // thelatestprice = 1.2;
        var unknow = 0;
        if(price24!=0){
            var unknow = Number((thelatestprice - price24)/price24);
        }
        // console.log("price24"+price24);
        // console.log("thelatestprice"+thelatestprice);
        // console.log("unknow"+unknow);
        $('#cumulativevolumeem').html(total.toFixed(2)); //首页 累计成交量
        $('#thecumulativevolume_floor').html(total.toFixed(2)); //交易大厅 累计成交量
        $('#pricechangeratioem_updown').html((unknow * 100).toFixed(2) + "%"); //涨跌幅
        if (unknow < 0) {
            $("#pricechangeratio").css("color", "#00951c");
            $("#pricechangeratioem_updown")[0] ? $("#pricechangeratioem_updown")[0].style.backgroundImage = "url(./images/index_arrow_down.png)" : "";
        } else {
            $("#pricechangeratio").css("color", "#dd0900");
            $("#pricechangeratioem_updown")[0] ? $("#pricechangeratioem_updown")[0].style.backgroundImage = "url(./images/index_sma_top.png)" : "";
        }
        var bid_history_list_html = "";
        var orderlist = haha['order'];
        if (orderlist != null) {
            for (var i = 0; i < orderlist.length; i++) {
                var orderliststr = JSON.parse(orderlist[i]);
                var timestr = orderliststr.time;
                var buyorsell = orderliststr.type;
                if (buyorsell == "BUY") {
                    buyorsell = "买入";
                    sell_color = "buy_color";
                }
                if (buyorsell == "SELL") {
                    buyorsell = "卖出";
                    sell_color = "sell_color";
                }
                bid_history_list_html += "<div class='table_row'>" +
                    "<div class='table_con'>" + timestr + "</div><div class='table_con " + sell_color + "'>" + buyorsell + "</div>" +
                    "<div class='table_con'>" + decimal.getTwoPs(orderliststr.price) + "</div><div class='table_con'>" + decimal.getTwoPs(orderliststr.num) + "</div>" +
                    "</div>";
            }
        }
        if(bid_history_list_html==""){
            console.log("xxxxxxxxxxxx")
            $(".no-record-picture3").show();
        } else {
            $(".no-record-picture3").hide();
            $("#table_three").html(bid_history_list_html);
        }
    }
    var get = price.get = function() {
        once(function(next) {
            updateprice(next);
            price.onChange2();
            price.timer = setTimeout(price.get, price.interval);
        });
    };
    return price;
});

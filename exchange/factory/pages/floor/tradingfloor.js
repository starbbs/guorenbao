require(['api_mkt', 'mkt_info', 'mkt_trade','decimal', 'cookie'], function(api_mkt, mkt_info, mkt_trade,decimal) {
    //console.log(api_mkt);
    //console.log(mkt_info);
    //$("#floor_popDiv").width($(document).width());
    //$('#floor_popDiv').height($(document).height());
    $('#floor_bg').css('left', 0);
    $('#floor_bg').css('top', 0);

    // var exchangeToken = $.cookie('exchangeToken');
    // console.log(exchangeToken);
    // var global_loginusername = "";
    // if (!exchangeToken) {
    //     $(".login_regist").show();
    // } else {
    //     $(".login_regist").hide();
    //     $(".login_header").show();
    //     $("#logined_username").html(global_loginusername);
    //     $(".popDiv").hide();
    //     $(".bg").hide();
    // }
    

    var exchangeToken = $.cookie('exchangeToken');
    if (!exchangeToken) {
       $('.eye_i').trigger("click");
    } else {
        api_mkt.realAuth({
        }, function(data) {
            if (data.status == 200) {
            } else if (data.status == 305) {
            } else if(data.status == 400){
            } else {
            }
        });
    }

    
    
    var getTotalAssets=function(){
    	api_mkt.totalAssets(function(data) {
            if (data.status == 200) {
                var gopBalance = data.data.gopBalance;  //剩余果仁数
                var cnyBalance = data.data.cnyBalance;  //剩余人民币数
                var gopLock = data.data.gopLock;  //冻结果仁数
                var cnyLock = data.data.cnyLock;  //冻结人民币数
                var totalAssets = data.data.cnyBalance + data.data.cnyLock;
                var totalNuts = data.data.gopBalance + data.data.gopLock;
                var totalvalue = totalNuts*$('#thelatestprice').html()+totalAssets;
                $('.iallshow').html(totalvalue.toFixed(2));//总资产
                $(".ioneshow").html(cnyBalance.toFixed(2));
                $(".itwoshow").html(gopBalance.toFixed(2));
                $(".ithreeshow").html(cnyLock.toFixed(2));
                $(".ifourshow").html(gopLock.toFixed(2));
                
                $.cookie('allCNY',cnyBalance);
                $.cookie('gop',gopBalance);           
                $.cookie('allCNY',cnyBalance);
                $('.w_b_l_one').html("<em>账户余额："+data.data.cnyBalance.toFixed(2)+" CNY</em>");
                $('.w_b_l_two').html("<em>果仁余额："+data.data.gopBalance.toFixed(2)+" GOP</em>");
            } else {
                console.log(data.msg);
            }
        });
    }
    //总资产
    getTotalAssets();
    
    


    mkt_info.get();
    mkt_trade.getfloor();
    var groupingUnits = [
        [
            '周', // unit name
            [1] // allowed multiples
        ],
        [
            '月', [1, 2, 3, 4, 6]
        ]
    ];
    var ohlc = [];
    var volume = [];
    var on_page_load = false;
    var onem;
    var fivem;
    var fifteenm;
    var thirtym;
    var sixtym;
    var oned;
    var klineapply = function(data) {
        dataLength = data.length;
        onem = JSON.parse(data['1m']);
        fivem = JSON.parse(data['5m']);
        fifteenm = JSON.parse(data['15m']);
        thirtym = JSON.parse(data['30m']);
        sixtym = JSON.parse(data['60m']);
        oned = JSON.parse(data['1d']);
        if(!on_page_load){
            $(".fivteenminute").click();
            on_page_load = true;
        }
    }
    api_mkt.homepage_tradingfloor_kline(function(data) {
        klineapply(data);
    });
    var highcharts_Rendering = function(whichday, groupingUnits) {
        Highcharts.theme = {
            colors: ["#ee6259", "#bee8d0", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
            chart: { borderColor: "#DDD", plotShadow: !0, plotBorderWidth: 1 },
            title: { style: { color: "#000", font: 'bold 16px "Trebuchet MS", Verdana, sans-serif' } },
            subtitle: { style: { color: "#666666", font: 'bold 12px "Trebuchet MS", Verdana, sans-serif' } },
            legend: { itemStyle: { font: "9pt Trebuchet MS, Verdana, sans-serif", color: "black" }, itemHoverStyle: { color: "#039" }, itemHiddenStyle: { color: "gray" } },
            labels: { style: { color: "#99b" } },
            navigation: { buttonOptions: { theme: { stroke: "#CCCCCC" } } }
        };
        //图表设置
        Highcharts.setOptions({
            colors: ['#DD1111', '#FF0000', '#DDDF0D', '#7798BF', '#55BF3B', '#DF5353', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            lang: {
                loading: 'Loading...',
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                decimalPoint: '.',
                numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
                resetZoom: 'Reset zoom',
                resetZoomTitle: 'Reset zoom level 1:1',
                thousandsSep: ','
            },
            credits: { enabled: false }
        });
        ohlc = [];
        volume = [];
        if (whichday == "one") {
            for (var i = 0; i < onem.length; i++) {
                ohlc.push([onem[i][0], onem[i][2], onem[i][3], onem[i][4], onem[i][5]]);
                volume.push([onem[i][0], onem[i][1]]);
            }
        } else if (whichday == "five") {
            for (var i = 0; i < fivem.length; i++) {
                ohlc.push([fivem[i][0], fivem[i][2], fivem[i][3], fivem[i][4], fivem[i][5]]);
                volume.push([fivem[i][0], fivem[i][1]]);
            }
        } else if (whichday == "fivteen") {
            for (var i = 0; i < fifteenm.length; i++) {
                ohlc.push([fifteenm[i][0], fifteenm[i][2], fifteenm[i][3], fifteenm[i][4], fifteenm[i][5]]);
                volume.push([fifteenm[i][0], fifteenm[i][1]]);
            }
        } else if (whichday == "thirty") {
            for (var i = 0; i < thirtym.length; i++) {
                ohlc.push([thirtym[i][0], thirtym[i][2], thirtym[i][3], thirtym[i][4], thirtym[i][5]]);
                volume.push([thirtym[i][0], thirtym[i][1]]);
            }
        } else if (whichday == "sixty") {
            for (var i = 0; i < sixtym.length; i++) {
                ohlc.push([sixtym[i][0], sixtym[i][2], sixtym[i][3], sixtym[i][4], sixtym[i][5]]);
                volume.push([sixtym[i][0], sixtym[i][1]]);
            }
        } else if (whichday == "oneday") {
            for (var i = 0; i < oned.length; i++) {
                ohlc.push([oned[i][0], oned[i][2], oned[i][3], oned[i][4], oned[i][5]]);
                volume.push([oned[i][0], oned[i][1]]);
            }
        }
        $('#timeshare_container').highcharts('StockChart', {
            rangeSelector: {buttons: [{type: 'minute', count: 60, text: '1h'},{type: 'minute', count: 120, text: '2h'},{type: 'minute', count: 360, text: '6h'},{type: 'minute', count: 720, text: '12h'},{type: 'day', count: 1, text: '1d'},{type: 'week', count: 1, text: '1w'},{type: 'all', text: '所有'}],selected:2, inputEnabled:false},
            global: {
                useUTC: false
            },
            credits: { enabled: false },
            colors: ['#000000', '#0000ff', '#ff00ff', '#f7a35c', '#8085e9'],
            title: {
                text: '果仁市场K线图'
            },
            xAxis: {
                type: 'dataTime'
            },
            exporting: { enabled: false, buttons: { exportButton: { enabled: false }, printButton: { enabled: true } } },
            tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },
            plotOptions: { candlestick: { color: '#e55600', upColor: '#669900' } },
            yAxis: [
                { labels: { style: { color: '#4572A7' } }, title: { text: '成交量 [GOP]', style: { color: '#4572A7' } }, offset: 0, top: 280, height: 34, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true },
                { labels: { style: { color: '#e55600' } }, title: { text: '价格 [RMB]', style: { color: '#e55600' } }, height: 160, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true }
            ],
            tooltip: {
                formatter: function() {
                    var s = Highcharts.dateFormat('<span> %Y-%m-%d %H:%M:%S</span><br/>', this.x);
                    s += "成交数量"+this.points[1].y;
                    s += '<br />开盘:<b>' + this.points[0].point.open + '</b><br />最高:<b>' + this.points[0].point.high + '</b><br />最低:<b>' + this.points[0].point.low + '</b><br />收盘:<b>' + this.points[0].point.close + '</b>';
                    return s;
                },
                shared: true,
                useHTML: true,
                valueDecimals: 2, //有多少位数显示在每个系列的y值
                crosshairs: [{
                    color: '#b9b9b0'
                }, {
                    color: '#b9b9b0'
                }]
            },
            scrollbar: {
                enabled: true
            },
            series: [
                { animation: false, name: '价格 [RMB]', type: 'candlestick', dataGrouping: { units: groupingUnits, enabled: false }, data: ohlc },
                { animation: false, name: '成交量 [GOP]', type: 'column', color: '#4572A7', dataGrouping: { units: groupingUnits, enabled: false }, yAxis: 1, data: volume }
            ]
        });
    }
    api_mkt.depthchart(function(data){
        var obj1 = data[0].sort(function(t,a){return t[0]>a[0]?1:t[0]<a[0]?-1:0});
        var obj2 = data[1];
        $('#deepmap_container').highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: '果仁市场深度图'
            },
            xAxis: {
                allowDecimals: false,
                title:{text:'价格'},
                labels: {
                    formatter: function() {
                        return '¥'+this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: '数量'
                }
                // ,
                // labels: {
                //     formatter: function() {
                //         return this.value / 1000 + 'k';
                //     }
                // }
            },
            tooltip: {
                //pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
                pointFormat: "¥"+"{point.x} <br />{series.name}:{point.y}"
            },
            plotOptions: {
                area: {
                    pointStart: 0,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: '累计买单',
                data: obj1
            }, {
                name: '累计卖单',
                data: obj2
            }]
        });
    });
    $(".leftchart").on("click",function(){
        //分时图
        $(".timeshareblock").show();
        $("#timeshare_container").show();
        $("#deepmap_container").hide();
        $(this).addClass("leftright_bottomon");
        $(".rightchart").removeClass("leftright_bottomon");
    });
    $(".rightchart").on("click",function(){
        //深度图
        $(".timeshareblock").hide();
        $("#timeshare_container").hide();
        $("#deepmap_container").show();
        $(this).addClass("leftright_bottomon");
        $(".leftchart").removeClass("leftright_bottomon");
    }); 
    $(".timebar").on("click", function() {
        $(this).addClass("btn_choosed");
        $(this).siblings().removeClass("btn_choosed");
        if ($(this).hasClass("oneminute")) {
            highcharts_Rendering("one", groupingUnits);
        } else if ($(this).hasClass("fiveminute")) {
            highcharts_Rendering("five", groupingUnits);
        } else if ($(this).hasClass("fivteenminute")) {
            highcharts_Rendering("fivteen", groupingUnits);
        } else if ($(this).hasClass("thirtyminute")) {
            highcharts_Rendering("thirty", groupingUnits);
        } else if ($(this).hasClass("sixtyminute")) {
            highcharts_Rendering("sixty", groupingUnits);
        } else if ($(this).hasClass("onedayminute")) {
            highcharts_Rendering("oneday", groupingUnits);
        }
    });    
    var fflat = false;
    $(".eye_i").on("click",function(){
        if(fflat){
            $(this)[0].style.background = "url(./images/floor_no_eye.png)";
            fflat = false;
            $(".iallhide").hide();
            $(".iallshow").show();
            $(".ionehide").hide();
            $(".ioneshow").show();
            $(".itwohide").hide();
            $(".itwoshow").show();
            $(".ithreehide").hide();
            $(".ithreeshow").show();
            $(".ifourhide").hide();
            $(".ifourshow").show();
        } else {
            $(this)[0].style.background = "url(./images/floor_eye_black.png)";
            fflat = true;
            $(".iallhide").show();
            $(".iallshow").hide();
            $(".ionehide").show();
            $(".ioneshow").hide();
            $(".itwohide").show();
            $(".itwoshow").hide();
            $(".ithreehide").show();
            $(".ithreeshow").hide();
            $(".ifourhide").show();
            $(".ifourshow").hide();
        }
    });

    /*滑块 start*/
    function hexFromRGB(r, g) {
    var hex = [
          r.toString( 16 ),
          g.toString( 16 )
    ];
    $.each( hex, function( nr, val ) {
          if ( val.length === 1 ) {
              hex[ nr ] = "0" + val;
          }
    });
    return hex.join( "" ).toUpperCase();
    }
    function refreshSwatch() {
        var red = $( "#red" ).slider( "value" ),
            green = $( "#green" ).slider( "value" ),
            hex = hexFromRGB( red, green);
    }

    //当前委托（不传参数查询最近5条）
    api_mkt.tradeGopCurrentList(function(data) {
        if (data.status == 200 && data.data.list.length >0) {
            var html = [];
            var num = data.data.list.length < 5?data.data.list.length:5;
            for(var i=0; i<num;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[i].createDate +"</td>");                
                html.push("<td class='id' style='display:none'>"+ data.data.list[i].id +"</td>");
                html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                html.push("<td class='tradeGopFlag' style='display:none'>"+ data.data.list[i].tradeGopFlag +"</td>");                    
                html.push("<td class='price'>"+ data.data.list[i].price +"</td>");
                html.push("<td class='numTotal'>"+ data.data.list[i].numTotal +"</td>");
                html.push("<td>"+ toFixedNum(data.data.list[i].numTotal - data.data.list[i].numOver) + "</td>");
                html.push("<td>"+ data.data.list[i].numOver +"</td>");
                html.push("<td><p class='saDan'>撤单</p></td>");
                html.push("</tr>");
                $(".tradeGopCurrentListTable").html("");  //添加前清空 
                $(".tradeGopCurrentListTable").append(html.join(""));  
                //过滤内容显示不同颜色
                $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");  
                //撤单
                $('.saDan').click(function(){                    
                    var text = $(this).parent().parent().find('.id').text();
                    $("#floor_bg").show();
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_popDiv").fadeIn(500);
                    //变为 撤单 确认框
                    $('.h3_1').css('display','none');
                    $('.sure_btn').css('display','none');
                    $('#sel_div_password').css('display','none');
                    $('.h3_2').css('display','block');
                    $('.sure_btn1').css('display','block');
                
                    //确认撤单
                    $('.confirm').click(function(){                        
                        api_mkt.tradeGopCancelByid({
                            'id':text
                        },function(data) {        
                            //恢复为 买入卖出 确认框
                            $("#floor_popDiv").hide(500);
                            $("#floor_bg").hide();
                            $('.h3_1').css('display','block');
                            $('.sure_btn').css('display','block');
                            $('#sel_div_password').css('display','block');
                            $('.h3_2').css('display','none');
                            $('.sure_btn1').css('display','none');
                            window.location.reload();
                        });
                    }); 
                    //取消撤单
                    $('.cancle').click(function(){
                        $("#floor_bg").hide();
                        $("#floor_popDiv").hide(500);
                        //恢复为 买入卖出 确认框
                        $("#floor_popDiv").hide(500);
                        $("#floor_bg").hide();
                        $('.h3_1').css('display','block');
                        $('.sure_btn').css('display','block');
                        $('#sel_div_password').css('display','block');
                        $('.h3_2').css('display','none');
                        $('.sure_btn1').css('display','none');
                    }); 
                });             
            }               
        }else{
            //console.log(data);
        }
    });    

   
    //历史委托（不传参数查询最近5条）
    api_mkt.tradeGopHistoryList(function(data) {
        if (data.status == 200) {
            console.log(data); 
            var html = [];
            var num = data.data.list.length < 5?data.data.list.length:5;
            for(var i=0; i<num;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[i].createDate +"</td>");
                html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                html.push("<td>"+ data.data.list[i].price +"</td>");
                html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                html.push("<td class='priceAver'>"+ toFixedNum(data.data.list[i].totalTraded / data.data.list[i].numTotal) + "</td>");
                html.push("<td>"+ data.data.list[i].numOver +"</td>");
                html.push("<td>"+ data.data.list[i].totalTraded +"</td>");
                html.push("<td class='tradeGopStatus'>"+ data.data.list[i].tradeGopStatus +"</td>");
                html.push("</tr>");
                $(".tradeGopHistoryListTable").html("");  //添加前清空 
                $(".tradeGopHistoryListTable").append(html.join(""));

                //过滤内容显示不同颜色
                $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");
                $(".tradeGopStatus").filter(":contains('SUCCESS')").text('已成交').css("color","orange");                    
                $(".tradeGopStatus").filter(":contains('CANCEL')").text('已撤销').css("color","#999");                                     
                $(".priceAver").filter(":contains('Infinity')").text('0'); 
            }       
        }else{
            console.log(data);
        }
    });
    
    $("#buyin_limitedpricebtn").on("click",function(){
        //买入限价
        $(".buyin_limitprices_section").show();
        $(".buyin_marketprices_section").hide();
        $(this).addClass("border_bottom_on");
        $("#buyin_marketpricebtn").removeClass("border_bottom_on");
    });
    $("#buyin_marketpricebtn").on("click",function(){
        //买入市价
        $(".a1").hide();
        $(".a2").hide();
        $(".market_price_buying_btn").css("top","332px");

        $(".buyin_limitprices_section").hide();
        $(".buyin_marketprices_section").show();
        $(this).addClass("border_bottom_on");
        $("#buyin_limitedpricebtn").removeClass("border_bottom_on");
    });
    $("#sale_limitedpricebtn").on("click",function(){
        //卖出限价
        $(".sale_limitprices").show();
        $(".sale_marketprices").hide();
        $(this).addClass("border_bottom_on");
        $("#sale_marketpricebtn").removeClass("border_bottom_on");
    });
    $("#sale_marketpricebtn").on("click",function(){
        //卖出市价
        $(".b1").hide();
        $(".b2").hide();
        $(".sale_limitprices").hide();
        $(".sale_marketprices").show();
        $(this).addClass("border_bottom_on");
        $("#sale_limitedpricebtn").removeClass("border_bottom_on");
    });     

    //弹出框确认 关闭
    /*$(".sure_btn").on("click",function(){
        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
    });*/
   
    //买入
    var flag = false;
    //禁止输入负号
    $('input').keydown(function(event) { 
        //console.log(event.keyCode); 
        if (event.keyCode == 189 || event.keyCode == 109) {  
            return false;  
        }  
    });
    $(".wrapper").on("input propertychange", ".buying_number, .buying_price", function() {
        var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.toDecimal(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.toDecimal(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	$(this).val(oldData?oldData:0.1);
            flag = true;
        }else{
            flag = true;
            var number = decimal.toDecimal($('.buying_number').val());//购买数量
            var price=decimal.toDecimal($('.buying_price').val());//购买价格
            var balance=decimal.toDecimal($.cookie('allCNY'));//账户余额
            var numDeal = price * number;//成交金额
            if(numDeal>balance){//成交金额大于账户余额
            	numDeal=balance;
            	number=decimal.toDecimal(numDeal/price);
            	$('.buying_number').val(number);//重置购买数量
            }
            $(this).attr("data-old",numDeal);            
            var percentage =decimal.toDecimal(balance<=0? 0: (numDeal)/balance*100);//购买比例(占总资产)
            $( "#amount" ).text(percentage+'%'); //限价除以人民币账户余额
            $('.one').val('¥：'+ decimal.toDecimal(numDeal)); 
            /*买入-限价 滑块数值*/           
            $( "#red" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: percentage,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount" ).html( ui.value +  "%" );
                        $('.one').val('¥：'+ decimal.toDecimal(parseInt(ui.value)* balance/100)); 
                        $( ".buying_number" ).val( decimal.toDecimal((parseInt(ui.value) * balance) / (100 *price)));
                  }
            });
        }        
    });
    /*买入-限价 滑块初始化*/
    $( "#red" ).slider({
          orientation: "horizontal",
          range: "min",
          slide: refreshSwatch,
          change: refreshSwatch, 
          value: 0,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
                $( "#amount" ).html( ui.value +  "%" );             
                if(decimal.toDecimal(mkt_trade.buyaprice)>0){
                	$('.buying_price').val(decimal.toDecimal(mkt_trade.buyaprice));
                    $( ".buying_number" ).val( ((parseInt(ui.value) * decimal.toDecimal($.cookie('allCNY'))) / 100/decimal.toDecimal(mkt_trade.buyaprice)).toFixed(2));
                    $('.one').val('¥：'+ decimal.toDecimal(parseInt(ui.value)*  decimal.toDecimal($.cookie('allCNY'))/100)); 
                }
          }
    });     

   //买入 市价 滑块
    $(".wrapper").on("input propertychange", ".marketBuy", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.toDecimal(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.toDecimal(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	$(this).val(oldData?oldData:0.1);
        	flag = true;
        }else{
            flag = true;
            var numDeal = decimal.toDecimal(num);//购买金额
            var balance = decimal.toDecimal($.cookie('allCNY'));//人民币余额
            if(numDeal>balance){//成交金额大于账户余额
            	numDeal=balance;
            	$(this).val(numDeal);//重置购买数量
            }
        	$(this).attr("data-old",numDeal);
            var percentage =  decimal.toDecimal((numDeal / balance)*100);//购买百分比
            /*买入-限价 滑块数值*/
            $( "#amount1" ).text(percentage+'%'); //购买百分比
        	$('.onePage').val("¥："+$(this).val());//交易额
            $( "#red1" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: percentage,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {                
                        $( "#amount1" ).html( ui.value +  "%" );
                        $( ".marketBuy" ).val( ((parseInt(ui.value) * decimal.toDecimal($.cookie('allCNY')) ) / 100).toFixed(2));
                        $('.onePage').val("¥："+$( ".marketBuy" ).val());//交易额
                  }
            }); 
        }
    });
    
    
    /*买入-市价 滑块初始化*/
    $( "#red1" ).slider({
          orientation: "horizontal",
          range: "min",
          slide: refreshSwatch,
          change: refreshSwatch, 
          value: 0,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
                $( "#amount1" ).html( ui.value +  "%" );
                $( ".marketBuy" ).val( ((parseInt(ui.value) * decimal.toDecimal($.cookie('allCNY')) ) / 100).toFixed(2));
                $('.onePage').val("¥："+$( ".marketBuy" ).val());//交易额

          }
    });
    
   //卖出 市价 滑块
    $(".wrapper").on("input propertychange", ".sellAmount", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.toDecimal(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.toDecimal(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	$(this).val(oldData?oldData:0.1);
        	flag = true;
        }else{
            flag = true;
            var sellGop = decimal.toDecimal(num);
            var balanceGop = decimal.toDecimal($.cookie('gop'));
            if(sellGop>balanceGop){//成交金额大于账户余额
            	sellGop=balanceGop;
            	$(this).val(sellGop);//重置购买数量
            }
            $(this).attr("data-old",sellGop);
            var percentage = decimal.toDecimal((sellGop / balanceGop )*100);
            /*买入-限价 滑块数值*/
            $( "#amount3" ).text( percentage +'%'); //卖出百分比
            if(decimal.toDecimal(mkt_trade.sellaprice)){
                $(".two").val("¥："+decimal.toDecimal(sellGop*decimal.toDecimal(mkt_trade.sellaprice)));//交易额
            }
            $( "#green1" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: percentage,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount3" ).html( ui.value +  "%" );
                        $( ".sellAmount" ).val(((decimal.toDecimal(ui.value) * decimal.toDecimal($.cookie('gop')) ) / 100).toFixed(2));
                        if(decimal.toDecimal(mkt_trade.sellaprice)){
                            $(".two").val("¥："+decimal.toDecimal(decimal.toDecimal($('.sellAmount').val())*decimal.toDecimal(mkt_trade.sellaprice)));//交易额
                        }
                  }
            }); 
        }
    });

    $(".wrapper").on("input propertychange", ".sellNumber, .sellPrice", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.toDecimal(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.toDecimal(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	$(this).val(oldData?oldData:0.1);
        	flag = true;
        }else{
        	$(this).attr("data-old",num);
            flag = true;
            var sellGop = decimal.toDecimal($('.sellNumber').val());//卖出果仁数
            var sellPrice = decimal.toDecimal($('.sellPrice').val());//卖出价格
            var balanceGop = decimal.toDecimal($.cookie('gop'));//果仁余额
            if(sellGop>balanceGop){//成交金额大于账户余额
            	sellGop=balanceGop;
            	$(this).val(sellGop);//重置购买数量
            }
            $(this).attr("data-old",sellGop);
            var percentage = decimal.toDecimal((sellGop / balanceGop )*100);
            $('.two').val('¥：'+ decimal.toDecimal(sellGop*sellPrice));
            /*买入-限价 滑块数值*/
            $( "#amount2" ).text( percentage +'%'); //限价除以总钱数
            $( "#green" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: percentage,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount2" ).html( ui.value +  "%" );
                        $( ".sellNumber" ).val(((parseInt(ui.value) * parseInt($.cookie('gop')) ) / 100).toFixed(2));
                        if(sellPrice){
                            $(".two").val("¥："+decimal.toDecimal(decimal.toDecimal($('.sellNumber').val())*sellPrice));//交易额
                        }
                  }
            }); 
        }
    });
    
    /*卖出-市价 滑块初始化*/
    $( " #green" ).slider({
          orientation: "horizontal",
          range: "min",
          slide: refreshSwatch,
          change: refreshSwatch, 
          value: 0,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
                $( "#amount2" ).html( ui.value +  "%" );
                $( ".sellNumber" ).val(((decimal.toDecimal(ui.value) * decimal.toDecimal($.cookie('gop')) ) / 100).toFixed(2));
                if(decimal.toDecimal(mkt_trade.sellaprice)>0){
                	$('.sellPrice').val(decimal.toDecimal(mkt_trade.sellaprice));
                    $(".two").val("¥："+decimal.toDecimal(decimal.toDecimal($('.sellNumber').val())*decimal.toDecimal(mkt_trade.sellaprice)));//交易额
                }
          }
    });
    /*卖出-市价 滑块初始化*/
    $( " #green1" ).slider({
          orientation: "horizontal",
          range: "min",
          slide: refreshSwatch,
          change: refreshSwatch, 
          value: 0,
          min: 0,
          max: 100,
          slide: function( event, ui ) {
        	  $( "#amount3" ).html( ui.value +  "%" );
              $( ".sellAmount" ).val(((decimal.toDecimal(ui.value) * decimal.toDecimal($.cookie('gop')) ) / 100).toFixed(2));
              if(decimal.toDecimal(mkt_trade.sellaprice)){
                  $(".two").val("¥："+decimal.toDecimal(decimal.toDecimal($('.sellAmount').val())*decimal.toDecimal(mkt_trade.sellaprice)));//交易额
              }
          }
    });
    //买入 卖出 四个按钮 点击弹出框
    $(".buying_btn").click(function(){ 
        if(flag == false || decimal.toDecimal($('.buying_number').val())<0.1){
            alert('请输入完整信息！');
        }else{
            api_mkt.buyBefore({
                'price':$('.buying_price').val(),
                'number':$('.buying_number').val(),
                'type':'FIXED'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_popDiv").fadeIn(500);   
                    $('#hideSection').val('1');         
                }else if(data.status == 400){
                    alert('账户余额不足');
                }
            }); 
        } 
    }); 
    $(".market_price_buying_btn").click(function(){  
        if(flag == false || decimal.toDecimal($('.marketBuy').val())<0.1){
            alert('请输入完整信息！');
        }else{
            api_mkt.buyBefore({
                'price':$('.marketBuy').val(),
                //'number':$('.buying_number').val(),
                'type':'MARKET'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_popDiv").fadeIn(500);
                    $('#hideSection').val('2');               
                }else if(data.status == 400){
                    alert('账户余额不足');
                }
            }); 
        }        
    });
    $(".sale_btn").click(function(){  
        if(flag == false || decimal.toDecimal($('.sellNumber').val())<0.1){
            alert('请输入完整信息！');
        }else{
           api_mkt.sellBefore({
                'price':$('.sellPrice').val(),
                'number':$('.sellNumber').val(),
                'type':'FIXED'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_popDiv").fadeIn(500); 
                    $('#hideSection').val('3');              
                }else{
                    console.log(data);
                }
            });   
        }        
    }); 
    $(".market_price_sale_btn").click(function(){  
        if(flag == false || decimal.toDecimal($('.sellAmount').val())<0.1){
            alert('请输入完整信息！');
        }else{
            api_mkt.sellBefore({
                'number':$('.sellAmount').val(),
                'type':'MARKET'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_bg").show();
                    $("#floor_popDiv").fadeIn(500); 
                    $('#hideSection').val('4');              
                }else{
                    console.log(data);
                }
            }); 
        }        
    });              

    $('.onePage').text($('.marketBuy').text());

    $(".close_btn").on("click",function(){  //买入卖出 关闭按钮
        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
    });

    //单击弹出框 确认按钮判断   买入 > 限价 市价 判断  卖出 > 限价 市价 判断
    $('.sure_btn').click(function(){       
        if( $('#hideSection').val() == 1){//限价买入
            api_mkt.buy({
                'price':$('.buying_price').val(),
                'number':$('.buying_number').val(),
                'type':'FIXED',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data); 
                    $("#floor_popDiv").hide();
                    $("#floor_bg").hide();
                    //getTotalAssets();
                    alert('买入成功');                     
                    window.location.reload();
                }else{
                	console.log(data);
                	if(data.status==400){
                		if((data.date && data.date.num) || (data.data && data.data.num)){
                			var num=data.data?data.data.num:data.date.num;
                			$(".payment_error").html("还有"+(3-num)+"次输入机会");
                		}
                	}else{
                		$(".payment_error").html(data.msg);
                	}
                    $(".payment_error").show();
                }
            });
        }else if( $('#hideSection').val() == 2){//市价买入
            api_mkt.buy({
                'price':$('.marketBuy').val(),
                'type':'MARKET',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_popDiv").hide();
                    $("#floor_bg").hide();
                    //getTotalAssets();
                    alert('买入成功');
                    window.location.reload();               
                }else{
                    console.log(data);
                    $(".payment_error").show();
                    $(".payment_error").html(data.msg);
                }
            });
        }else if( $('#hideSection').val() == 3){//限价卖出
            api_mkt.sell({
                'price':$('.sellPrice').val(),
                'number':$('.sellNumber').val(),
                'type':'FIXED',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data); 
                    $("#floor_popDiv").hide();
                    $("#floor_bg").hide();
                    getTotalAssets();
                    alert('卖出成功');  
                    window.location.reload();                
                }else{
                    console.log(data);
                    $(".payment_error").show();
                    $(".payment_error").html(data.msg);
                }
            });
        }else if( $('#hideSection').val() == 4){//市价卖出
            api_mkt.sell({
                'number':$('.sellAmount').val(),
                'type':'MARKET',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);  
                    $("#floor_popDiv").hide();
                    $("#floor_bg").hide();
                    getTotalAssets();
                    alert('卖出成功');  
                    window.location.reload();               
                }else{
                    console.log(data);
                    $(".payment_error").show();
                    $(".payment_error").html(data.msg);
                }
            });
        }       
    });

    //支付密码聚焦 清空
    $('.sel_div_password').focus(function(){
        $(this).val('');
    });
    //toFixed 不 四舍五入
    var toFixedNum = function(){
        var bb = num+"";  
        var dian = bb.indexOf('.');  
        var result = "";  
        if(dian == -1){  
            result =  num.toFixed(2);  
        }else{  
            var cc = bb.substring(dian+1,bb.length);  
            if(cc.length >=3){  
                result =  (Number(num.toFixed(2)));  
            }else{  
                result =  num.toFixed(2)-0.01;  
            }  
        } 
        return result; 
    }


});

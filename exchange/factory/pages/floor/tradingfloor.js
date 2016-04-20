require(['api_mkt', 'mkt_info', 'mkt_trade','decimal', 'cookie'], function(api_mkt, mkt_info, mkt_trade,decimal) {
    $('#floor_bg').css('left', 0);
    $('#floor_bg').css('top', 0);
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

    /**
     * 禁止输入框粘贴
     */
    $("input").on("paste",function(e){
		return false;
	});
    
    /**
     * 输入框通用校验
     */
    $("#sel_div_password").on("keyup",function(e){
    	//只允许输入 ASCII的33~126的字符
		if(this.value.charCodeAt()<33 || this.value.charCodeAt()>126){
			$(this).val($(this).val().replace(this.value,""));
		}
	});
    
	$(".buying_price,.buying_number,.marketBuy,.sellPrice,.sellNumber,.sellAmount").on("keyup",function(e){
		//只允许输入 数字字符
		if((this.value.charCodeAt()!=46 && this.value.charCodeAt()<48) || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}
		
	});
    
    var getTotalAssets=function(){
    	api_mkt.totalAssets(function(data) {
            if (data.status == 200) {
                var gopBalance = data.data.gopBalance;  //剩余果仁数
                var cnyBalance = data.data.cnyBalance;  //剩余人民币数
                var gopLock = data.data.gopLock;  //冻结果仁数
                var cnyLock = data.data.cnyLock;  //冻结人民币数
                var totalAssets =decimal.floatAdd( data.data.cnyBalance , data.data.cnyLock);
                var totalNuts = decimal.floatAdd( data.data.gopBalance , data.data.gopLock);
                var totalvalue = decimal.floatAdd(decimal.floatMulti(totalNuts,$('#thelatestprice').html()),totalAssets);
                $('.iallshow').html(decimal.getTwoPs(totalvalue));//总资产
                $(".ioneshow").html(decimal.getTwoPs(cnyBalance));
                $(".itwoshow").html(decimal.getTwoPs(gopBalance));
                $(".ithreeshow").html(decimal.getTwoPs(cnyLock));
                $(".ifourshow").html(decimal.getTwoPs(gopLock));
                
                $.cookie('allCNY',cnyBalance);
                $.cookie('gop',gopBalance);           
                $.cookie('allCNY',cnyBalance);     
                
                //卖出最大数量
            	$(".sellNumber").attr("placeholder","最大数量 "+decimal.getTwoPs(data.data.gopBalance)+"G");
            	
            	$(".max_buy_num").html(decimal.getTwoPs(cnyBalance));
            	$(".max_sell_num").html(decimal.getTwoPs(gopBalance));
            	 
                 
                $('.w_b_l_one').html("<em>账户余额：¥ "+decimal.getTwoPs(data.data.cnyBalance)+"</em>");
                $('.w_b_l_two').html("<em>果仁余额：G "+decimal.getTwoPs(data.data.gopBalance)+"</em>");
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
        if(data['1d']){
            oned = JSON.parse(data['1d']);
        }
        if(!on_page_load){
            $(".fivteenminute").click();
            on_page_load = true;
        }
    }
    var gettradefloorkline = function() {
        api_mkt.homepage_tradingfloor_kline(function(data) {
            klineapply(data);
        });
    }
    gettradefloorkline();
    window.setInterval(gettradefloorkline, 300000); //轮询首页的k线图


    // var arealineapply = function(data){
    //     api_mkt.homepagekline(function(data) {
    //         klineapply(data);
    //     });
    // }
    // 
    var obj1;
    var obj2;
    var gettradefloorarealine = function() {
        // api_mkt.depthchart(function(data) {
        //     obj1 = data[0].sort(function(t,a){return t[0]>a[0]?1:t[0]<a[0]?-1:0});
        //     obj2 = data[1];
        //     console.log("```````````")
        //     console.log(obj1);
        //     console.log(obj2);

        // });
        // depthchart_painting(obj1,obj2);
    }

    var depthchart_painting = function(ojb1,obj2){
        $('#deepmap_container').highcharts({
            chart: {
                type: 'area',
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var series0 = this.series[0];
                        var series1 = this.series[1];
                        setInterval(function () {
                            // var x = (new Date()).getTime(), // current time
                            //     y = Math.random();
                            // series.addPoint([x, y], true, true);
                            api_mkt.depthchart(function(data) {
                                obj1 = data[0].sort(function(t,a){return t[0]>a[0]?1:t[0]<a[0]?-1:0});
                                obj2 = data[1];
                                console.log("```````````")
                                console.log(obj1);
                                console.log(obj2);
                                //depthchart_painting(obj1,obj2);
                                series0.setData(obj1);
                                series1.setData(obj2);
                            });
                        }, 1000);
                    }
                }
            },
            title: {
                text: ''//果仁市场深度图
            },
            xAxis: {
                allowDecimals: true,
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
                // valuePrefix: '￥dsd',
                // valueSuffix: '元',
                useHTML: true,
                borderWidth: 1,
                pointFormat: "委托价:¥{point.x}</br>{series.name}<img src='./images/floor_g_deal_logo.png' style='position:relative;top:2px;'></img>:{point.y}"
            },
            exporting: { enabled: false, buttons: { exportButton: { enabled: false }, printButton: { enabled: true } } },
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
                color:'red',
                data: obj1
            }, {
                name: '累计卖单',
                color:'green',
                data: obj2
            }]
        });
    }
    depthchart_painting(obj1,obj2);
    gettradefloorarealine();
    window.setInterval(gettradefloorarealine, 3000); //轮询首页的深度图
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
                text: ''
            },
            xAxis: {
                type: 'dataTime'
            },
            exporting: { enabled: false, buttons: { exportButton: { enabled: false }, printButton: { enabled: true } } },
            tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },
            plotOptions: { candlestick: { color: '#e55600', upColor: '#669900' } },
            yAxis: [
                { labels: { style: { color: '#e55600' } }, title: { text: '价格 [RMB]', style: { color: '#e55600' } }, height: 160, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true },
                { labels: { style: { color: '#4572A7' } }, title: { text: '成交量 [GOP]', style: { color: '#4572A7' } }, offset: 0, top: 280, height: 34, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true }
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
            $(".tradeGopCurrentListTable").html("");  //添加前清空 
            for(var i=0; i<num;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[i].createDate +"</td>");                
                html.push("<td class='id' style='display:none'>"+ data.data.list[i].id +"</td>");
                html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                html.push("<td class='tradeGopFlag' style='display:none'>"+ data.data.list[i].tradeGopFlag +"</td>");                    
                if(data.data.list[i].tradeGopFlag=='MARKET'){
                	//市价
                    html.push("<td class='price'>市价</td>");
                	if(data.data.list[i].tradeGopType=='SELL'){
                        html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].tradedGop) + "</td>");
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numOver) +"</td>");
                	}else{
                        html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].market) +"</td>");
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].totalTraded) + "</td>");
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].marketOver) +"</td>");
                	}
                }else{
                	//限价
                    html.push("<td class='price'>"+ decimal.getTwoPs(data.data.list[i].price) +"</td>");
                    html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].tradedGop) + "</td>");
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numOver) +"</td>");
                }
                html.push("<td><p class='saDan'>撤单</p></td>");
                html.push("</tr>");                        
            }  
            $(".tradeGopCurrentListTable").append(html.join(""));  
            //过滤内容显示不同颜色
            $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
            $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");  
        }else{
            //console.log(data);
        }
    });    

    var text;//撤单用的全局变量
    //撤单
    $(".wrapper").on("click", ".saDan", function() {
        text = $(this).parent().parent().find('.id').text();
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
    }); 
    
    //确认撤单
    $("#floor_popDiv").on("click", ".confirm", function() {
        api_mkt.tradeGopCancelByid({
            'id':text
        },function(data) {        
            
        });
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
    
    //取消撤单
    $("#floor_popDiv").on("click", ".cancle", function() {
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
    
    //历史委托（不传参数查询最近5条）
    api_mkt.tradeGopHistoryList(function(data) {
        if (data.status == 200) {
            var html = [];
            var num = data.data.list.length < 5?data.data.list.length:5;
            $(".tradeGopHistoryListTable").html("");  //添加前清空 
            for(var i=0; i<num;i++){
                html.push("<tr>");                                      
                html.push("<td>"+ data.data.list[i].createDate +"</td>");
                html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                if(data.data.list[i].tradeGopFlag=='MARKET'){
                	//市价
                    html.push("<td>市价</td>");
                	if(data.data.list[i].tradeGopType=='SELL'){
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                	}else{
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].market) +"</td>");
                	}
                }else{
                	//限价
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].price) +"</td>");
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                }

                html.push("<td class='priceAver'>"+ decimal.getTwoPs(data.data.list[i].tradedGop<=0?0:(data.data.list[i].totalTraded*100) / (data.data.list[i].tradedGop*100)) + "</td>");
                html.push("<td>"+ decimal.getTwoPs(data.data.list[i].tradedGop) +"</td>");
                html.push("<td>"+ decimal.getTwoPs(data.data.list[i].totalTraded) +"</td>");
                html.push("<td class='tradeGopStatus'>"+ data.data.list[i].tradeGopStatus +"</td>");
                html.push("</tr>");               
            }  
            $(".tradeGopHistoryListTable").append(html.join(""));

            //过滤内容显示不同颜色
            $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
            $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");
            $(".tradeGopStatus").filter(":contains('SUCCESS')").text('已成交').css("color","orange");                    
            $(".tradeGopStatus").filter(":contains('CANCEL')").text('已撤销').css("color","#999");                                     
            $(".priceAver").filter(":contains('Infinity')").text('0'); 
        }else{
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
   
    $(".wrapper").on("input propertychange", ".buying_number, .buying_price", function() {
        var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.getTwoPs(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.getTwoPs(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	if(decimal.getTwoPs(num) < 0.1 && decimal.getPsercison(num)<=2){
        		flag = false;
        	}else{
        		$(this).val(oldData?oldData:0.1);       	
           		flag = true;
        	}            
        }else{
            flag = true;         
        }
        num = $(this).val();
        var number = decimal.getTwoPs($('.buying_number').val());//购买数量
        var price=decimal.getTwoPs($('.buying_price').val());//购买价格
        var balance=decimal.getTwoPs($.cookie('allCNY'));//账户余额
        var numDeal = decimal.floatMulti(price , number);//成交金额
        if(numDeal-balance>0){//成交金额大于账户余额
        	numDeal=balance;
        	number=decimal.getTwoPs(decimal.floatDiv(numDeal,price));
        	$('.buying_number').val(number);//重置购买数量
        }
        if($(this).hasClass("buying_price")){
        	$(this).attr("data-old",num);
        	number=decimal.getTwoPs(decimal.floatDiv(balance,price));
          	$(".buying_number").attr("placeholder","最大数量 "+number+"G");

        }else{
        	 $(this).attr("data-old",number);
        }           
        var percentage =decimal.getTwoPs(balance<=0? 0: decimal.floatDiv(decimal.floatMulti(numDeal,100),balance));//购买比例(占总资产)
        $( "#amount" ).text(parseInt(percentage)+'%'); //限价除以人民币账户余额
        $('.one').val('¥'+ decimal.getTwoPs(numDeal)); 
       
        /*买入-限价 滑块数值*/           
        $( "#red" ).slider({
              orientation: "horizontal",
              range: "min",
              slide: refreshSwatch,
              change: refreshSwatch, 
              value: parseInt(percentage),
              min: 0,
              max: 100,
              slide: function( event, ui ) { 
                    if(price>0){
                    	 $( ".buying_number" ).val( decimal.getTwoPs(decimal.floatDiv(decimal.floatMulti(parseInt(ui.value) ,balance) , decimal.floatMulti(100 ,price))));
                         $( "#amount" ).html( ui.value +  "%" );
                         $('.one').val('¥'+ decimal.getTwoPs(decimal.floatDiv(decimal.floatMulti(parseInt(ui.value), balance),100)));
                         flag=true;
                    }else{
                    	$( ".buying_number" ).val("0.00");
                    }
                	$( ".buying_number" ).attr("data-old",$( ".buying_number" ).val());

              }
        });
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
          }
    });     

   //买入 市价 滑块
    $(".wrapper").on("input propertychange", ".marketBuy", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.getTwoPs(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.getTwoPs(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	if(decimal.getTwoPs(num) < 0.1 && decimal.getPsercison(num)<=2){
        		flag = false;
        	}else{
        		$(this).val(oldData?oldData:0.1);       	
           		flag = true;
        	}            
        }else{
            flag = true;            
        }
        num = $(this).val();
        var numDeal = decimal.getTwoPs(num);//购买金额
        var balance = decimal.getTwoPs($.cookie('allCNY'));//人民币余额
        if(numDeal-balance>0){//成交金额大于账户余额
        	numDeal=balance;
        	$(this).val(numDeal);//重置购买数量
        }
    	$(this).attr("data-old",numDeal);
        var percentage = decimal.getTwoPs(balance<=0?0: decimal.floatDiv(decimal.floatMulti(numDeal,100) , balance));//购买百分比
        /*买入-限价 滑块数值*/
        $( "#amount1" ).text(parseInt(percentage)+'%'); //购买百分比
    	$('.onePage').val("¥"+$(this).val());//交易额
        $( "#red1" ).slider({
              orientation: "horizontal",
              range: "min",
              slide: refreshSwatch,
              change: refreshSwatch, 
              value: parseInt(percentage),
              min: 0,
              max: 100,
              slide: function( event, ui ) {                
                    $( "#amount1" ).html( ui.value +  "%" );
                    $( ".marketBuy" ).val( decimal.floatDiv(decimal.floatMulti(parseInt(ui.value) , decimal.getTwoPs($.cookie('allCNY')) ) , 100).toFixed(2));
                    $( ".marketBuy" ).attr("data-old",$( ".marketBuy" ).val());
                    $('.onePage').val("¥"+$( ".marketBuy" ).val());//交易额
                    if(decimal.getTwoPs($( ".marketBuy" ).val())>0){
                    	flag = true; 
                    }                  
              }
        }); 
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
                $( ".marketBuy" ).val( decimal.floatDiv(decimal.floatMulti(parseInt(ui.value) , decimal.getTwoPs($.cookie('allCNY')) ) , 100).toFixed(2));
                $( ".marketBuy" ).attr("data-old",$( ".marketBuy" ).val());
                $('.onePage').val("¥"+$( ".marketBuy" ).val());//交易额
                flag = true;
          }
    });
    
   //卖出 市价 滑块
    $(".wrapper").on("input propertychange", ".sellAmount", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.getTwoPs(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.getTwoPs(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	if(decimal.getTwoPs(num) < 0.1 && decimal.getPsercison(num)<=2){
        		flag = false;
        	}else{
        		$(this).val(oldData?oldData:0.1);       	
           		flag = true;
        	} 
        }else{
            flag = true;           
        }
        num = $(this).val();
        var sellGop = decimal.getTwoPs(num);
        var balanceGop = decimal.getTwoPs($.cookie('gop'));
        if(sellGop-balanceGop>0){//成交金额大于账户余额
        	sellGop=balanceGop;
        	$(this).val(sellGop);//重置购买数量
        }
        $(this).attr("data-old",sellGop);
        var percentage =decimal.getTwoPs(balanceGop<=0?0:decimal.floatDiv(decimal.floatMulti(sellGop,100 ),balanceGop));
        /*买入-限价 滑块数值*/
        $( "#amount3" ).text( parseInt(percentage) +'%'); //卖出百分比
        if(decimal.getTwoPs(mkt_trade.sellaprice)){
            $(".two").val("¥"+decimal.getTwoPs(decimal.floatMulti(sellGop,decimal.getTwoPs(mkt_trade.sellaprice))));//交易额
        }
        $( "#green1" ).slider({
              orientation: "horizontal",
              range: "min",
              slide: refreshSwatch,
              change: refreshSwatch, 
              value: parseInt(percentage),
              min: 0,
              max: 100,
              slide: function( event, ui ) {
                    $( "#amount3" ).html( ui.value +  "%" );
                    $( ".sellAmount" ).val(decimal.floatDiv(decimal.floatMulti(decimal.getTwoPs(ui.value) , decimal.getTwoPs($.cookie('gop')) ), 100).toFixed(2));
                    $( ".sellAmount" ).attr("data-old",$( ".sellAmount" ).val());
                    if(decimal.getTwoPs(mkt_trade.buyaprice)){
                        $(".two").val("¥"+decimal.getTwoPs(decimal.floatMulti(decimal.getTwoPs($('.sellAmount').val()),decimal.getTwoPs(mkt_trade.buyaprice))));//交易额
                    }
                    if(decimal.getTwoPs($( ".sellAmount" ).val())>0){
                    	flag=true;
                    }
              }
        }); 
    });

    $(".wrapper").on("input propertychange", ".sellNumber, .sellPrice", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if((decimal.getTwoPs(num) < 0.1) || decimal.getPsercison(num)>2 || decimal.getTwoPs(num)>999999.00){
        	//0.01-0.09,大于小数点2位的都禁止输入
        	if(decimal.getTwoPs(num) < 0.1 && decimal.getPsercison(num)<=2){
        		flag = false;
        	}else{
        		$(this).val(oldData?oldData:0.1);       	
           		flag = true;
        	} 
        }else{
            flag = true;        	
        }
        num = $(this).val();
        $(this).attr("data-old",num);
        var sellGop = decimal.getTwoPs($('.sellNumber').val());//卖出果仁数
        var sellPrice = decimal.getTwoPs($('.sellPrice').val());//卖出价格
        var balanceGop = decimal.getTwoPs($.cookie('gop'));//果仁余额
        if(sellGop-balanceGop>0){//成交金额大于账户余额
        	sellGop=balanceGop;
        	$(this).val(sellGop);//重置购买数量
        }
        if($(this).hasClass("sellPrice")){
       	 $(this).attr("data-old",num);
       }else{
       	 $(this).attr("data-old",sellGop);
       }
        var percentage = decimal.getTwoPs(balanceGop<=0?0:decimal.floatDiv(decimal.floatMulti(sellGop,100), balanceGop ));
        $('.two').val('¥'+ decimal.getTwoPs(decimal.floatMulti(sellGop,sellPrice)));
        /*买入-限价 滑块数值*/
        $( "#amount2" ).text( parseInt(percentage) +'%'); //限价除以总钱数
        $( "#green" ).slider({
              orientation: "horizontal",
              range: "min",
              slide: refreshSwatch,
              change: refreshSwatch, 
              value: parseInt(percentage),
              min: 0,
              max: 100,
              slide: function( event, ui ) {
                    $( "#amount2" ).html( ui.value +  "%" );
                    $( ".sellNumber" ).val(decimal.floatDiv(decimal.floatMulti(parseInt(ui.value) , decimal.getTwoPs($.cookie('gop')) ) , 100).toFixed(2));
                    $( ".sellNumber" ).attr("data-old",$( ".sellNumber" ).val());
                    if(sellPrice){
                        $(".two").val("¥"+decimal.getTwoPs(decimal.floatMulti(decimal.getTwoPs($('.sellNumber').val()),sellPrice)));//交易额
                        flag=true;
                    }
              }
        }); 
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
                $( ".sellNumber" ).val(decimal.floatDiv(decimal.floatMulti(parseInt(ui.value) , decimal.getTwoPs($.cookie('gop')) ) , 100).toFixed(2));
                $( ".sellNumber" ).attr("data-old",$( ".sellNumber" ).val());
                if(decimal.getTwoPs(mkt_trade.buyaprice)>0){
                	$('.sellPrice').val(decimal.getTwoPs(mkt_trade.buyaprice));
                    $(".two").val("¥"+decimal.getTwoPs(decimal.floatMulti(decimal.getTwoPs($('.sellNumber').val()),decimal.getTwoPs(mkt_trade.buyaprice))));//交易额
                }
                flag = true;
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
              $( ".sellAmount" ).val(decimal.floatDiv(decimal.floatMulti(decimal.getTwoPs(ui.value) , decimal.getTwoPs($.cookie('gop')) ), 100).toFixed(2));
              $( ".sellAmount" ).attr("data-old",$( ".sellAmount" ).val());
              if(decimal.getTwoPs(mkt_trade.sellaprice)){
                  $(".two").val("¥"+decimal.getTwoPs(decimal.floatMulti(decimal.getTwoPs($('.sellAmount').val()),decimal.getTwoPs(mkt_trade.sellaprice))));//交易额
              }
              flag = true;
          }
    });
    //买入 卖出 四个按钮 点击弹出框
    $(".buying_btn").click(function(){ 
    	if(global.payLocked || $(".popuptips").attr("data-authed")=="false"){
    		window.location.reload();
    		$(window).scrollTop(0);
    		return false;
    	}
        if(flag == false || decimal.getTwoPs($('.buying_number').val())<0.1){
            showWarnWin('请完善填写信息！',1e3);
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
                	if(data.msg.indexOf('未实名认证')>=0){
                		window.location.reload();
                		$(window).scrollTop(0);
                		return false;
                	}
                    showWarnWin('账户余额不足',1e3);
                }
            }); 
        } 
    }); 
    $(".market_price_buying_btn").click(function(){ 
    	if(global.payLocked || $(".popuptips").attr("data-authed")=="false"){
    		window.location.reload();
    		$(window).scrollTop(0);
    		return false;
    	}
        if(flag == false || decimal.getTwoPs($('.marketBuy').val())<0.1){
            showWarnWin('请完善填写信息！',1e3);
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
                    showWarnWin('账户余额不足',1e3);
                }
            }); 
        }        
    });
    $(".sale_btn").click(function(){  
    	if(global.payLocked || $(".popuptips").attr("data-authed")=="false"){
    		window.location.reload();
    		$(window).scrollTop(0);
    		return false;
    	}
        if(flag == false || decimal.getTwoPs($('.sellNumber').val())<0.1){
            showWarnWin('请完善填写信息！',1e3);
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
    	if(global.payLocked || $(".popuptips").attr("data-authed")=="false"){
    		window.location.reload();
    		$(window).scrollTop(0);
    		return false;
    	}
        if(flag == false || decimal.getTwoPs($('.sellAmount').val())<0.1){
            showWarnWin('请完善填写信息！',1e3);
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
                    showWarnWin('买入成功！',1e3);                    
                    window.location.reload();
                }else{
                	console.log(data);
                	if(data.status==400){
                		if((data.date && data.date.num) || (data.data && data.data.num)){
                			var num=data.data?data.data.num:data.date.num;
                			$(".payment_error").html("支付密码错误，您还有"+(3-num)+"次输入机会");
                		}else{
                			$(".payment_error").html(data.msg);	
                		}
                		if(data.msg.indexOf("已被锁定")>0){
                			window.location.reload();
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
                    showWarnWin('买入成功！',1e3); 
                    window.location.reload();               
                }else{
                    console.log(data);
                    if(data.status==400){
                		if((data.date && data.date.num) || (data.data && data.data.num)){
                			var num=data.data?data.data.num:data.date.num;
                			$(".payment_error").html("支付密码错误，您还有"+(3-num)+"次输入机会");
                		}else{
                			$(".payment_error").html(data.msg);	
                		}
                		if(data.msg.indexOf("已被锁定")>0){
                			window.location.reload();
                		}
                	}else{
                		$(".payment_error").html(data.msg);
                	}
                    $(".payment_error").show();
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
                    showWarnWin('卖出成功！',1e3); 
                    window.location.reload();                
                }else{
                    console.log(data);
                    if(data.status==400){
                		if((data.date && data.date.num) || (data.data && data.data.num)){
                			var num=data.data?data.data.num:data.date.num;
                			$(".payment_error").html("支付密码错误，您还有"+(3-num)+"次输入机会");
                		}else{
                			$(".payment_error").html(data.msg);	
                		}
                		if(data.msg.indexOf("已被锁定")>0){
                			window.location.reload();
                		}
                	}else{
                		$(".payment_error").html(data.msg);
                	}
                    $(".payment_error").show();
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
                    showWarnWin('卖出成功！',1e3); 
                    window.location.reload();               
                }else{
                    console.log(data);
                    if(data.status==400){
                		if((data.date && data.date.num) || (data.data && data.data.num)){
                			var num=data.data?data.data.num:data.date.num;
                			$(".payment_error").html("支付密码错误，您还有"+(3-num)+"次输入机会");
                		}else{
                			$(".payment_error").html(data.msg);	
                		}
                		if(data.msg.indexOf("已被锁定")>0){
                			window.location.reload();
                		}
                	}else{
                		$(".payment_error").html(data.msg);
                	}
                    $(".payment_error").show();
                }
            });
        }       
    });

    //支付密码聚焦 清空
    $('.sel_div_password').focus(function(){
        $(this).val('');
    });

});

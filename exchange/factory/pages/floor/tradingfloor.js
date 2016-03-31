require(['api_mkt', 'mkt_info', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info, mkt_trade) {
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
    
    var totalAssets = $.cookie("totalAssets");
    var totalNuts = $.cookie("totalNuts");

    var mine_one = $.cookie("mine_one");
    var mine_two = $.cookie("mine_two");
    var mine_three = $.cookie("mine_three");
    var mine_four = $.cookie("mine_four");

    var exchangeToken = $.cookie('exchangeToken');
    if (!exchangeToken) {
       //$(".eye_i").click();
       $('.eye_i').trigger("click");
       //console.log($('.eye_i'));
    } else {
        
    }
    if(totalAssets&&totalNuts&&mine_one&&mine_two&&mine_three&&mine_four){
        $(".iallshow").html(totalAssets);
        $(".ioneshow").html(mine_one);
        $(".itwoshow").html(mine_two);
        $(".ithreeshow").html(mine_three);
        $(".ifourshow").html(mine_four);
    }
    mkt_info.get();
    mkt_trade.getfloor();
    //console.log(mkt_depthchart);
    //mkt_depthchart.get();
    // set the allowed units for data grouping
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
                useUTC: true
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
    $("#slider_limited_price").slider({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            $("#buyin_slider_value").text(ui.value + "%");
        }
    });
    $("#slider_marketprice").slider({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            $("#slider_marketprice_value").text(ui.value + "%");
        }
    });
    $("#sale_scale_limited").slider({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            $("#sale_slider_value").text(ui.value + "%");
        }
    });
    $("#slider_marketprice_sale").slider({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            $("#sale_slider_marketprice_value").text(ui.value + "%");
        }
    });
    //("#buyin_slider_value").val("$" + $("#slider").slider("value"));
    // var flag = true;
    // $('.messagenum_area').on("click", function() {
    //     if (flag) {
    //         flag = false;
    //         $(this).css("background-color", "#ffffff");
    //         $(".popup_message_box").show("100");
    //         $(".messagenum_area em").css("color", "#333333");
    //         $(".msg_num").css("color", "#cccccc");
    //     } else {
    //         flag = true;
    //         $(this).css("background-color", "#282828");
    //         $(".popup_message_box").hide("100");
    //         $(".messagenum_area em").css("color", "#cccccc");
    //         $(".msg_num").css("color", "#333333");
    //     }
    // });

    var fflat = false;
    $(".eye_i").on("click",function(){
        if(fflat){
            $(this)[0].style.background = "url(./images/floor_eye_black.png)";
            //var totalAssets = $.cookie("totalAssets");
            //var totalNuts = $.cookie("totalNuts");
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
            $(this)[0].style.background = "url(./images/floor_no_eye.png)";
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

    /*当前委托-历史委托 new 页面 tab*/
    $(function(){
        $(".entrust-side-table:gt(0)").hide();
        var liA = $(".tab-li");
        liA.click(function(){
            $(this).addClass("bottomon").siblings(".tab-li").removeClass("bottomon");
            var liA_index = liA.index(this);
            $(".entrust-side-table").eq(liA.index(this)).show().siblings(".entrust-side-table").hide();
        });
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
        if (data.status == 200) {
            console.log(data);
            var html = [];
                for(var i=0; i<5;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal - data.data.list[i].numOver + "</td>");
                    html.push("<td>"+ data.data.list[i].numOver +"</td>");
                    html.push("<td><p class='saDan'>撒单</p></td>");
                    html.push("</tr>");
                    $(".tradeGopCurrentListTable").html("");  //添加前清空 
                    $(".tradeGopCurrentListTable").append(html.join(""));
                }               
        }else{
            console.log(data);
        }
    });
    //当前委托（带分页）
    $('.tradingfloorMore').click({
        'pageNo':1,
        'pageSize':10
    },function(){
        api_mkt.tradeGopCurrentList(function(data) {
            if (data.status == 200) {
                console.log(data); 
                var html = [];
                for(var i=0; i<10;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal - data.data.list[i].numOver + "</td>");
                    html.push("<td>"+ data.data.list[i].numOver +"</td>");
                    html.push("<td><p class='saDan'>撒单</p></td>");
                    html.push("</tr>");
                    $(".tradeGopCurrentListTable").html("");  //添加前清空 
                    $(".tradeGopCurrentListTable").append(html.join(""));
                }                            
            }else{
                console.log(data);
            }
        });
    });
    //历史委托（不传参数查询最近5条）
    api_mkt.tradeGopHistoryList(function(data) {
        if (data.status == 200) {
            console.log(data); 
            var html = [];
                for(var i=0; i<5;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal - data.data.list[i].numOver + "</td>");
                    html.push("<td>"+ data.data.list[i].numOver +"</td>");
                    html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("</tr>");
                    $(".tradeGopHistoryListTable").html("");  //添加前清空 
                    $(".tradeGopHistoryListTable").append(html.join(""));
                }       
        }else{
            console.log(data);
        }
    });
    //历史委托（带分页）
    $('.tradingfloorMore').click({
        'pageNo':1,
        'pageSize':10
    },function(){
        api_mkt.tradeGopHistoryList(function(data) {
            if (data.status == 200) {
                console.log(data);
                var html = [];
                for(var i=0; i<10;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal - data.data.list[i].numOver + "</td>");
                    html.push("<td>"+ data.data.list[i].numOver +"</td>");
                    html.push("<td><p class='saDan'>撒单</p></td>");
                    html.push("</tr>");
                    $(".tradeGopHistoryListTable").html("");  //添加前清空 
                    $(".tradeGopHistoryListTable").append(html.join(""));
                }                      
            }else{
                console.log(data);
            }
        });
    });


    // var flag = true;
    // $('.messagenum_area').on("click",function(){
    //     if(flag){
    //         flag = false;
    //         $(this).css("background-color","#ffffff");
    //         $(".popup_message_box").show("100");
    //         $(".messagenum_area em").css("color","#333333");
    //         $(".msg_num").css("color","#333333");
    //     } else {
    //         flag = true;
    //         $(this).css("background-color","#282828");
    //         $(".popup_message_box").hide("100");
    //         $(".messagenum_area em").css("color","#cccccc");
    //         $(".msg_num").css("color","#cccccc");
    //     }
    // });
    
    /*$(".buying_btn").on("click",function(){              //买入中的限价买入按钮
        $("#floor_bg").show();
        $("#floor_popDiv").fadeIn(500);
    });*/
    //定义变量判断 true 为 FIXED:限价，false MARKET:市价；
    var typeFixedOrMarket = true;
    var typeFixedOrMarketTwo = true;
    $("#buyin_limitedpricebtn").on("click",function(){
        //买入限价
        $(".buyin_limitprices_section").show();
        $(".buyin_marketprices_section").hide();
        $(this).addClass("border_bottom_on");
        $("#buyin_marketpricebtn").removeClass("border_bottom_on");
        typeFixedOrMarket = true;
    });
    $("#buyin_marketpricebtn").on("click",function(){
        //买入市价
        $(".buyin_limitprices_section").hide();
        $(".buyin_marketprices_section").show();
        $(this).addClass("border_bottom_on");
        $("#buyin_limitedpricebtn").removeClass("border_bottom_on");
        typeFixedOrMarket = false;
    });
    $("#sale_limitedpricebtn").on("click",function(){
        //卖出限价
        $(".sale_limitprices").show();
        $(".sale_marketprices").hide();
        $(this).addClass("border_bottom_on");
        $("#sale_marketpricebtn").removeClass("border_bottom_on");
        typeFixedOrMarketTwo = true;
    });
    $("#sale_marketpricebtn").on("click",function(){
        //卖出市价
        $(".sale_limitprices").hide();
        $(".sale_marketprices").show();
        $(this).addClass("border_bottom_on");
        $("#sale_limitedpricebtn").removeClass("border_bottom_on");
        typeFixedOrMarketTwo = false;
    });     

    //弹出框确认 关闭
    /*$(".sure_btn").on("click",function(){
        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
    });*/
    //买入 校验
    var flag = false;
    $('.buying_price').blur(function(){
        var price = $('.buying_price').val();
        if(isNaN(price) || !price){
            flag = false;
            $('.msgPrice').text('非数字');
        }else{
            flag = true;
            $('.msgPrice').text('');
        }
    });
    $('.buying_number').blur(function(){
        var number = $('.buying_number').val();
        if(isNaN(number) || !number){
            $('.msgNumber').text('非数字');
            flag = false;
        }else{
            flag = true;
            $('.msgNumber').text(''); 
            var num = parseInt($('.buying_price').val()) * parseInt($('.buying_number').val());
            $('.one').val('¥：'+ num +'.00'); 

            /*买入-限价 滑块数值*/
            $( "#amount" ).text(num+'%'); //限价除以总钱数
            $( "#red" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: num,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount" ).html( ui.value +  "%" );
                        $( ".buying_number" ).val( ui.value);
                  }
            });          
        }
    });

   //买入 市价 滑块
   $('.marketBuy').blur(function(){
        var marketBuy = $('.marketBuy').val();
        if(isNaN(marketBuy) || !marketBuy){
            $('.msgNumber').text('非数字');
            flag = false;
        }else{
            flag = true;
            $('.msgNumber').text(''); 
            var num = parseInt($('.marketBuy').val());
            $('.one').val('¥：'+ num +'.00'); 
            /*买入-限价 滑块数值*/
            $( "#amount1" ).text(num+'%'); //限价除以总钱数
            $( "#amount" ).text(num+'%'); //限价除以总钱数
            $( "#red1" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: num,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount1" ).html( ui.value +  "%" );
                        $( ".marketBuy" ).val( ui.value);
                  }
            });          
        }
    });
   //卖出 市价 滑块
   $('.sellAmount').blur(function(){
        var marketBuy = $('.sellAmount').val();
        if(isNaN(marketBuy) || !marketBuy){
            $('.msgNumber').text('非数字');
            flag = false;
        }else{
            flag = true;
            $('.msgNumber').text(''); 
            var num = parseInt($('.sellAmount').val());
            /*买入-限价 滑块数值*/
            $( "#amount3" ).text(num+'%'); //限价除以总钱数
            $( "#green1" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: num,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount3" ).html( ui.value +  "%" );
                        $( ".sellAmount" ).val( ui.value);
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
                $( ".buying_number" ).val( ui.value);
          }
    }); 

    /*卖出-限价 滑块初始化*/
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
                $( ".marketBuy" ).val( ui.value);
          }
    });
    /*买入-市价 滑块数值*/
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
                $( ".sellNumber" ).val( ui.value);
          }
    });
    /*卖出-市价 滑块数值*/
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
                $( ".sellAmount" ).val( ui.value);
          }
    });


    //卖出 校验
    $('.sellPrice').blur(function(){
        var price = $('.sellPrice').val();
        if(isNaN(price) || !price){
            $('.msgSellPrice').text('非数字');
            flag = false;
        }else{
            flag = true;
            $('.msgSellPrice').text('');
        }
    });
    $('.sellNumber').blur(function(){
        var number = $('.sellNumber').val();
        if(isNaN(number) || !number){
            $('.msgSellNumber').text('非数字');
            flag = false;
        }else{
            flag = true;
            $('.msgSellNumber').text(''); 
            var num = parseInt($('.sellPrice').val()) * parseInt($('.sellNumber').val());
            $('.two').val('¥：'+ num +'.00'); 
            /*买入-市价 滑块数值*/
            $( "#amount2" ).text(num+'%');
            $( " #green" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  slide: refreshSwatch,
                  change: refreshSwatch, 
                  value: num,
                  min: 0,
                  max: 100,
                  slide: function( event, ui ) {
                        $( "#amount2" ).html( ui.value +  "%" );
                        $( ".sellNumber" ).val( ui.value);
                  }
            });          
        }
    });
    /*$('.marketBuy').blur(function(){
        var marketBuy = $('.marketBuy').val();
        if(isNaN(marketBuy) || !marketBuy){
            $('.msgMarketBuy').text('非数字');
        }else{
            $('.msgMarketBuy').text('');
        }
    }); */   
    //买入 卖出 四个按钮 点击弹出框
    $(".buying_btn").click(function(){  
        if(flag == false){
            alert('请完整填写信息');
        }else{
            api_mkt.buyBefore({
                'price':$('.buying_price').val(),
                'number':$('.buying_number').val(),
                'type':'FIXED'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#floor_popDiv").fadeIn(500);               
                }else{
                    console.log(data);
                    alert('账户余额不足');
                }
            });                     
        }
    }); 
    $(".market_price_buying_btn").click(function(){  
        if(flag == false){
            alert('请完整填写信息');
        }else{
            api_mkt.buyBefore({
                'price':$('.marketBuy').val(),
                'type':'MARKET'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#floor_popDiv").fadeIn(500);               
                }else{
                    console.log(data);
                    alert('账户余额不足');
                }
            });        
        }
    });
    $(".sale_btn").click(function(){  
        if(flag == false){
            alert('请完整填写信息');
        }else{
            api_mkt.sellBefore({
                'price':$('.sellPrice').val(),
                'number':$('.sellNumber').val(),
                'type':'FIXED'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#floor_popDiv").fadeIn(500);               
                }else{
                    console.log(data);
                    alert('账户余额不足');
                }
            });            
        }
    }); 
    $(".market_price_sale_btn").click(function(){  
        if(flag == false){
            alert('请完整填写信息');
        }else{
            api_mkt.sellBefore({
                'number':$('.sellAmount').val(),
                'type':'MARKET'
            },function(data) {
                if (data.status == 200) {
                    console.log(data);
                    $("#floor_bg").show();
                    $("#floor_popDiv").fadeIn(500);               
                }else{
                    console.log(data);
                    alert('账户余额不足');
                }
            });            
        }
    });              


    $(".close_btn").on("click",function(){  //买入卖出 关闭按钮
        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
    });
    
    //单击弹出框 确认按钮判断   买入 > 限价 市价 判断
    $('.sure_btn').click(function(){

        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
        if(typeFixedOrMarket == true){
            api_mkt.buy({
                'price':$('.buying_price').val(),
                'number':$('.buying_number').val(),
                'type':'FIXED',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);               
                }else{
                    console.log(data);
                    alert('支付密码有误');
                }
            });
        }else{
            api_mkt.buy({
                'price':$('.marketBuy').val(),
                'type':'MARKET',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);               
                }else{
                    console.log(data);
                    alert('支付密码有误');
                }
            });
        }    
    });
    
    //单击弹出框 确认按钮判断   卖出 > 限价 市价 判断
    $('.sure_btn').click(function(){
        $("#floor_popDiv").hide();
        $("#floor_bg").hide();
        if(typeFixedOrMarketTwo == true){
            api_mkt.sell({
                'price':$('.sellPrice').val(),
                'number':$('.sellNumber').val(),
                'type':'FIXED',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);               
                }else{
                    console.log(data);
                    alert('支付密码有误');
                }
            });
        }else{
            api_mkt.sell({
                'number':$('.sellAmount').val(),
                'type':'MARKET',
                'paypwd':$('#sel_div_password').val()
            },function(data) {
                if (data.status == 200) {
                    console.log(data);               
                }else{
                    console.log(data);
                    alert('支付密码有误');
                }
            });
        }    
    });
    
    

});

require(['api_mkt', 'mkt_info', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info, mkt_trade) {
    //console.log(api_mkt);
    //console.log(mkt_info);
    
    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);
    

    mkt_info.get();
    mkt_trade.getfloor();

    var klineapply = function(data) {
        console.log("````````");
        console.log(data);
        console.log("````````");
        var ohlc = [];
        volume = [];
        dataLength = data.length;
        // set the allowed units for data grouping
        groupingUnits = [
            [
                '周', // unit name
                [1] // allowed multiples
            ],
            [
                '月', [1, 2, 3, 4, 6]
            ]
        ]
        var onem = data['1m'];
        var fivem = data['5m'];
        var fifteenm = data['15m'];
        var thirtym = data['30m'];
        var sixtym = data['60m'];
        var oned = data['1d'];
        // console.log(onem);
        // console.log(fivem);
        // console.log(fifteenm);
        // console.log(thirtym);
        // console.log(sixtym);
        // console.log(oned);
        var onemjson = JSON.parse(onem);
        var fivemjson = JSON.parse(fivem);
        var fifteenmjson = JSON.parse(fifteenm);
        var thirtymjson = JSON.parse(thirtym);
        var sixtymjson = JSON.parse(sixtym);
        var oned = JSON.parse(oned);
        // console.log(onemjson[0]);
        // console.log(fivemjson[0]);
        // console.log(fifteenmjson[0]);
        // console.log(thirtymjson[0]);
        // console.log(sixtymjson[0]);
        // console.log(oned[0]);
        var arraylist = [];
        //arraylist.push(onemjson[0]);
        //arraylist.push(fivemjson[0]);
        arraylist.push(fifteenmjson[0]);
        arraylist.push(thirtymjson[0]);
        arraylist.push(sixtymjson[0]);
        arraylist.push(oned[0]);
        console.log(arraylist);
        // for (var i = 0; i < arraylist.length; i++) {
        //     ohlc.push(arraylist[i]);
        //     volume.push(arraylist[i][3]);
        // }
        console.log(ohlc);
        console.log(volume);
        // for(var i=0;i<data.length;i++){
        //     ohlc.push([
        //         data[i][0], // the date
        //         data[i][1], // open
        //         data[i][2], // high
        //         data[i][3], // low
        //         data[i][4] // close
        //     ]);
        //     volume.push([
        //         data[i][0], // the date
        //         data[i][5] // the volume
        //     ]);
        // };
        //console.log(ohlc);
        //console.log(volume);
        $('#timeshare_container').highcharts('StockChart', {
            rangeSelector: {
                selected: 1,
                buttons: [{
                    type: 'minute',
                    count: 1,
                    text: '1分',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['minute', [1]]
                        ]
                    }
                }, {
                    type: 'minute',
                    count: 5,
                    text: '5分',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['minute', [1]]
                        ]
                    }
                }, {
                    type: 'minute',
                    count: 15,
                    text: '15分',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['minute', [1]]
                        ]
                    }
                }, {
                    type: 'minute',
                    count: 30,
                    text: '30分',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['minute', [1]]
                        ]
                    }
                }, {
                    type: 'minute',
                    count: 1,
                    text: '60分',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['minute', [1]]
                        ]
                    }
                }, {
                    type: 'day',
                    count: 1,
                    text: '天',
                    dataGrouping: {
                        forced: true,
                        units: [
                            ['day', [1]]
                        ]
                    }
                }],
                buttonTheme: {
                    width: 60
                }
            },
            credits: { enabled: false },
            exporting: {
                enabled: false
            },
            colors: ['#000000', '#0000ff', '#ff00ff', '#f7a35c', '#8085e9'],
            title: {
                text: '果仁市场K线图'
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                        // ,
                        // y: 0,
                        // formatter:function(){
                        // 	return this.value.toFixed(0);
                        // }
                },
                opposite: false,
                title: {
                    text: 'OHLCx'
                },
                height: '60%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volumex'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],
            tooltip: {
                formatter: function() {
                    var s = Highcharts.dateFormat('<span> %Y-%m-%d %H:%M:%S</span>', this.x);
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
            series: [{
                type: 'candlestick',
                name: 'AAPL',
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]
        });
        
        $('#deepmap_container').highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: '果仁市场深度图'
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function() {
                        return this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Nuclear weapon states'
                },
                labels: {
                    formatter: function() {
                        return this.value / 1000 + 'k';
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
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
                name: 'USA',
                data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                    1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                    27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                    26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                    24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                    22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                    10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104
                ]
            }, {
                name: 'USSR/Russia',
                data: [null, null, null, null, null, null, null, null, null, null,
                    5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                    4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                    15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                    33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                    35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                    21000, 20000, 19000, 18000, 18000, 17000, 16000
                ]
            }]
        });

    }
    api_mkt.homepage_tradingfloor_kline(function(data) {
        klineapply(data);
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
        $(".sale_limitprices").hide();
        $(".sale_marketprices").show();
        $(this).addClass("border_bottom_on");
        $("#sale_limitedpricebtn").removeClass("border_bottom_on");
    });

    $(".leftchart").on("click",function(){
        //分时图
        $("#timeshare_container").show();
        $("#deepmap_container").hide();
        $(this).addClass("leftright_bottomon");
        $(".rightchart").removeClass("leftright_bottomon");
    });

    $(".rightchart").on("click",function(){
        //深度图
        $("#timeshare_container").hide();
        $("#deepmap_container").show();
        $(this).addClass("leftright_bottomon");
        $(".leftchart").removeClass("leftright_bottomon");
    });

    $(".buying_btn").on("click",function(){              //买入中的限价买入按钮
        $("#bg").show();
        $("#popDiv").fadeIn(500);
    });
    $(".market_price_buying_btn").on("click",function(){ //买入中的市价买入按钮
        $("#bg").show();
        $("#popDiv").fadeIn(500);
    });
    $(".sale_btn").on("click",function(){               //卖出中的限价买入按钮
        $("#bg").show();
        $("#popDiv").fadeIn(500);
    });
    $(".market_price_sale_btn").on("click",function(){  //卖出中的市价买入按钮
        $("#bg").show();
        $("#popDiv").fadeIn(500);
    });


    $(".sure_btn").on("click",function(){
        $("#popDiv").hide();
        $("#bg").hide();
    });

    $(".close_btn").on("click",function(){  //买入卖出 关闭按钮
        $("#popDiv").hide();
        $("#bg").hide();
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
    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#cccccc");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#333333");
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
    
});

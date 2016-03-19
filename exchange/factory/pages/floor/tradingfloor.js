require(['api_mkt', 'mkt_info', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info, mkt_trade) {
    //console.log(api_mkt);
    //console.log(mkt_info);
    mkt_info.get();
    mkt_trade.getfloor();

    var klineapply = function(data) {
        console.log(data);
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
        for (var i = 0; i < arraylist.length; i++) {
            ohlc.push(arraylist[i]);
            volume.push(arraylist[i][3]);
        }
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
        $('#container').highcharts('StockChart', {
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
    }
    api_mkt.homepagekline(function(data) {
        klineapply(data);
    });

    $("#buyin_limitedpricebtn").on("click",function(){
        //限价
        alert("xianjia")
    });
    $("#buyin_marketpricebtn").on("click",function(){
        //市价
        alert("shijia")
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
});

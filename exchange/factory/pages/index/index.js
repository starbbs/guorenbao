require(['api_mkt', 'mkt_info', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info, mkt_trade) {
    mkt_info.get();
    mkt_trade.get();
    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
    var ohlc = [];
    var volume = [];
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
    var on_page_load = false;
    var onem;
    var fivem;
    var fifteenm;
    var thirtym;
    var sixtym;
    var oned;
    var klineapply = function(data) {
        console.log("..........")
        console.log(data);
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
                //volume.push([onem[i][0], onem[i][1]]);
            }
        } else if (whichday == "five") {
            for (var i = 0; i < fivem.length; i++) {
                ohlc.push([fivem[i][0], fivem[i][2], fivem[i][3], fivem[i][4], fivem[i][5]]);
                //volume.push([fivem[i][0], fivem[i][1]]);
            }
        } else if (whichday == "fivteen") {
            for (var i = 0; i < fifteenm.length; i++) {
                ohlc.push([fifteenm[i][0], fifteenm[i][2], fifteenm[i][3], fifteenm[i][4], fifteenm[i][5]]);
                //volume.push([fifteenm[i][0], fifteenm[i][1]]);
            }
        } else if (whichday == "thirty") {
            for (var i = 0; i < thirtym.length; i++) {
                ohlc.push([thirtym[i][0], thirtym[i][2], thirtym[i][3], thirtym[i][4], thirtym[i][5]]);
                //volume.push([thirtym[i][0], thirtym[i][1]]);
            }
        } else if (whichday == "sixty") {
            for (var i = 0; i < sixtym.length; i++) {
                ohlc.push([sixtym[i][0], sixtym[i][2], sixtym[i][3], sixtym[i][4], sixtym[i][5]]);
                console.log(sixtym[i][1]);
                //volume.push([sixtym[i][0], sixtym[i][1]]);
            }
        } else if (whichday == "oneday") {
            for (var i = 0; i < oned.length; i++) {
                ohlc.push([oned[i][0], oned[i][2], oned[i][3], oned[i][4], oned[i][5]]);
                //volume.push([oned[i][0], oned[i][1]]);
            }
        }
        //console.log(ohlc);
        //console.log(volume);
        $('#container').highcharts('StockChart', {
            rangeSelector: {buttons: [{type: 'minute', count: 60, text: '1h'},{type: 'minute', count: 120, text: '2h'},{type: 'minute', count: 360, text: '6h'},{type: 'minute', count: 720, text: '12h'},{type: 'day', count: 1, text: '1d'},{type: 'week', count: 1, text: '1w'},{type: 'all', text: '所有'}],selected:2, inputEnabled:false},
            global: {
                useUTC: true
            },
            lang: {
                rangeSelectorZoom: '',
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
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
                { labels: { style: { color: '#e55600' } }, title: { text: '价格 [RMB]', style: { color: '#e55600' } }, height: 160, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true },
                { labels: { style: { color: '#4572A7' } }, title: { text: '成交量 [GOP]', style: { color: '#4572A7' } }, offset: 0, top: 280, height: 34, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true }
            ],
            /*tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },*/
            tooltip: {
                formatter: function() {
                    // console.log(this.points[0]);
                    // console.log(this.points[0].point)
                    var s = Highcharts.dateFormat('<span> %Y-%m-%d %H:%M:%S</span>', this.x);
                    s += "成交数量"+this.points[0].total;
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
                { animation: false, name: '成交量 [GOP]', type: 'column', color: '#4572A7', dataGrouping: { units: groupingUnits, enabled: false }, yAxis: 1, data: volume },
                { animation: false, name: '价格 [RMB]', type: 'candlestick', dataGrouping: { units: groupingUnits, enabled: false }, data: ohlc }
            ]
        });
    }

    $(".close_btn").on("click",function(){
        $(".popDiv").hide();
        $(".bg").hide();
    });

    $(".timebar").on("click", function() {
        console.log("timebar");
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
    
    api_mkt.homepagekline(function(data) {
        klineapply(data);
    });
    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#333333");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#cccccc");
        }
    });

    var isSubmit = function() {
        var objArr = $(".main input");
        var obj = "";
        var verEnd = "";
        for (var i = 0, l = objArr.length; i < l; i++) {
            obj = $(objArr[i]);
            if (obj.val() || i === l - 1) {
                //薪资字段为选填字段
                if (i === l - 1 && !obj.val()) {
                    return true;
                }
                verEnd = verify(obj.val(), obj.attr("id"));
                if (verEnd === true) {
                    if (i === l - 1) {
                        return true;
                    }
                } else {
                    showWarnWin(verEnd, 1000);
                    return false;
                }

            } else {
                showWarnWin("请输入" + obj.attr("placeholder"), 1000);
                return false;
            }
        }
    };
    /**
     * 输入字段校验
     * [verify description]
     * @param  {[String]} inputData [输入数据]
     * @param  {[String]} dataType  [数据类型]
     * @return {[boolean or String]}[验证结果]
     */
    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };
    /**
     * 去掉字符串前后的空格
     * [trim description]
     * @return {[type]} [description]
     */
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };

    // api_mkt.pollinfo(function(data) {
    //     callback && callback(data);
    // });
    
    
});

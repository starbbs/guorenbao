require(['api_mkt', 'mkt_info','decimal', 'mkt_pagehead', 'cookie'], function(api_mkt, mkt_info,decimal) {
    $('.rmbxh').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbtx').removeClass('bottomon');
        $('.recharge').show();
        $('.withdraw_deposit').hide();
    });
    $('.rmbtx').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbxh').removeClass('bottomon');
        $('.recharge').hide();
        $('.withdraw_deposit').show();
    });

    //果仁(提现)转出记录_
    api_mkt.transferOutHistory({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            var html = [];
            var num = data.data.list.length < 10?data.data.list.length:10;
            for(var i=0; i<num;i++){
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].wallet + "</td>");
                html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                html.push("</tr>");
                $(".guorenOutput").html(""); //添加前清空 
                $(".guorenOutput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");          
                $(".status").filter(":contains('FAILURE')").text('失败').css("color", "#999");
            
            }
        } else {
            
        }
    });

    //果仁(充值)转出记录_只查询成功记录
    api_mkt.transferInHistory({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            var html = [];
            var num = data.data.list.length < 10?data.data.list.length:10;
            for(var i=0; i<num;i++){
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].wallet + "</td>");
                html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                html.push("</tr>");
                $(".guorenInput").html(""); //添加前清空 
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");

            }
        } else {
            
        }
    });

    //接受跳转参数
    $(function(){
        function getQueryString(name) {
            href = decodeURIComponent(location.href);
            // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
            if (href.indexOf("?") == -1
                    || href.indexOf(name + '=') == -1) {
                return '';
            }
            // 获取链接中参数部分
            var queryString = href.substring(href.indexOf("?") + 1);
            // 分离参数对 ?key=value&key2=value2
            var parameters = queryString.split("&");
            var pos, paraName, paraValue;
            for ( var i = 0; i < parameters.length; i++) {
                // 获取等号位置
                pos = parameters[i].indexOf('=');
                if (pos == -1) {
                    continue;
                }
                // 获取name 和 value
                paraName = parameters[i].substring(0, pos);
                paraValue = parameters[i].substring(pos + 1);
                // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
                if (paraName == name) {
                    return unescape(paraValue.replace(/\+/g, " "));
                }
            }
            return '';
        };

        var b = getQueryString("id");
        //console.log(b);
        if(b){
            $('.rmbtx').addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        }
        
    })
            
});

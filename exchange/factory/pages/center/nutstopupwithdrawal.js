require(['api_mkt','mkt_info','mkt_pagehead','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
    //mkt_pagehead.get();
    $('.rmbxh').on('click',function(){
        $(this).addClass('bottomon');
        $('.rmbtx').removeClass('bottomon');
        $('.recharge').show();
        $('.withdraw_deposit').hide();
    });
    $('.rmbtx').on('click',function(){
        $(this).addClass('bottomon');
        $('.rmbxh').removeClass('bottomon');
        $('.recharge').hide();
        $('.withdraw_deposit').show();
    });    
    //点击进入tab的指定位置
    $('#addNewAd').click(function(){
        location.href="withdraw.html?a=cws";
    }); 

    //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -开始
    $(".status-guorenInput").filter(":contains('进行中')").css("color","orange");

    $(".status-guorenOutput").filter(":contains('进行中')").css("color","orange");
    //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -结束
    
    //果仁充值 
    /*$.ajax({
        url: "http://127.0.0.1/1.json",
        type:"post",
        dataType: "json",
        cache: false,
        success:function(data){
            var PageNum = 0; //0当前为第一页
            var html = [];
            for(var i=0; i<5;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[PageNum+i].createDate +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].address +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].amount +"</td>");
                html.push("<td class='status-guorenInput'>"+ data.data.list[PageNum+i].status +"</td>");
                html.push("</tr>");
                $(".guorenInput").html("");  //添加前清空 
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status-guorenInput").filter(":contains('进行中')").css("color","orange");
            }
        },
        error:function(err){
            console.log('财务中心-果仁充值表格，加载失败。');
        }
    });

    //果仁充值历史
    $.ajax({
        url: "http://127.0.0.1/1.json",
        type:"post",
        dataType: "json",
        cache: false,
        success:function(data){
            var PageNum = 0; //0当前为第一页
            var html = [];
            for(var i=0; i<5;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[PageNum+i].createDate +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].address +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].amount +"</td>");
                html.push("<td class='status-guorenInput'>"+ data.data.list[PageNum+i].status +"</td>");
                html.push("</tr>");
                $(".guorenInput").html("");  //添加前清空 
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status-guorenInput").filter(":contains('进行中')").css("color","orange");
            }
        },
        error:function(err){
            console.log('财务中心-果仁充值表格，加载失败。');
        }
    });

    //果仁提现
    $.ajax({
        url: "http://127.0.0.1/1.json",
        type:"post",
        dataType: "json",
        cache: false,
        success:function(data){
            var PageNum = 0; //0当前为第一页
            var html = [];
            for(var i=0; i<5;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[PageNum+i].createDate +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].address +"</td>");
                html.push("<td>"+ data.data.list[PageNum+i].amount +"</td>");
                html.push("<td class='status-guorenOutput'>"+ data.data.list[PageNum+i].status +"</td>");
                html.push("</tr>");
                $(".guorenOutput").html("");  //添加前清空 
                $(".guorenOutput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status-guorenOutput").filter(":contains('进行中')").css("color","orange");
            }
        },
        error:function(err){
            console.log('财务中心-果仁提现表格，加载失败。');
        }
    });*/
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

        var b = getQueryString("formindex");
        //console.log(b);
        if(b){
            $('.rmbtx').addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        }
        
    })

	
});
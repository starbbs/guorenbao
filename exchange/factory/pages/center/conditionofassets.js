require(['api_mkt', 'mkt_info', 'cookie'], function(api_mkt, mkt_info, mkt_pagehead) {
    //console.log(api_mkt);
    //console.log(mkt_info);
    //mkt_info.get();    

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

    //接口9 账户明细（不传参数查询最近5条）
    api_mkt.billList(function(data) {
        if (data.status == 200) {
            if(data.data){
                var dlist = data.data.list;
                if(dlist.length!=0){
                    console.log(data);
                    console.log(data.data.list[0].createDate);
                    var html = [];
                    var num = data.data.list.length >5 ? 5:data.data.list.length
                    for (var i = 0; i < num; i++) {
                        html.push("<tr>");
                        html.push("<td>" + data.data.list[i].createDate + "</td>");
                        html.push("<td class='operType'>" + data.data.list[i].operType + "</td>");
                        html.push("<td>" + data.data.list[i].cnyNumber + "</td>");
                        html.push("<td>" + data.data.list[i].cnyBalance + "</td>");
                        html.push("<td>" + data.data.list[i].gopNumber + "</td>");
                        html.push("<td>" + data.data.list[i].gopBalance + "</td>");
                        html.push("</tr>");
                        $(".aside-table-tbody").html(""); //添加前清空 
                        $(".aside-table-tbody").append(html.join(""));

                        //过滤内容显示不同颜色
                        $(".operType").filter(":contains('买入')").css("color", "red");
                        $(".operType").filter(":contains('卖出')").css("color", "green");
                    }
                }
            }            
        } else {
            console.log('财务中心-资产状况-账户明细表格，加载失败。');
        }
    });

    //接口10 账户明细（带分页）
    $('.moreCheck').click(function() {
        api_mkt.billListPage({
            'pageNo': 1,
            'pageSize': 10
        }, function(data) {
            if (data.status == 200) {
                console.log(data);
                var PageNum = 0; //0当前为第一页                    
                var html = [];
                for (var i = 0; i < 10; i++) {
                    html.push("<tr>");
                    html.push("<td>" + data.data.list[i].createDate + "</td>");
                    html.push("<td class='operType'>" + data.data.list[i].operType + "</td>");
                    html.push("<td>" + data.data.list[i].cnyNumber + "</td>");
                    html.push("<td>" + data.data.list[i].cnyBalance + "</td>");
                    html.push("<td>" + data.data.list[i].gopNumber + "</td>");
                    html.push("<td>" + data.data.list[i].gopBalance + "</td>");
                    html.push("</tr>");
                    $(".new").html(""); //添加前清空 
                    $(".new").append(html.join(""));

                    //过滤内容显示不同颜色
                    $(".operType").filter(":contains('买入')").css("color", "red");
                    $(".operType").filter(":contains('卖出')").css("color", "green");
                }
            } else {
                console.log('财务中心-资产状况-账户明细表格(带分页)，加载失败。');
            }
        });
    });
    //总资产
    api_mkt.getTotalAssets(function(data) {        
        if (data.status == 200) {
            console.log(data);
            $('#total_assets').text(data.data.cnyBalance);
            $('.cnyBalance').text(data.data.cnyBalance);
            $('.gopLock').text(data.data.gopLock);
            $('.cnyLock').text(data.data.cnyLock);
            $('.gopBalance').text(data.data.gopBalance);
            //$.cookie('allCNY',$('.cnyBalance').text());
            //$.cookie('gop',$('.gopBalance').text());
        } else {
            console.log(data.msg);
        }
    });


});

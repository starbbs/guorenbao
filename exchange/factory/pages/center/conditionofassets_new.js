require(['api_mkt', 'mkt_info','decimal', 'cookie'], function(api_mkt, mkt_info,decimal, mkt_pagehead) {

    //接口9 账户明细（分页）
    api_mkt.billList({
        'pageNo':1,
        'pageSize':10
    },function(data) {
        if (data.status == 200 && data.data && data.data.list.length!=0){
            var html = [];
            var num = data.data.list.length <10 ? data.data.list.length:10;
            for (var i = 0; i < num; i++) {
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td class='operType'>" + data.data.list[i].operType + "</td>");
                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].cnyNumber) + "</td>");
                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].cnyBalance) + "</td>");
                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].gopNumber) + "</td>");
                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].gopBalance) + "</td>");
                html.push("</tr>");
                $(".aside-table-tbody").html(""); //添加前清空 
                $(".aside-table-tbody").append(html.join(""));

                //过滤内容显示不同颜色
                $(".operType").filter(":contains('CNYIN')").text('人民币充值');
                $(".operType").filter(":contains('CNYOUT')").text('人民币提现');
                $(".operType").filter(":contains('GOPIN')").text('果仁充值');
                $(".operType").filter(":contains('GOPOUT')").text('果仁提现');
                $(".operType").filter(":contains('BUY')").text('买入').css("color", "red");
                $(".operType").filter(":contains('SELL')").text('卖出').css("color", "green");
                $("td").filter(":contains('undefined')").text('0');
            }           
        } else {
            //console.log('财务中心-资产状况-账户明细表格，加载失败。');
        }
    }); 

});

require(['api_mkt', 'mkt_info','decimal','cookie'], function(api_mkt, mkt_info,decimal,cookie) { 

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
                    var html = [];
                    var num = data.data.list.length >5 ? 5:data.data.list.length
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
                }
            }            
        } else {
            //console.log('财务中心-资产状况-账户明细表格，加载失败。');
        }
    });
        
    


    //总资产
    api_mkt.getTotalAssets(function(data) {        
        if (data.status == 200) {
            var gopBalance = data.data.gopBalance;  //剩余果仁数
            var cnyBalance = data.data.cnyBalance;  //剩余人民币数
            var gopLock = data.data.gopLock;  //冻结果仁数
            var cnyLock = data.data.cnyLock;  //冻结人民币数
            var totalAssets = data.data.cnyBalance + data.data.cnyLock;
            var totalNuts = data.data.gopBalance + data.data.gopLock;
            var totalvalue = totalNuts*$('#thelatestprice').html()+totalAssets;
            //console.log("decimal.getTwoPs"+String(myfunc(cnyLock)));
            // console.log(decimal.getTwoPs());
            $('#total_assets').text(decimal.getTwoPs(totalvalue));
            $('.cnyBalance').text(decimal.getTwoPs(cnyBalance));
            $('.gopLock').text(decimal.getTwoPs(gopLock));
            // console.log("casdfasdfasd"+cnyLock);
            //console.log("decimal.getTwoPs"+decimal.getTwoPs(cnyLock));
            $('.cnyLock').text(decimal.getTwoPs(cnyLock));
            $('.gopBalance').text(decimal.getTwoPs(gopBalance));
        } else {
            console.log(data.msg);
        }
    });
    
    //hover 效果
    $('.ls_tab').hover(function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fafafa');
        }
    },function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fff');
        }
    });

});

    
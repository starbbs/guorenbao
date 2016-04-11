require(['api_mkt', 'mkt_info', 'mkt_trade','decimal', 'cookie'], function(api_mkt, mkt_info, mkt_trade,decimal) {
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
   
    //当前委托（带分页）
    api_mkt.tradeGopCurrentList({
        'pageNo':1,
        'pageSize':10
    },function(data) {
        if (data.status == 200) {
            console.log(data); 
            var html = [];
            var num = data.data.list.length < 10?data.data.list.length:10;
            for(var i=0; i<num;i++){
                html.push("<tr>");                                        
                html.push("<td>"+ data.data.list[i].createDate +"</td>");                
                html.push("<td class='id' style='display:none'>"+ data.data.list[i].id +"</td>");
                html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                html.push("<td class='tradeGopFlag' style='display:none'>"+ data.data.list[i].tradeGopFlag +"</td>");                    
                html.push("<td class='price'>"+ data.data.list[i].price +"</td>");
                html.push("<td class='numTotal'>"+ data.data.list[i].numTotal +"</td>");
                html.push("<td>"+ (data.data.list[i].numTotal - data.data.list[i].numOver).toFixed(2) + "</td>");
                html.push("<td>"+ data.data.list[i].numOver +"</td>");
                html.push("<td><p class='saDan'>撤单</p></td>");
                html.push("</tr>");
                $(".tradeGopCurrentListTable").html("");  //添加前清空 
                $(".tradeGopCurrentListTable").append(html.join(""));

                //过滤内容显示不同颜色
                $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green"); 
            }                            
        }else{
            console.log(data);
        }
    });
    
    //历史委托（带分页）
        api_mkt.tradeGopHistoryList({
            'pageNo':1,
            'pageSize':10
        },function(data) {
            if (data.status == 200) {
                console.log(data);
                var html = [];
                var num = data.data.list.length < 10?data.data.list.length:10;
                for(var i=0; i<num;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td>"+ data.data.list[i].price +"</td>");
                    html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                    html.push("<td>"+ (data.data.list[i].totalTraded / data.data.list[i].numTotal).toFixed(2) + "</td>");
                    html.push("<td>"+ data.data.list[i].numOver +"</td>");
                    html.push("<td>"+ data.data.list[i].totalTraded +"</td>");
                    html.push("<td class='tradeGopStatus'>"+ data.data.list[i].tradeGopStatus +"</td>");
                    html.push("</tr>");
                    $(".tradeGopHistoryListTable").html("");  //添加前清空 
                    $(".tradeGopHistoryListTable").append(html.join(""));

                    //过滤内容显示不同颜色
                    $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                    $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");
                    $(".tradeGopStatus").filter(":contains('SUCCESS')").text('已成交').css("color","orange");                    
                    $(".tradeGopStatus").filter(":contains('CANCEL')").text('已撤销').css("color","#999"); 
                }                      
            }else{
                console.log(data);
            }
        });

});

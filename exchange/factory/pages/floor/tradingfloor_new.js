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
   //当前委托（不传参数查询最近5条）
    api_mkt.tradeGopCurrentList(function(data) {
        if (data.status == 200 && data.data.list.length >0) {
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
                html.push("<td>"+ (data.data.list[i].numTotal - data.data.list[i].numOver) + "</td>");
                html.push("<td>"+ data.data.list[i].numOver +"</td>");
                html.push("<td><p class='saDan'>撤单</p></td>");
                html.push("</tr>");
                $(".tradeGopCurrentListTable").html("");  //添加前清空 
                $(".tradeGopCurrentListTable").append(html.join(""));  
                //过滤内容显示不同颜色
                $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");  
                //撤单
                $('.saDan').click(function(){                    
                    var text = $(this).parent().parent().find('.id').text();
                    $("#floor_bg").show();
                    $("#sel_div_password").val("");
                    $(".payment_error").hide();
                    $("#floor_popDiv").fadeIn(500);
                    //变为 撤单 确认框
                    $('.h3_1').css('display','none');
                    $('.sure_btn').css('display','none');
                    $('#sel_div_password').css('display','none');
                    $('.h3_2').css('display','block');
                    $('.sure_btn1').css('display','block');
                
                    //确认撤单
                    $('.confirm').click(function(){                        
                        api_mkt.tradeGopCancelByid({
                            'id':text
                        },function(data) {        
                            
                        });
                        //恢复为 买入卖出 确认框
                        $("#floor_popDiv").hide(500);
                        $("#floor_bg").hide();
                        $('.h3_1').css('display','block');
                        $('.sure_btn').css('display','block');
                        $('#sel_div_password').css('display','block');
                        $('.h3_2').css('display','none');
                        $('.sure_btn1').css('display','none');
                        window.location.reload();
                    }); 
                    //取消撤单
                    $('.cancle').click(function(){
                        $("#floor_bg").hide();
                        $("#floor_popDiv").hide(500);
                        //恢复为 买入卖出 确认框
                        $("#floor_popDiv").hide(500);
                        $("#floor_bg").hide();
                        $('.h3_1').css('display','block');
                        $('.sure_btn').css('display','block');
                        $('#sel_div_password').css('display','block');
                        $('.h3_2').css('display','none');
                        $('.sure_btn1').css('display','none');
                    }); 
                });             
            }               
        }else{
            //console.log(data);
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

            var b = getQueryString("whichtab");
            //console.log(b);
            if(b){
                $(".table2").show();
                $(".table1").hide();
                $(".left").removeClass("bottomon");
                $(".right").addClass("bottomon");
            }
            
        })

});

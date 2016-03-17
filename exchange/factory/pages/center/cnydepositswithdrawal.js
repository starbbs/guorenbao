/*require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	mkt_info.get();
	
});*/

$(function(){

		$(function(){
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
        });

        var flag = true;
        $('.messagenum_area').on("click",function(){
            if(flag){
                flag = false;
                $(this).css("background-color","#ffffff");
                $(".popup_message_box").show("100");
                $(".messagenum_area em").css("color","#333333");
                $(".msg_num").css("color","#333333");
            } else {
                flag = true;
                $(this).css("background-color","#282828");
                $(".popup_message_box").hide("100");
                $(".messagenum_area em").css("color","#cccccc");
                $(".msg_num").css("color","#cccccc");
            }
        });

        //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -开始
        $(".status").filter(":contains('进行中')").css("color","orange");
        $(".status").filter(":contains('已完成')").css("color","#ccc");

        $(".cnyWithdrawals").filter(":contains('进行中')").css("color","orange");        
        //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -结束
        
        //人民币充值
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
                    html.push("<td>"+ data.data.list[PageNum+i].updateDate +"</td>");
                    html.push("<td>"+ data.data.list[PageNum+i].bank +"</td>");
                    html.push("<td>"+ data.data.list[PageNum+i].money +"</td>");
                    html.push("<td class='status'>"+ data.data.list[PageNum+i].status +"</td>");
                    html.push("<td class='checkDeal'>查看此笔充值单</td>");
                    html.push("</tr>");
                    $(".cnyInput").html("");  //添加前清空 
                    $(".cnyInput").append(html.join(""));

                    //过滤内容显示不同颜色
                    $(".status").filter(":contains('进行中')").css("color","orange");
        			$(".status").filter(":contains('已完成')").css("color","#ccc");
                }
            },
            error:function(err){
                console.log('财务中心-人民币充值历史表格，加载失败。');
            }
        });

        //人民币提现
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
                    html.push("<td>"+ data.data.list[PageNum+i].updateDate +"</td>");
                    html.push("<td>"+ data.data.list[PageNum+i].bank +"</td>");
                    html.push("<td>"+ data.data.list[PageNum+i].pay +"</td>");
                    html.push("<td>"+ data.data.list[PageNum+i].money-pay +"</td>");
                    html.push("<td class='cnyWithdrawals'>"+ data.data.list[PageNum+i].status+ "</td>");
                    html.push("</tr>");
                    $(".cnyOutput").html("");  //添加前清空 
                    $(".cnyOutput").append(html.join(""));

                    //过滤内容显示不同颜色
                    $(".cnyWithdrawals").filter(":contains('进行中')").css("color","orange"); 
                }
            },
            error:function(err){
                console.log('财务中心-人民币提现历史表格，加载失败。');
            }
        });
    });
//require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
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

        //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -开始
        $(".status-guorenInput").filter(":contains('进行中')").css("color","orange");

        $(".status-guorenOutput").filter(":contains('进行中')").css("color","orange");
        //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -结束
        
        //果仁充值
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
        });

    });

	
//});
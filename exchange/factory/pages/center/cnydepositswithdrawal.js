require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	
        
	
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
        
        //接口 人民币充值历史（查询最近5条）
        api_mkt.rmbRechargeHistory({
            'pageNo':1,
            'pageSize':5
        },function(data) {
            alert(data.msg);
            if (data.status == 200) {
                console.log(data);
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
            }else{
                console.log('财务中心-人民币充值历史表格，加载失败。');
            }
        });

        //接口 人民币充值历史（带分页）
        $(".moreCheck").click(function(){
            api_mkt.rmbRechargeHistory({
                'pageNo':1,
                'pageSize':10
            },function(data) {
                alert(data.msg);
                if (data.status == 200) {
                    console.log(data);
                    var html = [];
                    for(var i=0; i<10;i++){
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
                }else{
                    console.log('财务中心-人民币充值历史表格，加载失败。');
                }
            });
        });
        //接口 人民币充提现（查询最近5条）
        api_mkt.rmbWithdrawalsHistory({
            'pageNo':1,
            'pageSize':5
        },function(data) {
            alert(data.msg);
            if (data.status == 200) {
                console.log(data);
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
            }else {
                console.log('财务中心-人民币提现历史表格带分页，加载失败。');
            }
        });

        //接口 人民币充提现（带分页）
        $(".moreCheck").click(function(){
            api_mkt.rmbWithdrawalsHistory({
                'pageNo':1,
                'pageSize':5
            },function(data) {
                alert(data.msg);
                if (data.status == 200) {
                    console.log(data);
                    var html = [];
                    for(var i=0; i<10;i++){
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
                }else {
                    console.log('财务中心-人民币提现历史表格带分页，加载失败。');
                }
            });
        });

        //实名认证用户充值-显示/隐藏-提示文本内容
        $(".accountholder_tip").hover(function(){
            $(".tipscontent").toggle();
        });

        //生成汇款单校验
        //开户人姓名校验
        var btnConfrim;
        $("#bank-username").blur(function(){
            var username = $("#bank-username").val();
            if(!username){
                btnConfrim = false;
                $('.msg-bank-username').show().text('请输入正确开户人姓名');
            }else{
                $('.msg-bank-username').hide();
                btnConfrim = true;
            }
        });
        //充值金额校验
        $("#bank-money").blur(function(){
            var bankmoney = $("#bank-money").val();
            if(!bankmoney || isNaN(bankmoney)){
                btnConfrim = false;
                $('.msg-bank-money').show().text('请输入正确的整数金额');
            }else{
                $('.msg-bank-money').hide();
                btnConfrim = true;
            }
        });
        //银行账号校验
        $("#bank-idcard").blur(function(){
            var bankIdcard = $("#bank-idcard").val();
            if(!bankIdcard || isNaN(bankIdcard)){
                btnConfrim = false;
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else{
                $('.msg-bank-idcard').hide();
                btnConfrim = true;
            }
        });
        //银行账号校验
        $("#bank").blur(function(){
            var bank = $("#bank").val();
            var reg = /^[\u4E00-\u9FA5]+$/;   
            if(!bank || !reg.exec(bank)){
                btnConfrim = false;
                $('.msg-bank').show().text('请输入所属银行');
            }else{
                $('.msg-bank').hide();
                btnConfrim = true;
            }
        });
        //手机号校验
        $("#phone").blur(function(){
            var phone = $("#phone").val();
            var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if(!reg.test(phone) || !phone){  
                btnConfrim = false;
                $('.msg-phone').show().text('请输入手机号码');
            }else{
                $('.msg-phone').hide();
                btnConfrim = true;
            }
        });

        //生成汇款单里的填充文本        
        $(".build_remit_btn").click(function(){
            if(btnConfrim == false || typeof(btnConfrim) == 'undefined'){
                alert('请完成填写相关信息！');
            }else{
                //打开弹出层-生成汇款单
                $(".mydiv").css("display","block");
                $(".bg").css("display","block");               
                
                $(".remittance-id").text(Math.random()*10E16);
                $(".bank-card-new").text($("#bank-idcard").val());
                $(".bank-name-new").text($("#bank").val());
                $(".account-name-new").text($("#username").val());
                $(".money-new").text($("#bank-money").val());

                //关闭弹出层 -生成汇款单
                $(".span-text").click(function(){
                    $(".mydiv").css("display","none");
                    $(".bg").css("display","none");
                });  
                /*$(".remittance-note-number").text();*/           
            }           
            
            
        });
        
});
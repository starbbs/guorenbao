require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {

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

        //接口 人民币充值历史（查询最近5条）
        api_mkt.rmbRechargeHistory({
                'pageNo':1,
                'pageSize':10
            },function(data) {
                //alert(data.msg);
                if (data.status == 200) {
                    var html = [];
                    var num = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<num;i++){
                        html.push("<tr>");                                        
                        html.push("<td>"+ data.data.list[i].updateDate +"</td>");
                        html.push("<td class='bank'>"+ data.data.list[i].bank +"</td>");
                        html.push("<td class='money'>"+ data.data.list[i].money +"</td>");                    
                        html.push("<td style='display:none' class='txid'>"+ data.data.list[i].txid +"</td>");
                        html.push("<td style='display:none' class='name'>"+ data.data.list[i].name +"</td>");  
                        html.push("<td style='display:none' class='uid'>"+ data.data.list[i].uid +"</td>");                   
                        html.push("<td style='display:none' class='acnumber'>"+ data.data.list[i].acnumber +"</td>");
                        html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("<td class='checkDeal'>查看此笔充值单</td>");
                        html.push("</tr>");
                        $(".cnyInput").html("");  //添加前清空 
                        $(".cnyInput").append(html.join(""));

                        //过滤内容显示不同颜色
                        $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");                    
                        $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc");                                      
                        $(".status").filter(":contains('CLOSED')").text('已关闭').css("color","#ccc");
                        //查看此笔充值单
                        $('.checkDeal').click(function(){
                            //打开弹出层-生成汇款单
                            $(".mydiv").css("display","block");
                            $(".bg").css("display","block");               
                            $(".remittance-id").text($(this).parent().find('.txid').text());
                            $(".bank-card-new").text($(this).parent().find('.acnumber').text());
                            $(".bank-name-new").text($(this).parent().find('.bank').text());
                            $(".account-name-new").text($(this).parent().find('.name').text());
                            $(".money-new").text($(this).parent().find('.money').text()+'.00');                
                            $(".remittance-note-numbe-newr").text($(this).parent().find('.uid').text());
                            //关闭弹出层 -生成汇款单
                            $(".span-text").click(function(){
                                $(".mydiv").css("display","none");
                                $(".bg").css("display","none");
                            });  
                        });
                    }
                }else{
                    //console.log('财务中心-人民币充值历史表格，加载失败。');
                }
            });
            //人民币提现 带分页
            api_mkt.rmbWithdrawalsHistory({
                'pageNo':1,
                'pageSize':10
            },function(data) {
                if (data.status == 200 && data.data.list.length > 0) {
                    //console.log(data);
                    var html = [];
                    var num = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<num;i++){
                        html.push("<tr>");                                        
                        html.push("<td>"+ data.data.list[i].updateDate +"</td>");
                        html.push("<td>"+ data.data.list[i].bank +"</td>");
                        html.push("<td>"+ data.data.list[i].pay +"</td>");                    
                        html.push("<td>"+ data.data.list[i].fee +"</td>");
                        html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("</tr>");
                        $(".cnyOutput").html("");  //添加前清空 
                        $(".cnyOutput").append(html.join(""));

                        //过滤内容显示不同颜色
                        $(".status").filter(":contains('WAIT')").text('等待');
                        $(".status").filter(":contains('PROCESSING')").text('进行中').css("color","orange");
                        $(".status").filter(":contains('SUCCESS')").text('提现成功').css("color","#ccc");                     
                    }
                }else{
                   // console.log('财务中心-人民币提现历史表格，加载失败。');
                }
            });

        //生成汇款单校验
        //开户人姓名校验
        var btnConfirm = false;
        $("#bank-username").blur(function(){
            var username = $("#bank-username").val();
            if(!username){
                btnConfirm = false;
                $('.msg-bank-username').show().text('请输入正确开户人姓名');
            }else{
                $('.msg-bank-username').hide();
                btnConfirm = true;
            }
        });
        //充值金额校验
        $("#bank-money").blur(function(){
            var bankmoney = $("#bank-money").val();
            if(bankmoney < 100 || isNaN(bankmoney)){
                btnConfirm = false;
                $('.msg-bank-money').show().text('最小充值金额为100元');
            }else{
                $('.msg-bank-money').hide();
                btnConfirm = true;
            }
        });
        $("#bank-money").focus(function(){
            $("#bank-money").val('');
        });        

        //接受跳转参数
        $(function() {
            function getQueryString(name) {
                href = decodeURIComponent(location.href);
                // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
                if (href.indexOf("?") == -1 || href.indexOf(name + '=') == -1) {
                    return '';
                }
                // 获取链接中参数部分
                var queryString = href.substring(href.indexOf("?") + 1);
                // 分离参数对 ?key=value&key2=value2
                var parameters = queryString.split("&");
                var pos, paraName, paraValue;
                for (var i = 0; i < parameters.length; i++) {
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
            if (b) {
                $('.rmbtx').addClass('bottomon');
                $('.rmbxh').removeClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
            }
            var c = getQueryString("whichtab");
            if(c){
                $('.rmbxh').removeClass('bottomon');
                $('.rmbtx').addClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
            }
        }); 

        
});
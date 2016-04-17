require(['api_mkt','mkt_info','decimal','cookie'], function(api_mkt,mkt_info,decimal) {

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

        var flag = false;
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

        //开户人姓名 
        api_mkt.basic(function(data) {
            if (data.status == 200) {
                $("#bank-username").val(data.data.list.name);             
            }
        });

        //接口 人民币充值历史（查询最近5条）
        api_mkt.rmbRechargeHistory({
            'pageNo':1,
            'pageSize':5
        },function(data) {
            if (data.status == 200 && data.data.list.length > 0) {
                var html = [];
                var num = data.data.list.length < 5?data.data.list.length:5;
                for(var i=0; i<num;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].updateDate +"</td>");
                    html.push("<td class='bank'>"+ data.data.list[i].bank +"</td>");
                    html.push("<td class='money'>"+ decimal.getTwoPs(data.data.list[i].money) +"</td>");                    
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
                    $(".status").filter(":contains('CANCEL')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('已关闭');                  
                    $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('已完成');                                      
                    $(".status").filter(":contains('CLOSED')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('已关闭');
                    //查看此笔充值单
                    $('.checkDeal').click(function(){
                        //打开弹出层-生成汇款单
                        $(".mydiv").css("display","block");
                        $(".bg1").css("display","block");               
                        $(".remittance-id").text($(this).parent().find('.txid').text());
                        $(".money-new").text('¥'+$(this).parent().find('.money').text()+'.00');                
                        $(".remittance-note-numbe-newr").text($(this).parent().find('.uid').text());
                        $('.bankName').text($(this).parent().find('.bank').text() +'网银');
                        //关闭弹出层 -生成汇款单
                        $(".span-text").click(function(){
                            $(".mydiv").css("display","none");
                            $(".bg1").css("display","none");
                        });  
                    });
                }
            }else{
               // console.log('财务中心-人民币充值历史表格，加载失败。');
            }
        });
        //人民提现 前5条
        api_mkt.rmbWithdrawalsHistory({
            'pageNo':1,
            'pageSize':5
        },function(data) {
            if (data.status == 200 && data.data.list.length > 0) {
                console.log(data);
                var html = [];
                var num = data.data.list.length < 5?data.data.list.length:5;
                for(var i=0; i<num;i++){
                    html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].updateDate +"</td>");
                    html.push("<td>"+ data.data.list[i].bank +"</td>");
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].pay) +"</td>");                    
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].fee) +"</td>");
                    html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                    html.push("</tr>");
                    $(".cnyOutput").html("");  //添加前清空 
                    $(".cnyOutput").append(html.join(""));

                    //过滤内容显示不同颜色
                    $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");
                    $(".status").filter(":contains('PROCESSING')").text('进行中').css("color","orange");
                    $(".status").filter(":contains('SUCCESS')").text('提现成功').css("color","#ccc");                    
                }
            }else{
               // console.log('财务中心-人民币提现历史表格，加载失败。');
            }
        });        

        //人民币提现表单校验
        var flag1 = false;
        $('#WithdrawalsAmount').blur(function(){
            var WithdrawalsAmount = $(this).val();
            if(!WithdrawalsAmount || isNaN(WithdrawalsAmount) || WithdrawalsAmount <100){
                $('.msg-WithdrawalsAmount').text('最低提现金额为100元');
                flag1 = false;
            }else if(WithdrawalsAmount > 50000){
                $('.msg-WithdrawalsAmount').text('最大提现金额不能超过50000元');
                flag1 = false;
            }else{
                flag1 = true;
                $('.msg-WithdrawalsAmount').text('');
                //手续费校验
                var Fee =$('.WithdrawalsFee');
                if(WithdrawalsAmount >= 400 ){
                    Fee.text(WithdrawalsAmount*0.005+' CNY');                    
                }else{
                    Fee.text('2 CNY');
                }
            }
        });
        //支付密码
        var flag2 = false;
        $('#WithdrawalsPayPwd').blur(function(){
            var pwd = $(this).val();
            if(!pwd){
                $('.msg-WithdrawalsPayPwd').text('请输入支付密码');
                flag2 = false;
            }else{
                flag2 = true;
                $('.msg-WithdrawalsPayPwd').text('');
            }
        });
        //验证码
        var flag3 = false;
        $('#VerificationCode').blur(function(){
            var pwd = $(this).val();
            var reg = /^\d{6}$/;
            if(!reg.exec(pwd)){
                //$('.msg-VerificationCode').text('请输入验证码');
                flag3 = false;
            }else{
                flag3 = true;
                $('.msg-VerificationCode').text('');
            }
        });

        //获取验证码-人民币提现
        $('#VerificationCodeBtn').click(function(){
            /*if(flag3 == true){
               $('.msg-VerificationCode').text('请输入正确的短信验证码');
            }else{*/
            api_mkt.sendCodeByLoginAfter( function(data) {
                if (data.status == 200) {
                    console.log(data);
                } else {   
                }
            });
            
            //30秒内只能发送一次
            var count = 60;
            var resend = setInterval(function(){
                    count--;
                    if(count > 0){
                        $('#VerificationCodeBtn').val(count+'s后重新发送');
                        $('#VerificationCodeBtn').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
                    }else{
                        clearInterval(resend);
                        $('#VerificationCodeBtn').attr('disabled',false).css({'cursor':'pointer','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
                    }
                },1000); 
        }); 
        //判断是否添加银行卡
        api_mkt.bankList({  
            'pageNo':1,
            'pageSize' :10   
        }, function(data) {
            if (data.status == 200) {
                if(data.data.list.length > 0){
                    for(var i=data.data.list.length-1;i>=0;i--){
                        var num = data.data.list[i].acnumber;
                        var username = data.data.list[i].name;
                        var bank = data.data.list[i].bank;
                        var node = $('<div class="divFixed"></div>');
                        var nodeList ='<input type="radio" name="checkBankCard" class="checkBankCard"/>'+
                                       '<input type="text" class="bankNum" style="display:none" value="'+num+'"/>'+
                                       '<input type="text" class="bankUserName" style="display:none" value="'+username+'"/>'+
                                       '<input type="text" class="bankName" style="display:none" value="'+bank+'"/>'+
                                       '<div class="bankIdCard">'+bank+'</div><div class="num">尾号：'+num.substr(num.length-4)+'</div>';
                        node.html(nodeList);
                        node.insertBefore($('.addBankCard'));
                        //判断显示银行logo
                        $('input[type="radio"]:eq(0)').attr('checked',true);  

                        $('.bankIdCard').filter(":contains('中国工商银行')").addClass('ICBC').text('');
                        $('.bankIdCard').filter(":contains('中国建设银行')").addClass('CBC').text('');
                        $('.bankIdCard').filter(":contains('交通银行')").addClass('BC').text('');
                        $('.bankIdCard').filter(":contains('招商银行')").addClass('CMB').text('');
                        $('.bankIdCard').filter(":contains('中国邮政储蓄银行')").addClass('PSBC').text('');
                        $('.bankIdCard').filter(":contains('中国农业银行')").addClass('ABC').text(''); 
                        //radio 获取值
                        if($('.checkBankCard').length == 1){
                            //console.log('asdfas');
                            var a = $('.bankNum').val();
                            var b = $('.bankUserName').val();
                            var c = $('.bankName').val();
                            $.cookie('bankNum',a);
                            $.cookie('bankUserName',b);
                            $.cookie('bankName',c);
                        }else{
                            $('.checkBankCard').click(function(){
                                var a = $(this).parent().find('.bankNum').val();
                                var b = $(this).parent().find('.bankUserName').val();
                                var c = $(this).parent().find('.bankName').val();
                                $.cookie('bankNum',a);
                                $.cookie('bankUserName',b);
                                $.cookie('bankName',c);
                            }); 
                        }                 
                    }                    
                }
            }
                        
            $("#bank-idcard").keyup(function(){
                $(this).val($(this).val().replace(/[^0-9$]/g,''));
            });
            
            //人民币提现申请 弹出层        
            $(".Withdrawalsbtn").click(function(){
                if(flag1 == false){
                   $('.msg-WithdrawalsAmount').text('提现金额为100元至50000元之间');
                }else if(flag2 == false){
                   $('.msg-WithdrawalsPayPwd').text('请输入正确的支付密码');
                }else if(flag3 == false){
                   $('.msg-VerificationCode').text('请输入正确的短信验证码');
                }else if($('.checkBankCard').length == 0){
                    $('.addBankCard').html('<a href="withdraw.html" style="color:#0bbeee;">+ 添加银行卡</a><span style="color:red;margin-left:25px;"> 请点击添加银行卡</span>');
                }else{  
                    $(".mydiv1").css("display","block");
                    $(".bg1").css("display","block"); 
                    //勾选弹出框 选择内容
                         
                    //弹出层理面的内容
                    $(".WithdrawalsCard").text($.cookie('bankNum'));
                    $(".WithdrawalsBank").text($.cookie('bankName'));
                    $(".WithdrawalsName").text($.cookie('bankUserName'));
                    var amount = parseInt($("#WithdrawalsAmount").val());
                    var Fee = parseInt($('.WithdrawalsFee').text());
                    $(".WithdrawalsAmount").text('¥'+amount+'.00');
                    $(".WithdrawalsRealAmount").text('¥'+(amount - Fee)+'.00');

                    //只关闭
                    $(".span-text1").click(function(){
                        $(".mydiv1").css("display","none");
                        $(".bg1").css("display","none");
                    }); 
                    //关闭弹出层 -生成汇款单
                    $(".span-btn1").click(function(){
                        $(".mydiv1").css("display","none");
                        $(".bg1").css("display","none"); 
                        //接口：人民币提现
                        api_mkt.rmbWithdrawals({          
                            'bankId':data.data.list[0].acnumber,
                            'money':amount,
                            'identifyingCode':$('#VerificationCode').val(),
                            'fee':Fee,
                            'bankName':data.data.list[0].bank,
                            'acName':data.data.list[0].name,
                            'paypwd':$('#WithdrawalsPayPwd').val() 
                        }, function(data) {
                            if (data.status == 200) {                              
                                window.location.reload();
                            } else if(data.msg == '验证码错误，请重新发送验证码'){
                                $('.msg-VerificationCode').text('验证码错误，请重新输入');
                            }else if(data.msg == '账户余额不足'){
                                $('.msg-WithdrawalsAmount').text('账户余额不足');
                            }else if(data.msg == '支付密码错误'){
                                $('.msg-WithdrawalsPayPwd').text('支付密码错误');
                            }else if(data.msg == '每日提现金额不能超过50万'){
                                $('.msg-WithdrawalsAmount').text('每日提现金额不能超过50万');
                            }
                        });                       
                    });                         
                }
            });            
        });

        //实名认证用户充值-显示/隐藏-提示文本内容
        $(".accountholder_tip").hover(function(){
            $(".tipscontent").toggle();
        });

        //生成汇款单校验
        //充值金额校验
        var btnConfirm1 = false;
        $("#bank-money").blur(function(){
            var bankmoney = $("#bank-money").val();
            if(bankmoney < 100 || isNaN(bankmoney)){
                btnConfirm1 = false;
                $('.msg-bank-money').show().text('最小充值金额为100元');
            }else{
                $('.msg-bank-money').hide();
                btnConfirm1 = true;
            }
        });
        //银行账号校验
        var btnConfirm2 = false;
        $("#bank-idcard").blur(function(){
            //console.log(api_mkt.basePath2);
            var bankIdcard = $("#bank-idcard").val();
            var reg = /^(\d{16}|\d{19})$/;
            if(!bankIdcard || !reg.exec(bankIdcard)){
                btnConfirm2 = false;
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else{
                $('.msg-bank-idcard').hide();
                btnConfirm2 = true;
                //接口 银行卡识别
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: api_mkt.basePath2,
                    data: JSON.stringify({
                        'bankCard':$("#bank-idcard").val()
                    }),
                    cache: false,
                    success: function(data) {
                        $("#bank").val(data.data.bankName);
                    },
                    error: function() {
                        console.log("提交失败");
                    }
                });
            }
        });
        
        //手机号校验
        var btnConfirm3 = false;
        $("#phone").blur(function(){
            var phone = $("#phone").val();
            var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if(!reg.test(phone)){  
                btnConfirm3 = false;
                $('.msg-phone').show().text('请输入手机正确手机号码');
            }else{
                $('.msg-phone').hide();
                btnConfirm3 = true;
            }
        });
        $("#phone").keyup(function(){
            $(this).val($(this).val().replace(/[^0-9$]/g,''));
        });
        $("#phone").focus(function(){
            $("#phone").val('');
        });
        //勾选 使用绑定手机
        $('#phonePos').click(function(){
            if($(this).is(':checked')){
                api_mkt.userbasic(function(data){
                    if(data.data && data.data.list){
                    	var phone=data.data.list.mobile;
                        $("#phone").val(phone.substring(0,3)+"****"+phone.substring(7,11));
                        $("#phone").attr("data-phone",data.data.list.mobile);
                        $('.pUid').val(data.data.list.uid);
                        $('.msg-phone').hide();
                        btnConfirm3 = true;
                    }
                });

            }else{
                $('#phone').val('');
                btnConfirm3 = false;
                $('.msg-phone').show().text('请输入手机正确手机号码');
            }
        });

        //生成汇款单里的填充文本        
        $(".build-remit-layer").click(function(){
            if(btnConfirm1 == false){
                $('.msg-bank-money').show().text('最小充值金额为100元');
            }else if(btnConfirm2 == false){
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else if(btnConfirm3 == false){
                $('.msg-phone').show().text('请输入手机正确手机号码');
            }else{
                //打开弹出层-生成汇款单 
                $(".mydiv").css("display","block");
                $(".bg1").css("display","block"); 
                $(".money-new").text('¥'+$('#bank-money').val()+'.00'); 
                $('.bankName').text($("#bank").val()+'网银');
                //接口：人民币充值
                api_mkt.rmbRecharge({          
                    'bankId':$('#bank-idcard').val(),
                    'rechargeMoney':$('#bank-money').val(),
                    'phone':$('#phone').val().indexOf("*")>0?$('#phone').attr("data-phone"):$('#phone').val(),
                    "bankName":$("#bank").val()     
                }, function(data) {
                    if (data.status == 200) {
                        //打开弹出层-生成汇款单
                        $(".remittance-id").text( data.data.orderNo);               
                        $(".remittance-note-numbe-newr").text(data.data.uid);
                    } else {
                        //console.log('err');
                    }
                });
                //清空文本框
                $("#bank-idcard").val('');
                $("#bank").val('');
                $("#bank-money").val('');
                $("#phone").val('');
                /*//再次调接口 人民币充值历史（查询最近5条）
                api_mkt.rmbRechargeHistory({
                    'pageNo':1,
                    'pageSize':5
                },function(data) {
                    if (data.status == 200 && data.data.list.length > 0) {
                        var html = [];
                        var num = data.data.list.length < 5?data.data.list.length:5;
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
                            $(".status").filter(":contains('CANCEL')").text('已取消').css("color","#ccc");
                            //查看此笔充值单
                            $('.checkDeal').click(function(){
                                //打开弹出层-生成汇款单
                                $(".mydiv").css("display","block");
                                $(".bg1").css("display","block");               
                                $(".remittance-id").text($(this).parent().find('.txid').text());
                                $(".money-new").text('¥'+$(this).parent().find('.money').text()+'.00');                
                                $(".remittance-note-numbe-newr").text($(this).parent().find('.uid').text());
                                $('.bankName').text($(this).parent().find('.bank').text() +'网银');
                                //关闭弹出层 -生成汇款单
                                $(".span-text").click(function(){
                                    //window.location.reload();
                                    $(".mydiv").css("display","none");
                                    $(".bg1").css("display","none");
                                });  
                            });
                        }
                    }else{
                       // console.log('财务中心-人民币充值历史表格，加载失败。');
                    }
                });*/ 
                
                //关闭弹出层 -生成汇款单
                $(".span-text").click(function(){
                    $(".mydiv").css("display","none");
                    $(".bg").css("display","none");
                    window.location.reload();
                });      
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
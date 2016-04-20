require(['api_mkt', 'mkt_info','decimal', 'mkt_pagehead', 'cookie'], function(api_mkt, mkt_info,decimal) {
    //console.log(api_mkt);
    //console.log(mkt_info);
    //mkt_info.get();
    //mkt_pagehead.get();
    $('.rmbxh').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbtx').removeClass('bottomon');
        $('.recharge').show();
        $('.withdraw_deposit').hide();
    });
    $('.rmbtx').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbxh').removeClass('bottomon');
        $('.recharge').hide();
        $('.withdraw_deposit').show();
    });
    //点击进入tab的指定位置
    $('#addNewAd').click(function() {
        location.href = "withdraw.html?id=rmbtx ";
    });
    //我的账户信息-取账户地址
    api_mkt.basic(function(data) {
        if (data.status == 200) {
            //创建节点
            $('.regist_rg_input-longAddress').val(data.data.list.gOPAddress);
            $('.gpal_address').text(data.data.list.gOPAddress);
        } else {
            //console.log(err);
        }
    });

    //果仁(提现)转出记录_只查询成功记录
    api_mkt.transferOutHistory({
        'pageNo': 1,
        'pageSize': 5
    }, function(data) {
        if (data.status == 200) {
            var html = [];
            var num = data.data.list.length < 5?data.data.list.length:5;
            for(var i=0; i<num;i++){
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].wallet + "</td>");
                html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                html.push("</tr>");
                $(".guorenOutput").html(""); //添加前清空 
                $(".guorenOutput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");           
                $(".status").filter(":contains('FAILURE')").text('失败').css("color", "#999");
            
            }
        } else {
            
        }
    });
    //果仁提现-校验
    var btnConfirm0a = false; //校验表单-变量
    var btnConfirm1a = false; //校验表单-变量
    var btnConfirm2a = false; //校验表单-变量
    var btnConfirm3a = false; //校验表单-变量
    //果仁提现地址管理(如果有就显示)
    api_mkt.gopAddressMan({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for (var i = 0; i < data.data.list.length; i++) {
                //创建节点
                var Node1 = $('<option></option>');
                Node1.text(data.data.list[i].name);
                Node1.val(data.data.list[i].address);
                $('.regist_rg_input-select').append(Node1);

                $('option:eq(1)').attr('selected',true);
                btnConfirm0a = true;
                $('.msg-gopWithdrawalsSelect').text('');
            }
        } else {
            btnConfirm0a = false;
        }
    });
    //输入数量校验
    $('#gopWithdrawalsNumber').blur(function() {
        var num = $('#gopWithdrawalsNumber').val();
        if (!num || isNaN(num)) {
            btnConfirm1a = false;
            $('.msg-gopWithdrawalsNumber').text('请输入提取数量');
        }else if(num <0.02){
            btnConfirm1a = false;
            $('.msg-gopWithdrawalsNumber').text('转出数量最少为0.02');
        }else{  
            btnConfirm1a = true;
            $('.msg-gopWithdrawalsNumber').text('');
        }
    });
    $('#gopWithdrawalsNumber').on('input',function(){
        var num = $('#gopWithdrawalsNumber').val();
        var oldData=$(this).attr("data-old");
        if(decimal.getPsercison(num)>=2){
            //大于小数点2位的都禁止输入
            $(this).val(oldData?oldData:decimal.getTwoPs(num));  
        }
    });
    /*$(".wrapper").on("input propertychange", "#gopWithdrawalsNumber", function() {
    	var num = $(this).val();
        var oldData=$(this).attr("data-old");
        if(decimal.toDecimal(num) < 0.02||decimal.getPsercison(num)>2 ){
        	//$(this).val(oldData?oldData:0.02);
        }else{
        	$(this).attr("data-old",num);
        }
    });*/
    
    //校验支付密码
    $('#gopWithdrawalsPayPwd').blur(function() {
        var PayPwd = $('#gopWithdrawalsPayPwd').val();
        if (!PayPwd) {
            btnConfirm2a = false;
            $('.msg-gopWithdrawalsPayPwd').text('请输入您的支付密码');
        } else {
            btnConfirm2a = true;
            $('.msg-gopWithdrawalsPayPwd').text('');
        }
    });

    //获取验证码
    $('#gopWithdrawalsCodeBtn').click(function() {
        api_mkt.sendCodeByLoginAfter(function(data) {
            if (data.status == 200) {
                console.log(data);
            } else {}
        });

        //30秒内只能发送一次
        var count = 60;
        var resend = setInterval(function() {
            count--;
            if (count > 0) {
                $('#gopWithdrawalsCodeBtn').val(count + 's后重新发送');
                $('#gopWithdrawalsCodeBtn').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
            } else {
                clearInterval(resend);
                $('#gopWithdrawalsCodeBtn').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
            }
        }, 1000);
    });
    //校验验证码
    $('#gopWithdrawalsCode').blur(function() {
        var code= $('#gopWithdrawalsCode').val();
        if (!code) {
            btnConfirm3a = false;
            $('.msg-gopWithdrawalsCode').text('请输入短信验证码');
        } else {
            btnConfirm3a = true;
            $('.msg-gopWithdrawalsCode').text('');
        }
    });
    //转出
    $('.gopWithdrawalsBtn').click(function() {
        
    	if(global.payLocked){
    		window.location.reload();
    		$(window).scrollTop(0);
    		return false;
    	}
        if (btnConfirm0a == false) {
            $('.msg-gopWithdrawalsSelect').text('请先添加果仁地址');
        }else if (btnConfirm1a == false) {
            if($('#gopWithdrawalsNumber').val() == 0.01){
                $('.msg-gopWithdrawalsNumber').text('提取数量最小为0.02');
            }else{
                $('.msg-gopWithdrawalsNumber').text('请输入提取数量');
            }
        } else if (btnConfirm2a == false) {
            $('.msg-gopWithdrawalsPayPwd').text('请输入您的支付密码');
        } else if (btnConfirm3a == false) {
            $('.msg-gopWithdrawalsCode').text('请输入短信验证码');
        } else{
            //果仁提现
            api_mkt.gopWithdrawals({
                'number': $('#gopWithdrawalsNumber').val(),
                'toWallet': $('#gopWithdrawalsSelect').find('option:selected').val(),
                'identifyingCode': $('#gopWithdrawalsCode').val(),
                'paypwd': $('#gopWithdrawalsPayPwd').val()
            }, function(data) {
                if (data.status == 200) {
                    //showWarnWin('转出成功',1e3);
                    $('.mydiv').show();
                    $('.bg').show();
                    $('#gopWithdrawalsNumber').val('');
                    $('#gopWithdrawalsPayPwd').val('');
                    $('#gopWithdrawalsCode').val('');
                }else if(data.msg == '验证码错误,请重新发送验证码'){
                    $('.msg-gopWithdrawalsCode').text('您输入验证码有误，请重新输入');
                }else if(data.data && data.data.num){
        			var num=data.data?data.data.num:data.date.num;
                    if(3-num > 0 ){
                        $('.msg-gopWithdrawalsPayPwd').show().text("支付密码错误，您还有"+(3-num)+"次输入机会");
                    }else{                                
                        $('.msg-gopWithdrawalsPayPwd').show().html("提示为保证资金安全，您的支付密码已被锁定，请<a href='resetpaymentcode.html' class='moreCheck'>找回支付密码</a>");
                    }
        		}else if(data.msg.indexOf('锁定')>0){
        			$('.msg-gopWithdrawalsCode').show().text(data.msg);
        			window.location.reload();
            		$(window).scrollTop(0);
        		}else if(data.msg == '账户果仁不足'){
                    $('.msg-gopWithdrawalsNumber').text('您的账户果仁不足');
                }else{
                    showWarnWin(data.msg,1e3);
                }
            });
        }
    });
    //关闭转出成功弹出层
    $('.mydiv_4').click(function(){
        $('.mydiv').hide();
        $('.bg').hide();
    });
    //果仁(充值)转出记录_只查询成功记录
    api_mkt.transferInHistory({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            var html = [];
            var num = data.data.list.length < 5?data.data.list.length:5;
            for(var i=0; i<num;i++){
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].wallet + "</td>");
                html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                html.push("</tr>");
                $(".guorenInput").html(""); //添加前清空 
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");
            
            }
        } else {
            
        }
    });

    //点击图片 复制地址
    $('.imgCopy').click(function(){
        $('#a').select();  
        document.execCommand("Copy");
        //alert("已复制好，可贴粘。");
        showWarnWin('已复制，可以贴粘。',1e3); 
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
        var c = getQueryString("whichtab");
        if(c&&c=="rmbtx"){
            $(".rmbtx").addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        }
    });
});

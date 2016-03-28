require(['api_mkt','mkt_info','mkt_pagehead','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
    //mkt_pagehead.get();
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
    //点击进入tab的指定位置
    $('#addNewAd').click(function(){
        location.href="withdraw.html?id=rmbtx ";
    }); 
    //我的账户信息-取账户地址
    api_mkt.basic(function(data) {
        if (data.status == 200) {
            console.log(data);
            //创建节点
            $('.gpal_address').text(data.data.list.address);
        } else {
            consloe.log(err);
        }
    });

    //果仁提现地址管理(如果有就显示)
    api_mkt.gopAddressMan({          
        'pageNo':1,
        'pageSize':10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for(var i=0;i<data.data.list.length;i++){
                //创建节点
                var Node1 = $('<option></option>');
                Node1.text(data.data.list[i].address);
                $('.regist_rg_input-select').append(Node1);                   
            }                 
        } else {
            consloe.log(err);
        }
    });
    
    //果仁(提现)转出记录_只查询成功记录
    api_mkt.transferOutHistory({          
        'pageNo':1,
        'pageSize':10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for(var i=0;i<data.data.list.length;i++){
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
            }                 
        } else {
            consloe.log(err);
        }
    }); 
    //果仁提现-校验
    var btnConfirm = false;
    //判断是否选择果仁地址
    /*if($('.gopWithdrawalsSelect').find('option:selected').text() == '选择果仁地址'){
        btnConfirm = false;
    }else{
        btnConfirm = true;
        //$('.msg-gopWithdrawalsSelect').text('');
    }*/
    //输入数量校验
    $('#gopWithdrawalsNumber').blur(function(){
        var num = $('#gopWithdrawalsNumber').val();
        var reg = /^[0-9]{1,}$/;
        if(!reg.exec(num)){
            btnConfirm = false;
            $('.msg-gopWithdrawalsNumber').text('请输入提取数量');
        }else{
            btnConfirm = true;
            $('.msg-gopWithdrawalsNumber').text('');
        }
    });
    //校验支付密码
    $('#gopWithdrawalsPayPwd').blur(function(){
        var PayPwd = $('#gopWithdrawalsPayPwd').val();
        if(!PayPwd){
            btnConfirm = false;
            $('.msg-gopWithdrawalsPayPwd').text('请输入支付密码');
        }else{
            btnConfirm = true;
            $('.msg-gopWithdrawalsPayPwd').text('');
        }
    });

    //获取验证码
    $('#gopWithdrawalsCodeBtn').click(function(){
        if(btnConfirm == false){
            alert('请完善填写信息！');
        }
        else{
            api_mkt.sendCodeByLoginAfter( function(data) {
                if (data.status == 200) {
                    console.log(data);
                } else {   
                }
            });
            
            //30秒内只能发送一次
            var count = 30;
            var resend = setInterval(function(){
                    count--;
                    if(count > 0){
                        $('#gopWithdrawalsCodeBtn').val(count+'s后重新发送');
                        $('#gopWithdrawalsCodeBtn').attr('disabled',true).css('cursor','not-allowed');
                    }else{
                        clearInterval(resend);
                        $('#gopWithdrawalsCodeBtn').attr('disabled',false).css('cursor','pointer').val('获取验证码');
                    }
                },1000); 
        }
        
    });
    //转出
    $('.gopWithdrawalsBtn').click(function(){
        if(btnConfirm == false || typeof(btnConfirm) == 'undefined'){
            alert('请完善填写信息！');
        }
        else{
            //果仁提现
            api_mkt.gopWithdrawals({          
                'number':$('#gopWithdrawalsNumber').val(),
                'toWallet':$('#gopWithdrawalsSelect').find('option:selected').text(),
                'identifyingCode':$('#gopWithdrawalsCode').val(),
                'paypwd':$('#gopWithdrawalsPayPwd').val()
            }, function(data) {
                if (data.status == 200) {
                     console.log(data);                
                } else {
                    console.log(data.msg);
                }
            });
        } 
    });

    //果仁(充值)转出记录_只查询成功记录
    api_mkt.transferInHistory({          
        'pageNo':1,
        'pageSize':10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for(var i=0;i<data.data.list.length;i++){
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
            }                 
        } else {
            consloe.log(err);
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

        var b = getQueryString("formindex");
        //console.log(b);
        if(b){
            $('.rmbtx').addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        }
        
    })

	
});
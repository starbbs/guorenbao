require(['api_mkt', 'mkt_info', 'mkt_pagehead', 'cookie'], function(api_mkt, mkt_info) {
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
    //所有input focus 清空 内容
    $('.regist_rg_input').focus(function(){
        $(this).val('');
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
            }
        } else {
            //console.log(err);
        }
    });

    //果仁(提现)转出记录_只查询成功记录
    api_mkt.transferOutHistory({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for (var i = 0; i <5 && i < data.data.list.length; i++) {
                var html = [];
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].wallet + "</td>");
                html.push("<td>" + data.data.list[i].number + "</td>");
                html.push("<td class='status-guorenOutput'>" + data.data.list[i].transferGopOptType + "</td>");
                html.push("</tr>");
                $(".guorenOutput").html(""); //添加前清空 
                $(".guorenOutput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status-guorenOutput").filter(":contains('进行中')").css("color", "orange");
            
            }
        } else {
            //console.log(err);
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
    $('#gopWithdrawalsNumber').blur(function() {
        var num = $('#gopWithdrawalsNumber').val();
        var reg = /^[0-9]{1,}$/;
        if (!reg.exec(num)) {
            btnConfirm = false;
            $('.msg-gopWithdrawalsNumber').text('请输入提取数量');
        } else {
            btnConfirm = true;
            $('.msg-gopWithdrawalsNumber').text('');
        }
    });
    //校验支付密码
    $('#gopWithdrawalsPayPwd').blur(function() {
        var PayPwd = $('#gopWithdrawalsPayPwd').val();
        if (!PayPwd) {
            btnConfirm = false;
            $('.msg-gopWithdrawalsPayPwd').text('请输入支付密码');
        } else {
            btnConfirm = true;
            $('.msg-gopWithdrawalsPayPwd').text('');
        }
    });

    //获取验证码
    $('#gopWithdrawalsCodeBtn').click(function() {
        if (btnConfirm == false) {
            alert('请完善填写信息！');
        } else {
            api_mkt.sendCodeByLoginAfter(function(data) {
                if (data.status == 200) {
                    console.log(data);
                } else {}
            });

            //30秒内只能发送一次
            var count = 30;
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
        }

    });
    //转出
    $('.gopWithdrawalsBtn').click(function() {
        if (btnConfirm == false || typeof(btnConfirm) == 'undefined') {
            alert('请完善填写信息！');
        } else {
            //果仁提现
            api_mkt.gopWithdrawals({
                'number': $('#gopWithdrawalsNumber').val(),
                'toWallet': $('#gopWithdrawalsSelect').find('option:selected').val(),
                'identifyingCode': $('#gopWithdrawalsCode').val(),
                'paypwd': $('#gopWithdrawalsPayPwd').val()
            }, function(data) {
                if (data.status == 200) {
                    alert('转出成功');
                } else{                    
                    alert(data.msg);
                }
            });
        }
    });

    //果仁(充值)转出记录_只查询成功记录
    api_mkt.transferInHistory({
        'pageNo': 1,
        'pageSize': 10
    }, function(data) {
        if (data.status == 200) {
            console.log(data);
            for (var i = 0; i <5 && i < data.data.list.length; i++) {
                var html = [];
                html.push("<tr>");
                html.push("<td>" + data.data.list[i].createDate + "</td>");
                html.push("<td>" + data.data.list[i].address + "</td>");
                html.push("<td>" + data.data.list[i].amount + "</td>");
                html.push("<td class='status-guorenInput'>" + data.data.list[i].status + "</td>");
                html.push("</tr>");
                $(".guorenInput").html(""); //添加前清空 
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status-guorenInput").filter(":contains('进行中')").css("color", "orange");
            
            }
        } else {
            consloe.log(err);
        }
    });

    

    //点击图片 复制地址
    $('.imgCopy').click(function(){
        $('#a').select();  
        document.execCommand("Copy");
        alert("已复制好，可贴粘。"); 
    });


});

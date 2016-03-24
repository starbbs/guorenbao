require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
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

        //点击-银行卡表单
        $('.bankIdCard').click(function(){
            $('.one').css('display','none');
            $('.two').css('display','flex');
        });
        //校验银行账户
        var btnConfirm = false;
        //银行账号校验-人民币提现管理
        $("#bank-idcard").blur(function(){
            var bankIdcard = $("#bank-idcard").val();
            var reg = /^(\d{16}|\d{19})$/;
            if(!bankIdcard || !reg.exec(bankIdcard)){
                btnConfrim = false;
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else{
                $('.msg-bank-idcard').hide();
                btnConfrim = true;
                //接口 银行卡识别
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "http://116.213.142.89:8080/common/checkBankCard",
                    data: JSON.stringify({
                        'bankCard':$("#bank-idcard").val()
                    }),
                    cache: false,
                    success: function(data) {
                        console.log(data.data.bankName);
                        //所属银行自动添加
                        $("#bank").val(data.data.bankName);
                    },
                    error: function() {
                        console.log("提交失败");
                    }
                });

                /*api_mkt.checkBankCard({          
                        'bankCard':$("#bank-idcard").val()     
                    }, function(data) {
                        if (data.status == 200) {
                            console.log(data.bankName);
                            //所属银行自动添加
                            $("#bank").val(data.data.bankName);
                        } else {
                            alert('银行卡号有误'); 
                        }
                });*/
            }
        });

        //全国省市二级联动下拉选择菜单-人民币提现管理
        first("selectp","selectc","form1",0,0);
        
        //校验开户支行-人民币提现管理
        $('#subbank').blur(function(){
            var subbank = $.trim($(this).val());
            var reg = /^[\u4e00-\u9fa5]+$/;   
            if(!subbank || !reg.test(subbank)){
                btnConfirm = false;
                $('.msg-subbank').show().text('请输入正确的开户支行地址');
            }else{
                btnConfirm = true;
                $('.msg-subbank').hide();
            }
        });
        //校验支付密码-人民币提现管理
        $('.pay-pwd').blur(function(){
            var payPwd = $.trim($(".pay-pwd").val());
            var reg = /^[0-9a-zA-Z]{6,12}$/;
            if(!reg.test(payPwd) || !payPwd){
                btnConfirm = false;
                $('.msg-pay-pwd').show().text('请输入正确的支付密码');
            }else{
                btnConfirm = true;
                $('.msg-pay-pwd').hide();
            }
        });

        //校验验证码-人民币提现管理
        $('#sendCodeByLoginAfter').blur(function(){
            var code = $.trim($(this).val());
            if(isNaN(code)){
                btnConfirm = false;
                $('.msg-sendCodeByLoginAfter').show().text('请输入正确的验证码');
            }else{
                btnConfirm = true;
                $('.msg-sendCodeByLoginAfter').hide();
            }
        });
        //获取验证码-人民币提现管理
        $('#sendCodeByLoginAfterBtn').click(function(){
            if(btnConfirm == false){
                alert('请完善填写信息！');
            }
            else{
                api_mkt.sendCodeByLoginAfter( function(data) {
                    if (data.status == 200) {
                        console.log(data);
                        $('.msg-sendCodeByLoginAfter').text('');
                    } else {
                        $('.msg-sendCodeByLoginAfter').text('请输入正确的验证码');
                    }
                });
                
                //30秒内只能发送一次
                var count = 30;
                var resend = setInterval(function(){
                        count--;
                        if(count > 0){
                            $('#sendCodeByLoginAfterBtn').val(count+'s后重新发送');
                            $('#sendCodeByLoginAfterBtn').attr('disabled',true).css('cursor','not-allowed');
                        }else{
                            clearInterval(resend);
                            $('#sendCodeByLoginAfterBtn').attr('disabled',false).css('cursor','pointer').val('获取验证码');
                        }
                    },1000); 
            }
            
        });

        //人民币提现管理添加 点击-确认添加银行卡
        $('.confirmAdd').click(function(){
            if(btnConfirm == false || $('#sendCodeByLoginAfter').val() ==''){
                alert('请填写完整信息');
            }else{
                api_mkt.rmbWithdrawalsManageAdd({          
                    'name':'测试' ,//这个位置应取值为实名认证的真实姓名， 
                    'bank': $('#bank').val(),
                    'bankId':$('#bank-idcard').val(),
                    'bankProvince':$('.select-area').find('option:selected').text(),
                    'bankCity':$('.select-city').find('option:selected').text(),
                    'subbank':$('#subbank').val(),
                    'payPwd':$('.pay-pwd').val(),
                    'identifyingCode':$('#identifyingCodeRmbWithdrawals').val()
                }, function(data) {
                    if (data.status == 200) {
                        console.log(data);
                        $('.two').css('display','none');
                        $('.three').css('display','flex');
                        //填写表单-生成银行卡 
                        $('.bankName').text('中国工商银行');
                        var bankAccount = $('.bankAccount').val();
                        $('.bankIdCard-Code').text('尾号:'+bankAccount.substr(bankAccount.length-4));
                    } else {
                        
                    }
                });

                
            }            
        });
        //再次添加银行卡
        $('.bankIdCard').click(function(){
            $('.three').css('display','none');
            $('.two').css('display','flex');
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

            var b = getQueryString("a");
            console.log(b);
            if(b){
                $('.new).css('display','flex');
                $('.recharge').css('display','none');
            }
            
        })
	
});
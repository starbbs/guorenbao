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
            $('.nut-two').hide();
        });

        //twoBackOne  返回
        $('.twoBackOne').click(function(){
            $('.one').css('display','flex');
            $('.two').css('display','none');
            $(this).css('display','none');
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
        $('#sendCodeByLoginAfter, #nut-identifyingCode').blur(function(){
            var code = $.trim($(this).val());
            if(isNaN(code)){
                btnConfirm = false;
                $('.msg-sendCodeByLoginAfter').show().text('请输入正确的验证码');
                $('.msg-nut-identifyingCode').show().text('请输入正确的验证码');
            }else{
                btnConfirm = true;
                $('.msg-sendCodeByLoginAfter').hide();
                $('.msg-nut-identifyingCode').hide();
            }
        });
        //获取验证码-人民币提现管理
        $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').click(function(){
            if(btnConfirm == false){
                alert('请完善填写信息！');
            }
            else{
                api_mkt.sendCodeByLoginAfter( function(data) {
                    if (data.status == 200) {
                        console.log(data);
                        $('.msg-sendCodeByLoginAfter').text('');
                        $('.msg-nut-identifyingCode').text('');
                    } else {
                        $('.msg-sendCodeByLoginAfter').text('请输入正确的验证码');                        
                        $('.msg-nut-identifyingCode').text('请输入正确的验证码');
                    }
                });
                
                //30秒内只能发送一次
                var count = 30;
                var resend = setInterval(function(){
                        count--;
                        if(count > 0){
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').val(count+'s后重新发送');
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').attr('disabled',true).css('cursor','not-allowed');
                        }else{
                            clearInterval(resend);
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').attr('disabled',false).css('cursor','pointer').val('获取验证码');
                        }
                    },1000); 
            }
            
        });

        //人民币提现管理添加 点击-确认添加银行卡
        $('.confirmAdd').click(function(){
            if(btnConfirm == false || $('#sendCodeByLoginAfter').val() ==''){
                alert('请填写完整信息');
            }else{
                $('.two').css('display','none');
                $('.three').css('display','flex');
                //填写表单-生成银行卡 
                $('.bankName').text($('#bank').val());
                var bankAccount = $('#bank-idcard').val();
                $('.bankIdCard-Code').text('尾号:'+bankAccount.substr(bankAccount.length-4));
                $('.bankIdCard-Name').text('持卡人姓名：aa');
                var bankProvince = $('.select-area').find('option:selected').text();
                var bankCity = $('.select-city').find('option:selected').text();
                var subbank = $('#subbank').val();
                $('.bankIdCard-address').html(bankProvince+bankCity+subbank);
                /*api_mkt.rmbWithdrawalsManageAdd({          
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
                        $('.bankIdCard-Name').text('持卡人姓名：'+data.name);
                    } else {
                        
                    }
                });*/

                
            }            
        });

        //点击删除银行卡
        $('.bankIdCard-del').click(function(){
            $(this).parent().remove();
        });
        //再次添加银行卡
        $('.bankIdCard-add').click(function(){
            $('.three').css('display','none');
            $('.two').css('display','flex');
        });

        //果仁提现地址备注-校验
        $('.msg-nut-name').show().html('<p style="color:#999;">果仁市场内互转即时极速到账</p>');
        $('#nut-name').blur(function(){
            var name = $(this).val();
            if(!name){
                btnConfirm = false;
                $('.msg-nut-name').show().text('请输入地址备注');
            }else{
                btnConfirm = true;
                $('.msg-nut-name').show().html('<p style="color:#999;">地址备注完成：果仁市场内互转即时极速到账</p>');
            }
        });
        //果仁提现地址-校验
        $('#nut-address').blur(function(){
            var address = $(this).val();
            if(!address){
                btnConfirm = false;
                $('.msg-nut-address').show().text('请输入正确地址');
            }else{
                btnConfirm = true;
                $('.msg-nut-address').hide();
            }
        });
        //校验支付宝密码
        $('.nut-paypwd').blur(function(){
            var nutPayPwd = $(this).val();
            if(!nutPayPwd){
                btnConfirm = false;
                $('.msg-nut-paypwd').show().text('请输入支付宝密码');
            }else{
                btnConfirm = true;
                $('.msg-nut-paypwd').hide();
            }
        });
        
        //果仁提现地址管理添加
        $('.gopAddressManAdd').click(function(){
            if(btnConfirm == false || $('#nut-identifyingCode').val() ==''){
                alert('请填写完整信息');
            }else{
                //果仁市场添加
                $('.nut-one').hide();
                $('.nut-two').show();
                var Node1 = $('<div class="nutOutputManager"></div>');
                var Node2 = $('<p class="nutIdName"></p>').appendTo(Node1); 
                var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1); 
                var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1); 
                var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                Node2.append('地址：'+$('#nut-name').val());
                Node3.append($('#nut-address').val());
                $('.nut-two').append(Node1);
                /*api_mkt.gopAddressManAdd({          
                    'name':$('#nut-name').val(),
                    'paypwd': $('#nut-paypwd').val(),
                    'address':$('#nut-address').val(),
                    'identifyingCode':$('#nut-identifyingCode').val()
                }, function(data) {
                    if (data.status == 200) {
                        console.log(data);/*
                        $('.two').css('display','none');
                        $('.three').css('display','flex');
                        //填写表单-生成银行卡 
                        
                    } else {
                        
                    }
                });*/

                
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

            var b = getQueryString("a");
            //console.log(b);
            if(b){
                $('.rmbtx').addClass('bottomon');
                $('.rmbxh').removeClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
                $('.nut-two').hide();
            }
            
        })
	
});
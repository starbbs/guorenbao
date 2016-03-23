//require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
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

        //点击-银行卡表单
        $('.bankIdCard').click(function(){
            $('.one').css('display','none');
            $('.two').css('display','flex');
        });
        //校验银行账户
        var btnConfirm = false;
        $('.bankAccount').blur(function(){
            var reg = /^(\d{16}|\d{19})$/;
            var bankAccount = $.trim($('.bankAccount').val());
            if(!reg.exec(bankAccount) || !bankAccount){
                $('.msg-bankAccount').show().text('请输入正确的银行账号');
                btnConfirm = false;
            }else{
                btnConfirm = true;
                $('.msg-bankAccount').hide();
            }
        });

        //全国省市二级联动下拉选择菜单
        first("selectp","selectc","form1",0,0);
        
        //校验开户支行
        $('.bankIp-select').blur(function(){
            var bankIp = $.trim($(this).val());
            var reg = /^[\u4e00-\u9fa5]+$/;   
            if(!bankIp || !reg.test(bankIp)){
                btnConfirm = false;
                $('.msg-bankIp').show().text('请输入正确的开户支行地址');
            }else{
                btnConfirm = true;
                $('.msg-bankIp').hide();
            }
        });
        //校验支付密码
        $('.pay-pwd').blur(function(){
            var payPwd = $.trim($(".pay-pwd").val());
            var reg = /^[0-9a-zA-Z]{6,12}$/;
            if(!reg.test(payPwd)){
                btnConfirm = false;
                $('.msg-pay-pwd').show().text('请输入正确的支付密码');
            }else{
                btnConfirm = true;
                $('.msg-pay-pwd').hide();
            }
        });

        //校验验证码
        $('.regist_rg_input-VerificationCode').blur(function(){
            var code = $.trim($(this).val());
            if(!code){
                btnConfirm = false;
                $('.msg-VerificationCode').show().text('请输入正确的验证码');
            }else{
                btnConfirm = true;
                $('.msg-VerificationCode').hide();
            }
        });

        //点击-确认添加银行卡
        $('.confirmAdd').click(function(){
            if(btnConfirm == false){
                alert('请填写完整信息');
            }else{
                $('.two').css('display','none');
                $('.three').css('display','flex');
                //填写表单-生成银行卡 
                $('.bankName').text('中国工商银行');
                var bankAccount = $('.bankAccount').val();
                $('.bankIdCard-Code').text('尾号:'+bankAccount.substr(bankAccount.length-4));
            }            
        });
        //再次添加银行卡
        $('.bankIdCard').click(function(){
            $('.three').css('display','none');
            $('.two').css('display','flex');
        });



            

    });

	
//});
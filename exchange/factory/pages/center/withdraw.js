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
        $('.bankIdCard-addCard').click(function(){
            $(this).css('display','none');
            $('.addCardForm').css('display','flex');
        });
        //校验银行账户
        var btnConfirm;
        $('.bankAccount').blur(function(){
            var reg = /^(\d{16}|\d{19})$/;
            var bankAccount = $('.bankAccount').val();
            if(!reg.exec(bankAccount) || !bankAccount){
                $('.msg-bankAccount').show().text('请输入正确的银行账号');
                btnConfirm = false;
            }else{
                btnConfirm = true;
            }
        });

        //全国省市二级联动下拉选择菜单
        first("selectp","selectc","form1",0,0);
        
    });

	
//});
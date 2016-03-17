//require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	//mkt_info.get();
    $(function(){
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
        });
        
    });

	
//});
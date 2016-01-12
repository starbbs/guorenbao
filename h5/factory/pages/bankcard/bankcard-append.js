
// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 银行卡信息

define('h5-bankcard-append', ['router','api','h5-view','h5-bankcard-ident','h5-ident', 'h5-text'], function(router,api,View,bankcard_ident) {    
    var gopToken = $.cookie('gopToken');
	var bankcard_append = new View('bankcard-append');
	var vm=bankcard_append.vm = avalon.define({
		$id: 'bankcard-append',	
		cardNo:'',
		bankName:'',
		cardTypeStr:'',
		cardType:'',
		checked:true,
		phone:'',
		phoneStr:'',
		identifyingCode:'',
        check: function(e) {
        	if(this.value.length>15){
        		 api.checkBankCard({
                 	bankCard:this.value
             	}, function(data) {
             		if (data.status == 200) {
             			vm.bankName=data.data.bankName;
             			vm.cardType=data.data.cardType;
             			if(data.data.cardType='SAVINGS_DEPOSIT_CARD'){
             				vm.cardTypeStr='储蓄卡';
         				}else{
         					vm.cardTypeStr='信用卡';
         				}
             			vm.checked=true;
             		} else {
             			console.log(data);
             		}
             	});
        	}         
        },        
        bankcard_add_next_click:function(){
            if (vm.bankName) {
                var nowData={};
	            nowData.gopToken=gopToken;
	            nowData.bankName=vm.bankName;
	            nowData.cardNo=vm.cardNo;
	            nowData.phone=vm.phone;
	            nowData.phoneStr=vm.phoneStr;
	            nowData.cardType=vm.cardType;
	            nowData.callback=callback;
	            $.extend(bankcard_ident.vm, nowData); 
	            router.go('/view/bankcard-ident'); 
            };       	 
        }
	});

	var callback=function(){
		vm.callback();
	}
	return bankcard_append;
});


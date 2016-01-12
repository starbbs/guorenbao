
// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 银行卡信息

define('h5-bankcard-detail', ['api','h5-view'], function(api,View) {    
    var gopToken = $.cookie('gopToken');
	var bankcard_detail = new View('bankcard-detail');
	var vm=bankcard_detail.vm = avalon.define({
		$id: 'bankcard-detail',	
		cardNo:'',
		bankName:'',
		cardTypeStr:'',
		cardType:'',
		phone:'',
		phoneStr:'',
		cardId:0,
		createTime:'',
		bankDataDic:'',
        back_click: function() {
        	if (vm.callback) {
				vm.callback();
			};    
        },        
        del_click:function(){
        	api.bankcardDel({
        		gopToken: gopToken,
        		cardId:vm.cardId
        	}, function(data) {
        		if (data.status == 200) {
        			$.alert('解绑成功');
        			if (vm.callback) {
        				vm.callback();
        			};
        		} else {
        			console.log(data);
        		}
        	});
        }
	});
	return bankcard_detail;
});


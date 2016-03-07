// 余效俭 2016-01-08 8:58:22 创建
// H5微信端 --- 添加银行卡


define('h5-bankcard-append', ['router', 'api', 'check', 'h5-view', 'h5-bankcard-ident', 'h5-ident', 'h5-text'], function(router, api, check, View, bankcard_ident) {

	var gopToken = $.cookie('gopToken');

	var bankcard_append = new View('bankcard-append');

	var _validBankList;  		 //存放后台传过来支持的银行类型
	api.static(function(data){	
		if(data.status==200){
			console.log(data.data.validBankList);
			_validBankList = data.data.validBankList;
		}
	});							//判断用户的卡号是否在支持的银行类型中
	var checkValidBankList = function(val){
		for(var i=0; i<_validBankList.length; i++){
			if(val === _validBankList[i]){
				return true;
			}
		}
		return false;
	};

	var vm = bankcard_append.vm = avalon.define({
		$id: 'bankcard-append',
		cardNo: '',                
		bankName: '',
		cardTypeStr: '',
		cardType: '',
		checked: true,
		phone: '',
		phoneStr: '',
		identifyingCode: '',
		callback: $.noop,
		check: function(e) {	//添加银行卡第一步  卡号检测				
			if (check.cardCondition(this.value)) {//检测卡位数	16或19位
				api.checkBankCard({//检测银行卡类型
					bankCard: this.value
				}, function(data) {
					if (data.status == 200) {
						vm.bankName = data.data.bankName;
						vm.cardType = data.data.cardType;
						if (data.data.cardType == 'SAVINGS_DEPOSIT_CARD') {//储蓄 || 信用卡
							vm.cardTypeStr = '储蓄卡';
							var reg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
							if (reg.test(vm.phone)) {
								vm.checked = false;  //手机号码初步正确
							} else {
								vm.checked = true;
							}
							if(!checkValidBankList(vm.bankName)){//在上面数组中查找是否支持输入的银行卡
								vm.checked = true;
								$.alert('抱歉，暂不支持本张银行卡，请更换一张');
							}
						}else{
							vm.cardTypeStr = '信用卡';
							vm.checked = true;
							$.alert('抱歉，暂不支持信用卡支付，请更换一张');
						}
						$('.banknameAndcardtypestr').text(vm.bankName + 　' ' + 　vm.cardTypeStr);
					} else {
						$('.banknameAndcardtypestr').text('请输入正确的卡号');
						vm.checked = true;
					}
				});
			}
		},
		clear:function(name){
			vm[name]='';
			vm.checked = true;
		},
		checkPhone: function(e) {
			var reg = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
			if (reg.test(this.value) && checkValidBankList(vm.bankName) &&vm.cardTypeStr !='信用卡') {
				vm.checked = false;
			} else {
				vm.checked = true;
			}
		},
		bankcard_add_next_click: function() {
			if (!vm.checked){
				vm.checked = true;
				$.alert('校验中，请稍后！');
				//验证预留手机号是否正确
				api.checkBankPhone({
						gopToken:gopToken,
						cardNo:vm.cardNo,
						bankPhone:vm.phone
					},function(data){
						if(data.status==200){
							$.extend(bankcard_ident.vm, {
								gopToken: gopToken,
								bankName: vm.bankName,
								cardNo: vm.cardNo,
								phone: vm.phone,
								phoneStr: vm.phoneStr,
								cardType: vm.cardType,
								callback: function() {
									vm.callback();
								},
							});
							vm.checked = false;
							router.go('/view/bankcard-ident');							
						}else{
							$.alert('手机号预留不正确，请重新输入');
						}
				});
			}else{
				if(!vm.checked){
					$.alert('不支持此银行类型或输入卡号错误');
					vm.checked = true;
				}
			}
		}
	});
	/*
		{
		"gopToken" : "7ea593562e3547e792985f6884f793d6"，
	        "cardNo":"3205332334566",
	        "bankPhone":"15895623333"
		}
	*/
	bankcard_append.on('hide', function() {
		vm.cardNo = '';
		vm.phone = '';
		vm.bankName = '';
		vm.cardTypeStr = '';
		$('.banknameAndcardtypestr').text('');
	});
	
	return bankcard_append;
});
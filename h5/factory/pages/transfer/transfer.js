
// 余效俭 2016-01-09 20:58:22 创建
// H5微信端 --- 转果仁


require(['router','api','h5-view','h5-price','h5-view-nickname','h5-text','h5-view-authentication'], function(router,api,View,price,nickname) {
    
    router.init(true);
	var gopToken = $.cookie('gopToken');
	var transfer = $('.transfer');
	var transfer_new = new View('transfer-new');
	var transfer_contacts = new View('transfer-contacts');
	var transfer_target = new View('transfer-target');
	var transfer_bill = new View('transfer-bill');
	var vm = avalon.define({
		$id: 'transfer',	
		hasWallet:false,
		marketGopAddress:'',		
		transferOutType:'',
		gopNum:0,
		list:[],
        newTarget_click: function(e) {
        	//新目标
        	vm.transferOutType='NEW';
            router.go('/view/transfer-new');      
        },
        myWallet_click: function(e) {
        	//我的钱包
        	if (vm.hasWallet) {
        		vm.transferOutType='ME_WALLET';       		
        		api.walletList({
        			gopToken: gopToken
	        	}, function(data) {
	        		if (data.status == 200) {
	        			var nowData={};
	        			nowData.name='我的钱包';
	        			for (var i=0;i<data.data.walletList.length;i++) {
	        				var item=data.data.walletList[i]; 
	        				if(item.defaultWallet){
	        					nowData.address=item.address;
	        					nowData.walletId=item.id;
	        					break;
	        				}     				
	        			}
	        			$.extend(transfer_target, nowData);  
	        			targetInit(vm.transferOutType);
	        			router.go('/view/transfer-target');   			
	        		} else {
	        			console.log(data);
	        		}
	        	});	
        	};                 
        },
        marketWallet_click: function(e) {
        	//果仁市场
        	if (vm.marketGopAddress!='') {
        		vm.transferOutType='GOP_MARKET';
        		vm.gopAddress=vm.marketGopAddress;
        		var nowData={};
        		nowData.address=vm.marketGopAddress;
        		nowData.name='果仁市场';
        		$.extend(transfer_target, nowData); 
        		targetInit(vm.transferOutType);
        		router.go('/view/transfer-target');        
        	};
        },
        gopContact_click: function(e) {
        	//果仁宝联系人
        	vm.transferOutType='GOP_CONTACT';
           	router.go('/view/transfer-contacts');        
        },
        walletContact_click: function(e) {
        	//钱包联系人
        	vm.transferOutType='WALLET_CONTACT';
           	router.go('/view/transfer-contacts');        
        },
        transfer_click: function(e) {
        	//最近联系人
        	vm.transferOutType=$(this).attr("transferOutType");
        	vm.gopAddress=$(this).attr("address");
			var nowData={};
        	nowData.address=$(this).attr("address");
        	nowData.name=$(this).attr("name");
        	nowData.personId=$(this).attr("personId");
        	nowData.photo=$(this).attr("photo");
        	$.extend(transfer_target, nowData); 
        	targetInit(vm.transferOutType);
        	router.go('/view/transfer-target');  

        }
	});

	var transfer_new = avalon.define({
		$id: 'transfer-new',
		newTarget:'',
		new_next_click:function(e){
	        if (transfer_new.newTarget!='') {
	        	var nowData={};
	        	var  re = /^1\d{10}$/
			    if (re.test(transfer_new.newTarget)) {
			        vm.transferOutType='GOP_NEW';
			        nowData.phone=transfer_new.newTarget;
			    } else if(transfer_new.newTarget.indexOf('GOP')>=0){
			        vm.transferOutType='WALLET_NEW';
			    }
			    nowData.address=transfer_new.newTarget;
			    api.transferValidate({
        			gopToken: gopToken,
        			address:transfer_new.newTarget
	        	}, function(data) {
	        		if (data.status == 200) {
	        			nowData.name=data.data.nick;
	        			if(data.data.photo){
	        				nowData.photo=data.data.photo;
	        			}
	        		} else {
	        			console.log(data);
	        		}
	        		$.extend(transfer_target, nowData);
	        	});
			    
			    targetInit(vm.transferOutType);
	        	router.go('/view/transfer-target');        
	        }else{
	        	$.alert('地址格式错误');
	        }
    	},
	});

	
	var transfer_contacts = avalon.define({
		$id: 'transfer-contacts',
		search:'',
		list:[],
		submit: function() {
			api.person({
				contactType:vm.transferOutType,
				contactQuery: transfer_contacts.search,
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					transfer_contacts.list = dataHandler(data.data);
				} else {
					console.log(data);
				}
			});
			return false;
		},
		listClick: function(ev) {
			var item = $(ev.target).closest('.contacts-item');
			if (!item.length) { return; }
			var arr = item.get(0).dataset.path.split('/');
			var models = transfer_contacts.list[arr[0]].list[arr[1]];
			var nowData={};
			nowData.personId=models.$model.id;
			if (models.$model.phone) {
				nowData.address=models.$model.phone;
			};
			if (models.$model.address) {
				nowData.address=models.$model.address;
			};
			if (models.$model.picture) {
				nowData.photo=models.$model.picture;
			};
			if (models.$model.name) {
				nowData.name=models.$model.name;
			};			
			$.extend(transfer_target, nowData);
			targetInit(vm.transferOutType);
			router.go('/view/transfer-target'); 
		}
	});


	var transfer_target = avalon.define({
		$id: 'transfer-target',
		address: '',
		phone: '',
		name: '未命名',
		photo: './images/index-2.jpg',
		gopUserNick: '未命名',
		personId: null,
		walletId:null,
		payPassword:'123456',//支付密码
		serviceFee:0.01,//服务费
		transferNum:0,//转果仁数	
		gopNum:0,//拥有果仁数	
		price:0,//实价
		cnyMoney:0,//约合人民币
		content:'',//转账说明
		notchecked:true,//是否没有检验通过
		getCnyMoney: function(e) {
			transfer_target.cnyMoney=transfer_target.price*this.value;
			if (this.value>0 && this.value<=transfer_target.gopNum) {
				notchecked=false;
			};
		},
		transfer_commit_click: function() {
			if (transfer_target.transferNum>0 &&transfer_target.transferNum<=transfer_target.gopNum) {
				var transferOutType=vm.transferOutType;
				if (vm.transferOutType.indexOf('NEW')>0) {
					transferOutType='NEW';
				}
				api.transfer({
					gopToken: gopToken,
					transferType:transferOutType,
					personId:transfer_target.personId,
					address:transfer_target.address,
					walletId:transfer_target.walletId,
					serviceFee:parseFloat(transfer_target.serviceFee),
					content:transfer_target.content,
					transferNum:parseFloat(transfer_target.transferNum),
					payPassword:transfer_target.payPassword
				}, function(data) {
					var nowData={};
					nowData.address=transfer_target.address;
					nowData.phone=transfer_target.phone;
					nowData.name=transfer_target.name;
					nowData.photo=transfer_target.photo;
					nowData.personId=transfer_target.personId;
					nowData.walletId=transfer_target.walletId;
					nowData.serviceFee=transfer_target.serviceFee;
					nowData.transferNum=transfer_target.transferNum;
					nowData.content=transfer_target.content;
					nowData.transferOutId=data.data.transferOutId;
					if (data.status == 200) {	
						nowData.successFlag=true;					
					} else {
						nowData.successFlag=false;
						console.log(data);
					}
					$.extend(transfer_bill, nowData);
					router.go('/view/transfer-bill'); 
					transfer_bill_init(nowData);
				});
			};
		},
	});


	var transfer_bill = avalon.define({
		$id: 'transfer-bill',
		address: '',
		phone: '',
		name: '未命名',
		photo: './images/index-2.jpg',
		gopUserNick: '未命名',
		personId: null,
		walletId:null,
		serviceFee:0.01,//服务费
		transferNum:0,//转果仁数	
		content:'',//转账说明
		successFlag:true,//是否提交成功
		tradeNo:'2015110563563544101',//流水号
		stage:'half',
		transferOutId:null,
		back_click: function(e) {
			router.go('/'); 
		},
		remark_click: function(e) {
			var nowData={};
			nowData.id=transfer_bill.personId;
			$.extend(nickname.vm, nowData);
			router.go('/view/nickname'); 
		}
		
	});

	var transfer_bill_init=function(data){
		$('.bill-head').hide();
		$('.transfer-icon').hide();
		$('.bill-detail').hide();
		$('.transfer-bill-detail').hide();		
		$('.bill-get-number').removeClass("light");
		$('.bill-get-label').removeClass("light");
		$('.bill-get-label').removeClass("ash");
		

		if (vm.transferOutType=='WALLET_NEW') {
			//新钱包
			if (data.photo) {
				$('.img-w').show();
			}else{
				$('.transfer-icon-1').show();
			}
		}else if (vm.transferOutType=='GOP_NEW') {
			//新果仁宝
			if (data.photo) {
				$('.img-w').show();
			}else{
				$('.transfer-icon-1').show();
			}
		}else if (vm.transferOutType=='WALLET_CONTACT') {
			//钱包联系人
			$('.transfer-icon-5').show();
		}else if (vm.transferOutType=='GOP_CONTACT') {
			//果仁宝联系人
			$('.img-w').show();
		}else if (vm.transferOutType=='GOP_MARKET') {
			//果仁市场
			$('.transfer-icon-3').show();
		}else if (vm.transferOutType=='ME_WALLET') {
			//我的钱包
			$('.transfer-icon-2').show();
		}
		
		api.transferQuery({
			gopToken: gopToken,
			transferOutId:data.transferOutId
		}, function(datas) {
			if (datas.status == 200) {						
				 transfer_bill.personId=datas.data.transferOut.personId;
				 transfer_bill.walletId=datas.data.transferOut.walletId;
				 transfer_bill.failureMsg=datas.data.transferOut.failureMsg;
				 transfer_bill.transContent=datas.data.transferOut.transContent;
				 //transfer_bill.serviceFee=datas.data.transferOut.serviceFee;
				 // transfer_bill.address=datas.data.transferOut.address;
				 transfer_bill.status=datas.data.transferOut.status;
				 transfer_bill.updateTime=datas.data.transferOut.updateTime;
				 transfer_bill.tradeNo=datas.data.transferOut.serialNum;
				 if (transfer_bill.personId) {
				 	$('.remark').show();
				 }else{
				 	$('.remark').hide();
				 }
				 if(transfer_bill.status=='SUCCESS'){
						$('.bill-head.success').show();
						$('.bill-get-number').removeClass("light");
						$('.bill-get-label').removeClass("light");
						$('.bill-detail-success').show();
						$('.transfer-bill-desc-right').show();
						transfer_bill.stage='finish';
						$('.back').hide();
				}else if(transfer_bill.status=='PROCESSING'){
						$('.bill-head.going').show();
						$('.bill-get-number').removeClass("light");
						$('.bill-get-label').removeClass("light");
						$('.bill-detail-success').show();
						$('.transfer-bill-desc-left').show();
						transfer_bill.stage='half';
						$('.back').hide();
				}else{
						$('.bill-head.fail').show();
						$('.bill-get-number').addClass("light");
						$('.bill-get-label').addClass("light");
						$('.bill-detail-failure').show();
						$('.back').show();
					}
			} else {
				console.log(datas);
			}
		});
	}
	var dataHandler = function(data) {
		var result = {
			arr: [],
			other: []
		};
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
					name: i,
					list: data[i]
				});
			}
		};
		result.arr.sort(function(a1, a2) {
			return a1.name > a2.name;
		});
		return result.arr.concat(result.other);	
	};

	var targetInit=function(transferOutType){
		$('.transfer-target-head').hide();
		$('.transfer-target-box').hide();
		if (transferOutType=='WALLET_NEW') {
			//新钱包
			$('.wallet-address').show();
			$('.wallet').show();
		}else if (transferOutType=='GOP_NEW') {
			//新果仁宝
			$('.phone-address').show();
			$('.gop').show();
		}else if (transferOutType=='WALLET_CONTACT') {
			//钱包联系人
			$('.wallet-address').show();
			$('.wallet').show();
		}else if (transferOutType=='GOP_CONTACT') {
			//果仁宝联系人
			$('.phone-address').show();
			$('.gop').show();
		}else if (transferOutType=='GOP_MARKET') {
			//果仁市场
			$('.gop-market').show();
			$('.wallet').show();
		}else if (transferOutType=='ME_WALLET') {
			//我的钱包
			$('.my-wallet').show();
			$('.wallet').show();
		}
		//获取当前实价
		getprice();
	}

	var getprice=function(){
		price.once(setprice);
	}

	var setprice=function(price){
		var nowData={};
		nowData.price=price;
		$.extend(transfer_target, nowData);
	}
	var init=function(){
		api.info({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {						
				if(!data.data.realname){
					router.go('/view/authentication');
					setTimeout(function() {
						router.go('/view/authentication');
					});	
				}
				if(data.data.marketGopAddress){
					vm.marketGopAddress=data.data.marketGopAddress;//果仁市场地址
				}
				if(data.data.hasWallet){
					vm.hasWallet=data.data.hasWallet;//果仁市场地址。null或空字符串都表示未设置
				}

			} else {
				console.log(data);
			}
		});

		api.getGopNum({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {						
				if(data.data.gopNum){
					vm.gopNum=data.data.gopNum;//果仁数量
					transfer_target.gopNum=data.data.gopNum;//果仁数量
				}
			} else {
				console.log(data);
			}
		});
		
		api.transferRecent({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {							
				for (var i=0;i<data.data.transferOutList.length;i++) {
	        		var item=data.data.transferOutList[i];
	        		if (item.phone) {
	        			item.address=item.phone;
	        		}; 
	        		if (item.address) {
	        			item.address=item.address;
	        		}; 
	        		vm.list.push(item);	   				
	        	}
	        	
			} else {
				console.log(data);
			}
		});
	}
	
	
	avalon.scan();
	
	init();
	
	setTimeout(function() {
		transfer.addClass('on');
	});	
		
});


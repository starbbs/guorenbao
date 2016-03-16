// 余效俭 2016-01-09 20:58:22 创建
// H5微信端 --- 转果仁


require(['router', 'api', 'h5-view', 'h5-price', 'get', 'filters',
	'h5-view-nickname', 'h5-view-address-mine', 'h5-view-address-wallet', 'h5-view-bill',
	'h5-dialog-paypass', 'h5-view-authentication',
	'h5-text', 'h5-weixin'
], function(router, api, View, price, get, filters,
	nickname, address_mine, address_wallet, billView,
	dialogPaypass, viewAuthentication) {

	router.init();

	var gopToken = $.cookie('gopToken');
	var transfer = $('.transfer');

	var transferNewView = new View('transfer-new');
	var transferContactsView = new View('transfer-contacts');
	var transferTargetView = new View('transfer-target');

	var vm = avalon.define({
		$id: 'transfer',
		hasWallet: false,
		marketGopAddress: '',
		transferOutType: '',
		gopNum: 0,
		list: [],
		newTargetClick: function() { // 新目标
			vm.transferOutType = 'NEW';
			transferNew.newTarget = '';
			router.go('/view/transfer-new');
		},
		myWalletClick: function() { // 我的钱包
			if (vm.hasWallet) {
				vm.transferOutType = 'ME_WALLET';
				api.walletList({
					gopToken: gopToken
				}, function(data) {
					if (data.status == 200) {
						var nowData = {};
						nowData.name = '我的钱包';
						for (var i = 0; i < data.data.walletList.length; i++) {
							var item = data.data.walletList[i];
							if (!nowData.address) {
								nowData.address = item.address;
								nowData.walletId = item.id;
							}
							if (item.defaultWallet) {
								nowData.address = item.address;
								nowData.walletId = item.id;
								break;
							}
						}
						$.extend(transferTarget, nowData);
						targetInit(vm.transferOutType);
						router.go('/view/transfer-target');
					} else {
						console.log(data);
					}
				});
			} else {
				//跳转到钱包地址
				address_wallet.vm.hasStepNext = true;
				address_wallet.vm.callback = function() {
					init();
					vm.transferOutType = 'ME_WALLET';
					api.walletList({
						gopToken: gopToken
					}, function(data) {
						if (data.status == 200) {
							var nowData = {};
							nowData.name = '我的钱包';
							for (var i = 0; i < data.data.walletList.length; i++) {
								var item = data.data.walletList[i];
								if (!nowData.address) {
									nowData.address = item.address;
									nowData.walletId = item.id;
								}
								if (item.defaultWallet) {
									nowData.address = item.address;
									nowData.walletId = item.id;
									break;
								}
							}
							$.extend(transferTarget, nowData);
							//targetInit(vm.transferOutType);
							targetInit('new_walletaddress_nextstep');
							router.go('/view/transfer-target');
						} else {
							console.log(data);
						}
					});
					//targetInit(vm.transferOutType);
					//targetInit('new_walletaddress_nextstep');
					//router.go('/view/transfer-target');
				}
				router.go('/view/address-wallet');
			}
		},
		marketWalletClick: function() { // 果仁市场
			if (vm.marketGopAddress != '') {
				vm.transferOutType = 'GOP_MARKET';
				vm.gopAddress = vm.marketGopAddress;
				transferTarget.address = vm.marketGopAddress;
				transferTarget.name = '果仁市场';
				transferTarget.isMarket = true;
				targetInit(vm.transferOutType);
				router.go('/view/transfer-target');
			} else {
				//跳转到设置果仁市场
				address_mine.vm.hasStepNext = true;
				address_mine.vm.callback = function() {
					api.info({
						gopToken: gopToken
					}, function(data) {
						if (data.status == 200) {
							if (data.data.marketGopAddress) {
								vm.marketGopAddress = data.data.marketGopAddress; //果仁市场地址
								vm.transferOutType = 'GOP_MARKET';
								vm.gopAddress = vm.marketGopAddress;
								transferTarget.address = vm.marketGopAddress;
								transferTarget.name = '果仁市场';
								transferTarget.isMarket = true;
								targetInit(vm.transferOutType);
								router.go('/view/transfer-target');
							}
						} else {
							console.log(data);
						}
					});
				}
				router.go('/view/address-mine');
			}
		},
		gopContactClick: function() { // 果仁宝联系人
			vm.transferOutType = 'GOP_CONTACT';
			router.go('/view/transfer-contacts');
			transferContacts.query();
		},
		walletContactClick: function() { // 钱包联系人
			vm.transferOutType = 'WALLET_CONTACT';
			router.go('/view/transfer-contacts');
			transferContacts.query();
		},
		transferClick: function(event) { // 最近联系人
			var item = vm.list.$model[$(event.target).closest('.transfer-item').get(0).dataset.index];
			vm.transferOutType = item.type;
			transferTarget.walletId = item.walletId;
			transferTarget.address = vm.gopAddress = item.phone || item.address;
			transferTarget.name = item.name;
			transferTarget.personId = item.personId;
			transferTarget.photo = item.photo;
			transferTarget.phone = item.phone;
			targetInit(vm.transferOutType);
			router.go('/view/transfer-target');
		},
	});


	var transferNew = avalon.define({ // 转帐第一步
		$id: 'transfer-new',
		newTarget: '',
		checked: true,
		internalGopAddress: '',
		newguorentype: false,
		check: function() {
			if (this.value.length != 11 && this.value.length != 67 && this.value.length != 68) {
				transferNew.checked = true;
			} else if (this.value.length == 11) {
				var reg = /^0?1[3|4|5|8\7][0-9]\d{8}$/;
				if (!reg.test(this.value)) {
					transferNew.checked = true;
				} else {
					transferNew.checked = false;
					transferNew.newguorentype = false;
				}
			} else if (this.value.indexOf('GOP') != -1) {
				transferNew.checked = false;
				transferNew.newguorentype = true;
			} else {
				transferNew.checked = true;
			}
			if (transferNew.checked) {
				$(this).addClass("error");
			} else {
				$(this).removeClass("error");
			}
		},
		//转到新目标   添加新目标(钱包地址或手机号)  的下一步操作
		newNextClick: function() {
			if (transferNew.checked) {
				return;
			}
			if (transferNew.newTarget == '') {
				$.alert('手机号或地址为空');
				return;
			} else if (transferNew.newTarget.length == 11) {
				var reg = /^0?1[3|4|5|8\7][0-9]\d{8}$/;
				if (!reg.test(transferNew.newTarget)) {
					$.alert('该手机号格式不正确');
					return;
				}
			} else if (transferNew.newTarget.length == 67 || transferNew.newTarget.length == 68) {
				if (transferNew.newTarget.indexOf('GOP') != 0) {
					$.alert('该地址格式不正确');
					return;
				}
			} else {
				$.alert('手机号或地址格式不正确');
				return;
			}

			if (transferNew.newTarget != '') {
				var nowData = {};
				var re = /^1\d{10}$/
				if (re.test(transferNew.newTarget)) {
					vm.transferOutType = 'GOP_NEW';
					nowData.phone = transferNew.newTarget;
				} else if (transferNew.newTarget.indexOf('GOP') >= 0) {
					vm.transferOutType = 'WALLET_NEW';
				}
				nowData.address = transferNew.newTarget;
				api.transferValidate({
					gopToken: gopToken,
					address: transferNew.newTarget
				}, function(data) {
					if (data.status == 200) {
						if (data.data) {
							if (data.data.photo) {
								nowData.photo = data.data.photo;
							}
							if (data.data.phone) { //果仁宝联系人
								nowData.addressToPhone = data.data.phone;
								nowData.phone = data.data.phone;
								vm.transferOutType = 'GOP_NEW';
							}
							if (re.test(transferNew.newTarget)) { //如果目标是手机号
								if (data.data.nick) {
									nowData.name = data.data.nick;
								} else {
									nowData.name = '未命名用户';
								}
							} else if (transferNew.newTarget.indexOf('GOP') >= 0) { //如果目标是钱包地址
								nowData.name = data.data.nick || '未命名用户';
							}
						} else {
							nowData.name = "未命名地址";
						}
						$.extend(transferTarget, nowData);
						targetInit(vm.transferOutType);
						router.go('/view/transfer-target');
					} else if (data.status == 400) { // 手机号未注册 或 不能给自己转账
						$.alert(data.msg);
					} else {
						if (transferNew.newTarget.length == 11) {
							$.alert('该手机号未注册');
						} else {
							nowData.name = "未命名地址";
							$.extend(transferTarget, nowData);
							targetInit(vm.transferOutType);
							router.go('/view/transfer-target');
						}
					}
				});
			} else {
				$.alert('地址格式错误');
			}
		},
	});


	var transferContacts = avalon.define({
		$id: 'transfer-contacts',
		search: '',
		list: [],
		submit: function() {
			transferContacts.query();
			return false;
		},
		query: function() {
			api.person({
				contactType: vm.transferOutType,
				contactQuery: transferContacts.search,
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					transferContacts.list = dataHandler(data.data);
				} else {
					console.log(data);
				}
			});
		},
		listClick: function(ev) {
			var item = $(ev.target).closest('.contacts-item');
			if (!item.length) {
				return;
			}
			var arr = item.get(0).dataset.path.split('/');
			var models = transferContacts.list[arr[0]].list[arr[1]];
			var nowData = {};
			nowData.personId = models.$model.id;
			if (models.$model.address) {
				nowData.address = models.$model.address;
				nowData.addressToPhone = models.$model.address.substr(0, 8) + '**********';
			};
			if (models.$model.phone) {
				nowData.address = models.$model.phone;
				nowData.phone = models.$model.phone;
			};
			if (models.$model.picture) {
				nowData.photo = models.$model.picture;
			};
			if (models.$model.name) {
				nowData.name = models.$model.name;
			};
			$.extend(transferTarget, nowData);
			targetInit(vm.transferOutType);
			router.go('/view/transfer-target');
		},
	});


	var transferTarget = avalon.define({ // 转帐输入金额的部分
		$id: 'transfer-target',
		address: '',
		phone: '',
		name: '未命名地址',
		photo: './images/picture.png',
		gopUserNick: '未命名',
		personId: null,
		walletId: null,
		payPassword: '123456', // 支付密码
		serviceFee: 0.01, // 服务费
		serviceFeeShow: 0.01,
		transferNum: '', // 转果仁数	
		gopNum: 0, // 拥有果仁数	
		price: 0, // 实价
		cnyMoney: 0, // 约合人民币
		content: '', // 转账说明
		notchecked: true, // 是否没有检验通过
		isMarket: false, // 是否是果仁市场
		addressToPhone: '',
		getCnyMoney: function() {
			if (this.value > 0 && this.value <= transferTarget.gopNum) {
				transferTarget.notchecked = false;
			} else {
				transferTarget.notchecked = true;
			}
			var whether_include_numrice = this.value.indexOf(".");
			if (whether_include_numrice != -1) {
				if (this.value.substring(whether_include_numrice + 1, whether_include_numrice + 4).length > 2) {
					transferTarget.transferNum = this.value.substring(0, whether_include_numrice + 3);
				}
			}
			transferTarget.cnyMoney = transferTarget.price * this.value;
		},
		//确定转帐按钮
		transferCommitClick: function() {
			if (transferTarget.transferNum > 0 && transferTarget.transferNum <= transferTarget.gopNum) {
				//密码输入框显示 AJAX密码确认后 设置回调函数
				dialogPaypass.show();
				dialogPaypass.vm.callback = function(value) {
					var transferOutType = vm.transferOutType;
					if (vm.transferOutType.indexOf('NEW') > 0) {
						transferOutType = 'NEW';
						transferTarget.serviceFee = 0;
					}
					api.transfer({
						gopToken: gopToken,
						transferType: transferOutType,
						personId: transferTarget.personId,
						address: transferTarget.address,
						walletId: transferTarget.walletId,
						serviceFee: parseFloat(transferTarget.serviceFee),
						content: transferTarget.content,
						transferNum: parseFloat(transferTarget.transferNum),
						payPassword: value
					}, function(data) { // 转账成功
						console.log(data);
						if (data.status == 200) {
							var nowData = {};
							nowData.successFlag = true;
							if (transferTarget.address) {
								if (transferTarget.address.length == 11) { //手机钱包
									nowData.address = transferTarget.address.substr(0, 3) + '****' + transferTarget.address.substr(7, 4);
								} else { //钱包地址
									nowData.address = transferTarget.address.substr(0, 8) + '**********';
								}
							};
							if (transferTarget.phone) {
								nowData.phone = transferTarget.phone;
							}
							router.to('/view/bill');
							billView.set('TRANSFER_OUT', data.data.transferOutId, {
								ifReturnHome: true
							});
							init();
						} else {
							console.log(data);
							$.alert(data.msg);
						}
					});
				};
			} else {
				if (transferTarget.transferNum < 0) {
					$.alert('请输入大于0的数');
				}
				if (transferTarget.gopNum <= 0) {
					$.alert('您的果仁币为0');
				}
			}
		},
	});
	var dataHandler = function(data) {
		var result = {
			arr: [],
			other: []
		};
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
					name: i !== 'Other' ? i : '其他',
					list: data[i]
				});
			}
		};
		result.arr.sort(function(a1, a2) {
			return a1.name > a2.name;
		});
		return result.arr.concat(result.other);
	};
	var targetInit = function(transferOutType) {
		transferTarget.transferNum = ''; // 转果仁数
		transferTarget.cnyMoney = 0; // 约合人民币
		transferTarget.content = ''; // 转账说明
		transferTarget.notchecked = true; // 是否没有检验通过
		$('.transfer-target-head').hide();
		$('.transfer-target-box').hide();
		if (transferOutType === 'WALLET_NEW') { // 新钱包
			$('.wallet-address').show();
			$('.wallet').show();
		} else if (transferOutType === 'GOP_NEW') { // 新果仁宝
			$('.phone-address').show();
			$('.gop').show();
		} else if (transferOutType === 'WALLET_CONTACT') { //钱包联系人
			$('.wallet-address').show();
			$('.wallet').show();
		} else if (transferOutType === 'GOP_CONTACT') { // 果仁宝联系人
			$('.phone-address').show();
			$('.gop').show();
		} else if (transferOutType === 'GOP_MARKET') { // 果仁市场
			$('.gop-market').show();
			$('.wallet').show();
		} else if (transferOutType === 'ME_WALLET') { // 我的钱包
			$('.my-wallet').show();
			$('.wallet').show();
		} else if (transferOutType === 'new_walletaddress_nextstep') { // 我的钱包
			$('.my-wallet').show();
			$('.wallet').show();
		}
		getprice();
	};
	var getprice = function() { // 获取当前实价
		price.once(function(next) {
			transferTarget.price = next;
		});
	};

	var init = function() {
		api.info({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				if (!data.data.realname) {
					setTimeout(function() {
						viewAuthentication.vm.callback = function() {
							router.to('/');
							return true;
						}
						viewAuthentication.vm.callbackFlag = true;
						viewAuthentication.show();
						// router.to('/view/authentication');
					}, 100);
				}
				if (data.data.marketGopAddress) {
					vm.marketGopAddress = data.data.marketGopAddress; //果仁市场地址
				}
				if (data.data.hasWallet) {
					vm.hasWallet = data.data.hasWallet; //果仁市场地址。null或空字符串都表示未设置
				}
			} else {
				console.log(data);
			}
		});
		api.getGopNum({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				if (data.data.gopNum) {
					transferTarget.gopNum = vm.gopNum = filters.floorFix(data.data.gopNum); //果仁数量
				}
			} else {
				console.log(data);
			}
		});
		refresh_list();
	};
	var refresh_list = function() {
		api.transferRecent({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				vm.list = data.data.transferOutList;
			} else {
				console.log(data);
			}
		});
	};
	avalon.scan();

	transferTargetView.on("hide", function() {
		dialogPaypass.hide();
		transferTarget.transferNum = '';
		$('.transfer-target-box .text-input').val('');
	});
	transferTargetView.on("show", function() {
		transferTarget.transferNum = '';
		$('.transfer-target-box .text-input').val('');
	});

	init();

	setTimeout(function() {
		transfer.addClass('on');
		if (get.data.from === 'contact') {
			var data = $.cookie('gop_contact');
			if (data) {
				data = JSON.parse(data); //联系人数据
				transferTarget.address = data.address;
				transferTarget.name = data.name;
				transferTarget.personId = data.id;
				transferTarget.photo = data.picture;
				transferTarget.phone = data.phone;
				if (data.type === "guoren") {
					vm.transferOutType = "GOP_CONTACT";
				}
				if (data.type === "wallet") {
					vm.transferOutType = "GOP_MARKET";
				}
				targetInit(vm.transferOutType);
				router.to('/view/transfer-target');
			} else {
				api.log('cookie中并没有联系人数据');
			}
		}
	}, 100);
});
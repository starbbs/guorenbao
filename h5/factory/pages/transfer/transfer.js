// 余效俭 2016-01-09 20:58:22 创建
// H5微信端 --- 转果仁


require(['router', 'api', 'h5-view', 'h5-price', 'get',
	'h5-view-nickname', 'h5-view-address-mine', 'h5-view-address-wallet', 'h5-view-bill',
	'h5-dialog-paypass',
	'h5-text', 'h5-view-authentication', 'h5-weixin'
], function(router, api, View, price, get,
	nickname, address_mine, address_wallet, billView,
	dialogPaypass) {

	router.init(true);

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
		newTargetClick: function(e) { //新目标
			vm.transferOutType = 'NEW';
			transferNew.newTarget = '';
			router.go('/view/transfer-new');
		},
		myWalletClick: function(e) { //我的钱包
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
						$.extend(transfer_target, nowData);
						targetInit(vm.transferOutType);
						router.go('/view/transfer-target');
					} else {
						console.log(data);
					}
				});
			} else {
				//跳转到钱包地址
				address_wallet.vm.hasStepNext = false;
				address_wallet.vm.callback = function() {
					init();
					//router.go('/');
					console.log('dddddddd');

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
							$.extend(transfer_target, nowData);
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
		marketWalletClick: function(e) {
			//果仁市场
			if (vm.marketGopAddress != '') {
				vm.transferOutType = 'GOP_MARKET';
				vm.gopAddress = vm.marketGopAddress;
				var nowData = {};
				nowData.address = vm.marketGopAddress;
				nowData.name = '果仁市场';
				nowData.isMarket = true;
				$.extend(transfer_target, nowData);
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
								var nowData = {};
								nowData.address = vm.marketGopAddress;
								nowData.name = '果仁市场';
								nowData.isMarket = true;
								$.extend(transfer_target, nowData);
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
		gopContactClick: function(e) {
			//果仁宝联系人
			vm.transferOutType = 'GOP_CONTACT';
			router.go('/view/transfer-contacts');
			transfer_contacts.query();
		},
		walletContact_click: function(e) {
			//钱包联系人
			vm.transferOutType = 'WALLET_CONTACT';
			router.go('/view/transfer-contacts');
			transfer_contacts.query();
		},
		transfer_click: function(e) {
			//最近联系人
			vm.transferOutType = $(this).attr("transferOutType");
			vm.gopAddress = $(this).attr("address");
			var nowData = {};
			nowData.address = $(this).attr("address");
			nowData.name = $(this).attr("name");
			nowData.personId = $(this).attr("personId");
			nowData.photo = $(this).attr("photo");
			$.extend(transfer_target, nowData);
			targetInit(vm.transferOutType);
			router.go('/view/transfer-target');

		}
	});

	var transferNew = avalon.define({
		$id: 'transfer-new',
		newTarget: '',
		checked: true,
		internalGopAddress: '',
		newguorentype: false,
		check: function(e) {
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
		new_next_click: function(e) {
			if (transferNew.newTarget == '') {
				$.alert("手机号或地址为空");
				return;
			} else if (transferNew.newTarget.length == 11) {
				var reg = /^0?1[3|4|5|8\7][0-9]\d{8}$/;
				if (!reg.test(transferNew.newTarget)) {
					$.alert("该手机号格式不正确");
					return;
				}
			} else if (transferNew.newTarget.length == 67 || transferNew.newTarget.length == 68) {
				if (transferNew.newTarget.indexOf('GOP') != 0) {
					$.alert("该地址格式不正确");
					return;
				}
			} else {
				$.alert("该地址格式不正确");
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
						//console
						if (data.data) {
							if (data.data.photo) {
								nowData.photo = data.data.photo;
							}
							if (data.data.phone) {
								nowData.address_to_phone = data.data.phone;
							}
							if (re.test(transferNew.newTarget)) {
								if (data.data.nick) {
									nowData.name = data.data.nick;
									console.log("nowData.name" + nowData.name);
								} else {
									nowData.name = "未命名用户";
								}
							} else if (transferNew.newTarget.indexOf('GOP') >= 0) {
								if (data.data.nick) {
									nowData.name = data.data.nick;
									console.log("nowData.name" + nowData.name);
								} else {
									nowData.name = "未命名地址";
								}
							}
						} else {
							nowData.name = "未命名地址";
						}
						$.extend(transfer_target, nowData);
						targetInit(vm.transferOutType);
						router.go('/view/transfer-target');
					} else if (data.status == 400) {
						// 手机号未注册 或 不能给自己转账
						$.alert(data.msg);
					} else {
						if (transferNew.newTarget.length == 11) {
							$.alert('该手机号未注册');
						} else {
							nowData.name = "未命名地址";
							$.extend(transfer_target, nowData);
							targetInit(vm.transferOutType);
							router.go('/view/transfer-target');
						}
						console.log(data);
					}
				});
			} else {
				$.alert('地址格式错误');
			}
		},
	});
	var transfer_contacts = avalon.define({
		$id: 'transfer-contacts',
		search: '',
		list: [],
		submit: function() {
			transfer_contacts.query();
			return false;
		},
		query: function() {
			api.person({
				contactType: vm.transferOutType,
				contactQuery: transfer_contacts.search,
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					transfer_contacts.list = dataHandler(data.data);
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
			var models = transfer_contacts.list[arr[0]].list[arr[1]];
			var nowData = {};
			nowData.personId = models.$model.id;
			if (models.$model.address) {
				nowData.address = models.$model.address;
			};
			if (models.$model.phone) {
				nowData.address = models.$model.phone;
			};
			if (models.$model.picture) {
				nowData.photo = models.$model.picture;
			};
			if (models.$model.name) {
				nowData.name = models.$model.name;
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
		name: '未命名地址',
		photo: './images/picture.png',
		gopUserNick: '未命名',
		personId: null,
		walletId: null,
		payPassword: '123456', //支付密码
		serviceFee: 0.01, //服务费
		serviceFeeShow: 0.01,
		transferNum: '', //转果仁数	
		gopNum: 0, //拥有果仁数	
		price: 0, //实价
		cnyMoney: 0, //约合人民币
		content: '', //转账说明
		notchecked: true, //是否没有检验通过
		isMarket: false, //是否是果仁市场
		address_to_phone: '',
		getCnyMoney: function(e) {
			if (this.value > 0 && this.value <= transfer_target.gopNum) {
				transfer_target.notchecked = false;
			} else {
				transfer_target.notchecked = true;
			}
			var whether_include_numrice = this.value.indexOf(".");
			if (whether_include_numrice != -1) {
				if (this.value.substring(whether_include_numrice + 1, whether_include_numrice + 4).length > 2) {
					transfer_target.transferNum = this.value.substring(0, whether_include_numrice + 3);
				}
			}
			transfer_target.cnyMoney = transfer_target.price * this.value;
		},
		commit_send: function() {},
		transfer_commit_click: function() {
			if (transfer_target.transferNum > 0 && transfer_target.transferNum <= transfer_target.gopNum) {
				dialogPaypass.show();
				dialogPaypass.vm.callback = function(value) {
					var transferOutType = vm.transferOutType;
					if (vm.transferOutType.indexOf('NEW') > 0) {
						transferOutType = 'NEW';
						transfer_target.serviceFee = 0;
					}
					api.transfer({
						gopToken: gopToken,
						transferType: transferOutType,
						personId: transfer_target.personId,
						address: transfer_target.address,
						walletId: transfer_target.walletId,
						serviceFee: parseFloat(transfer_target.serviceFee),
						content: transfer_target.content,
						transferNum: parseFloat(transfer_target.transferNum),
						payPassword: value
					}, function(data) {
						if (data.status == 200) {
							var nowData = {};
							nowData.successFlag = true;
							if (transfer_target.address) {
								if (transfer_target.address.length == 11) {
									nowData.address = transfer_target.address.substr(0, 3) + '****' + transfer_target.address.substr(7, 4);
								} else {
									nowData.address = transfer_target.address.substr(0, 8) + '**********';
								}
							};
							if (transfer_target.phone) {
								nowData.phone = transfer_target.phone;
							}
							router.to('/view/bill');
							billView.set('TRANSFER_OUT', data.data.transferOutId, {
								ifReturnHome: true
							});
						} else {
							console.log(data);
							$.alert(data.msg);
						}
					});
				};
			} else {
				if (transfer_target.transferNum < 0) {
					$.alert('请输入大于0的数');
				}
				if (transfer_target.gopNum <= 0) {
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
		transfer_target.transferNum = ''; //转果仁数
		transfer_target.cnyMoney = 0; //约合人民币
		transfer_target.content = ''; //转账说明
		transfer_target.notchecked = true, //是否没有检验通过
			$('.transfer-target-head').hide();
		$('.transfer-target-box').hide();
		if (transferOutType == 'WALLET_NEW') {
			//新钱包
			$('.wallet-address').show();
			$('.wallet').show();
		} else if (transferOutType == 'GOP_NEW') {
			//新果仁宝
			$('.phone-address').show();
			$('.gop').show();
		} else if (transferOutType == 'WALLET_CONTACT') {
			//钱包联系人
			$('.wallet-address').show();
			$('.wallet').show();
		} else if (transferOutType == 'GOP_CONTACT') {
			//果仁宝联系人
			$('.phone-address').show();
			$('.gop').show();
		} else if (transferOutType == 'GOP_MARKET') {
			//果仁市场
			$('.gop-market').show();
			$('.wallet').show();
		} else if (transferOutType == 'ME_WALLET') {
			//我的钱包
			$('.my-wallet').show();
			$('.wallet').show();
		} else if (transferOutType == 'new_walletaddress_nextstep') {
			//我的钱包
			$('.my-wallet').show();
			$('.wallet').show();
		}
		//获取当前实价
		getprice();
	};
	var getprice = function() {
		price.once(setprice);
	};
	var setprice = function(price) {
		var nowData = {};
		nowData.price = price;
		$.extend(transfer_target, nowData);
	};
	var init = function() {
		api.info({
			gopToken: gopToken
		}, function(data) {
			if (data.status == 200) {
				if (!data.data.realname) {
					setTimeout(function() {
						router.to('/view/authentication');
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
					vm.gopNum = data.data.gopNum; //果仁数量
					transfer_target.gopNum = data.data.gopNum; //果仁数量
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
				vm.list.clear();
				for (var i = 0; i < data.data.transferOutList.length; i++) {
					var item = data.data.transferOutList[i];
					if (item.type == 'WALLET_NEW') {
						if (item.photo) {
							$('.img-w-' + data.personId).show();
						} else {
							item.icon = '1';
							$('.img-w-' + data.personId).hide();
						}
					} else if (item.type == 'GOP_NEW') { //新果仁宝
						if (item.photo) {
							$('.img-w-' + data.personId).show();
						} else {
							item.icon = '1';
							$('.img-w-' + data.personId).hide();
						}
					} else if (item.type == 'WALLET_CONTACT') { //钱包联系人
						item.icon = '5';;
					} else if (item.type == 'GOP_CONTACT') { //果仁宝联系人
						if (item.photo) {
							$('.img-w-' + data.personId).show();
						} else {
							item.icon = '5';
							$('.img-w-' + data.personId).hide();
						}
						if (item.name) {
							item.name = item.name;
						} else {
							item.name = '未命名用户';
						}
					} else if (item.type == 'GOP_MARKET') { //果仁市场
						item.icon = '3';
					} else if (item.type == 'ME_WALLET') { //我的钱包
						item.icon = '2';
					}

					if (item.photo) {
						$('.img-w-' + data.personId).show();
					} else {
						item.icon = '5';
						$('.img-w-' + data.personId).hide();
					}
					if (item.name) {
						item.name = item.name;
					} else {
						item.name = '未命名用户';
					}

					if (item.phone) {
						item.phone = item.phone;
						item.address = item.phone;
					} else {
						item.address = item.address;
					}
					if (item.address) {
						if (item.address.length == 11) {
							item.addressStr = item.address.substr(0, 3) + '****' + item.address.substr(7, 4);

						} else if (item.address.length > 11) {
							item.addressStr = item.address.substr(0, 8) + '**********';
						}
					}
					vm.list.push(item);
				}
			} else {
				console.log(data);
			}
		});
	};
	avalon.scan();

	init();

	transferTargetView.on("hide", function() {
		dialogPaypass.hide();
		transfer_target.transferNum = '';
		$('.transfer-target-box .text-input').val('');
	});
	transferTargetView.on("show", function() {
		transfer_target.transferNum = '';
		$('.transfer-target-box .text-input').val('');
	});

	setTimeout(function() {
		transfer.addClass('on');
		if (get.data.from === 'contact') {
			var data = $.cookie('gop_contact');
			if (data) {
				data = JSON.parse(data); //联系人数据
				transfer_target.address = data.address;
				transfer_target.name = data.name;
				transfer_target.personId = data.id;
				transfer_target.photo = data.picture;
				transfer_target.phone = data.phone;
				if (data.type == "guoren") {
					vm.transferOutType = "GOP_CONTACT";
				}
				if (data.type == "wallet") {
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
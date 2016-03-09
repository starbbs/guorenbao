// 张树垚 2016-01-09 14:29:10 创建
// H5微信端 --- page-order 订单


require(['api', 'get', 'router',
		'h5-view', 'h5-bankcard-append', 'h5-view-authentication', 'h5-view-bill',
		'h5-price', 'h5-bank', 'h5-ident', 'h5-component-bill',
		'h5-dialog-bankcard', 'h5-dialog-paypass', 'h5-dialog-more',
		'h5-weixin'
	],
	function(api, get, router,
		View, viewBankcardAppend, viewAuthentication, billView,
		price, H5Bank, H5Ident, H5Bill,
		dialogBankcard, dialogPaypass, dialogMore) {

		router.init();

		var main = $('.order');
		var gopToken = $.cookie('gopToken');
		var identInput = $('#order-ident');

		var vm = avalon.define({
			$id: 'order',
			money: 0, // 总金额
			phone: '', // 要发送验证码的电话
			productDesc: '', // 订单内容
			productRealPrice: 0, // 真实价格
			gopPrice: 0, // 果仁实时价
			gopNum: 0, // 果仁数
			gopIfUse: true, // 使用果仁数
			gopUse: 0, // 使用多少果仁
			gopClick: function() { // 果仁点击
				vm.gopIfUse = !vm.gopIfUse;
				if (vm.gopIfUse) {
					vm.gopExchange();
				} else {
					vm.rmbUse = vm.money;
				}
			},
			gopMoney: 0,
			gopExchange: function() { // 换算gopMoney
				if (vm.gopNum * vm.gopPrice >= vm.money) { // 够支付
					vm.rmbUse = 0;
					vm.gopUse = vm.money / vm.gopPrice;
					vm.gopMoney = vm.money;
					// vm.ifConfirmPay = true;
				} else {
					vm.rmbUse = vm.money - vm.gopNum * vm.gopPrice;
					vm.gopUse = vm.gopNum;
					vm.gopMoney = vm.gopNum * vm.gopPrice;
					// vm.ifConfirmPay = false;
				}
			},
			rmbUse: 0, // 使用多少人民币
			bankList: [], // 银行卡列表
			bankSelect: {}, // 选择银行卡
			bankSelectName: '',
			bankSelectType: '',
			bankSelectClass: '',
			bankSelectTail: '',
			bankIndex: 0, // 选择银行卡
			bankid: 0, // 银行卡ID
			bankAdd: function() { // 添加银行卡
				viewBankcardAppend.vm.callback = function(){
					window.history.go(-2);
				};
				router.go('/view/bankcard-append');
			},
			bankShow: function() { // 显示银行卡浮层
				dialogBankcard.show();
			},
			identInput: function() { // 验证码输入
				vm.ifConfirmPay = false;
				H5Ident.bankCheck(vm.bankid, identInput, function() {
					vm.ifConfirmPay = true;
				});
			},
			ifConfirmPay: false,
			confirmPay: function() { // 确认支付
				if (!vm.ifConfirmPay) {
					return;
				}
				dialogPaypass.show();
				dialogPaypass.vm.callback = function(value) {
					// 支付密码校验成功
					api.pay({
						gopToken: gopToken, // token
						useGop: vm.gopIfUse, // 是否使用果仁
						consumeOrderId: get.data.id, // 订单id
						identifyingCode: identInput.val(), // 短信验证码
						bankCardId: vm.bankid, // 银行卡id
						payPassword: value, // 支付密码
					}, function(data) {
						if (data.status == 200) {
							router.to('/view/bill');
							billView.set('PAY', get.data.id, {
								forceStatus: 'PROCESSING',
								ifFinishButton: true
							});
						} else {
							$.alert(data.msg);
						}
					});
				};
			}
		});

		var bankSelect = function(bank) { // 处理当前显示
			bank = bank || vm.bankSelect.$model;
			vm.bankSelectName = bank.name;
			vm.bankSelectType = bank.type;
			vm.bankSelectClass = bank.lang;
			vm.bankSelectTail = bank.tail;
		};
		var bankListRefresh = function(list) { // 刷新银行卡列表
			list = H5Bank.dataHandler(list);
			dialogBankcard.vm.list = list.concat();
			vm.bankList = list.concat();
			dialogBankcard.vm.index = vm.bankIndex;
			vm.bankSelect = $.extend({}, vm.bankList.$model[vm.bankIndex]);
			vm.bankid = vm.bankSelect.id;
			bankSelect();
		};
		var bankListReturn = function() {
			vm.bankIndex = dialogBankcard.vm.index;
			vm.bankSelect = $.extend({}, vm.bankList.$model[vm.bankIndex]);
			vm.bankid = vm.bankSelect.id;
			bankSelect();
		};

		// 进入页面
		if (get.data.id) { // 有订单ID, 跳转订单详情
			api.query({
				gopToken: gopToken,
				consumeOrderId: get.data.id
			}, function(data) {
				if (data.status == 200) {
					var order = data.data.consumeOrder; // 订单信息
					var product = data.data.product; // 产品信息
					var record = data.data.recordList; // 付款记录
					if (order.status === 'PROCESSING' && !record.length) { // 进行中(未付款)
						// 打开页面
						router.to('/');
						setTimeout(function() {
							main.addClass('on');
						}, 200);
						// 刷新数据
						vm.productDesc = product.productDesc;
						vm.money = order.orderMoney;
						vm.gopPrice = data.data.gopPrice;
						vm.gopNum = data.data.gopNum;
						vm.productRealPrice = JSON.parse(product.extraContent).price;
						vm.gopExchange();
						// 银行卡相关
						if (Array.isArray(data.data.bankCardList)) {
							bankListRefresh(data.data.bankCardList);
							dialogBankcard.on('hide', function() {
								bankListReturn();
							});
							viewBankcardAppend.vm.callback = function() { // 银行卡添加回调
								api.bankcardSearch({
									gopToken: gopToken
								}, function(data) {
									if (data.status == 200) {
										bankListRefresh(data.data.list);
										setTimeout(function() {
											router.to('/');
										}, 100);
									} else {
										$.alert(data.msg);
									}
								});
							};
						}
						// 判断是否实名认证
						api.isCertification({
							gopToken: gopToken
						}, function(data) {
							if (data.status == 200) {

							} else if (data.status == 400) {
								$.alert('您尚未实名认证');
								viewAuthentication.show();
							} else {
								$.alert(data.msg);
							}
						});
						price.onChange = price.onFirstChange = function(next) {
							vm.gopPrice = next;
							vm.gopExchange();
						};
						price.get();
					} else { // 失败, 成功, 进行中(已付款)
						console.log(data.data)
						setTimeout(function() {
							// billView.set('PAY', get.data.id);
							billView.set('PAY', data.data);
							router.to('/view/bill');
						}, 10);
					}
				} else {
					$.alert(data.msg);
				}
			});
		} else {
			$.alert('缺少订单号');
		}

		switch (get.data.from) { // 判断来源
			case 'phonecharge': // 来自手机充值
				document.title = '订单-手机充值';
				break;
			case 'loverelay': // 来自爱心接力
				document.title = '订单-爱心接力'
				break;
			default: // 无来源
				document.title = '订单';
		}
		avalon.scan();
	});
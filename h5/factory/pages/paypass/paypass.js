// 张树垚 2015-12-30 16:55:15 创建
// H5微信端 --- 支付密码重置


require(['router', 'api', 'h5-view','get','h5-dialog-success', 'h5-ident', 'h5-paypass', 'h5-text', 'h5-weixin'], function(router, api, View,get,dialogSuccess) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var paypass = $('.paypass-page');

	var paypass_choose = new View('paypass-choose');
	var paypass_protection_1 = new View('paypass-protection-1');
	var paypass_protection_2 = new View('paypass-protection-2');
	var paypass_authentication = new View('paypass-authentication');
	var paypass_ident = new View('paypass-ident');
	var paypass_view_1 = new View('paypass-view-1');
	var paypass_view_2 = new View('paypass-view-2');
	var paypass_view_3 = new View('paypass-view-3');

	var vm = avalon.define({
		$id: 'paypass',
		paypass1: '',
		paypass2: '',
		paypass3: '',
		realName: '',
		Idcard: '',
		question1: '',
		question2: '',
		answer1: '',
		answer2: '',
		phone: '',
		identifyingCode: '',
		hasProtected: true,
		hasRealName: true,
		chooseUrl: '',
		checkCode_click: function() {
			if (vm.identifyingCode) {
				api.phoneIdentifyingCode({
					gopToken: gopToken,
					identifyingCode: vm.identifyingCode
				}, function(data) {
					if (data.status == 200) {
						if (vm.chooseUrl == 'paypass-protection-1') {
							api.getQuestion({
								gopToken: gopToken,
								qusetionNumber: 1
							}, function(data) {
								if (data.status == 200) {
									vm.question1 = data.data.question;
									router.go('view/paypass-protection-1');
								} else {
									console.log(data);
									$.alert("验证码错误");
								}
							});
						} else if (vm.chooseUrl == 'paypass-authentication') {
							//身份证认证				
							if (vm.realName && vm.realName != '') {
								//vm.realName = "*" + vm.realName.substr(1, vm.realName.length - 1);
								router.go('view/paypass-authentication');
							} else {
								console.log(data);
								$.alert("未实名认证,请先实名认证");
							}
						}

					} else {
						console.log(data);
						$.alert("验证码错误");
					}
				});


			} else {
				$.alert("请输入验证码");
			}
		},
		quesiotn1_click: function() {
			api.checkQuestion({
				gopToken: gopToken,
				qtNumber: 1,
				question: vm.question1,
				answer: vm.answer1
			}, function(data) {
				if (data.status == 200) {
					api.getQuestion({
						gopToken: gopToken,
						qusetionNumber: 2
					}, function(data) {
						if (data.status == 200) {
							vm.question2 = data.data.question;
							router.go('view/paypass-protection-2');
						} else {
							console.log(data);

						}
					});

				} else {
					console.log(data);
					$.alert("验证问题错误");
				}
			});
		},
		quesiotn2_click: function() {
			api.checkQuestion({
				gopToken: gopToken,
				qtNumber: 2,
				question: vm.question2,
				answer: vm.answer2
			}, function(data) {
				if (data.status == 200) {
					router.go('view/paypass-view-2');
				} else {
					console.log(data);
					$.alert("验证问题错误");
				}
			});
		},
		ident: function(view) {
			vm.chooseUrl = view;
			//身份证认证				
			api.info({
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					if (data.data.realname) {
						//vm.realName = "*" + data.data.realname.substr(1, data.data.realname.length - 1);
						vm.realName = data.data.realname;
						console.log(vm.realName);
					}
					vm.phone = data.data.phone;
					vm.identifyingCode = "";
					router.go('view/paypass-ident');
				} else {
					console.log(data);
					$.alert(data.msg);
				}
			});
		},
		authentication_click: function(e) {
			if (vm.Idcard.length == 18) {
				api.checkIDcard({
					gopToken: gopToken,
					IDcard: vm.Idcard
				}, function(data) {
					if (data.status == 200) {
						router.go('view/paypass-view-2');
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			} else {
				$.alert('身份证号码格式错误');
			}
		},
		paypass_click_1: function(e) {
			if (vm.paypass1.length == 6) {
				//验证支付密码
				api.checkPayPwd({
					gopToken: gopToken,
					payPwd: vm.paypass1
				}, function(data) {
					if (data.status == 200) {
						router.go('view/paypass-view-2');
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			}
		},
		paypass_click_2: function(e) {
			if (vm.paypass2.length == 6) {
				router.go('view/paypass-view-3');
			}
		},
		paypass_click_3: function(e) {
			if (vm.paypass2 == vm.paypass3 && vm.paypass3.length == 6) {
				api.setPayPassword({
					gopToken: gopToken,
					password: vm.paypass3
				}, function(data) {
					if (data.status == 200) {
						//$.alert('修改支付密码成功');
						//console.log("dddddddddd")
						vm.paypass1 = '';
						vm.paypass2 = '';
						vm.paypass3 = '';
						vm.Idcard = '';
						vm.identifyingCode = '';
						var successTimer = null;
						var s = 3;
						dialogSuccess.on('show',function(){
							successTimer = setInterval(function(){
								s--;
								if(s==0){
									clearInterval(successTimer);
									window.location.href = 'security.html';
									dialogSuccess.hide();
								}else{
									dialogSuccess.button.html('支付密码修改成功，请牢记，'+s+'s后自动跳转');
								}
							},1000);
						});
						dialogSuccess.set('支付密码修改成功，请牢记，3S后自动跳转');
						dialogSuccess.show();
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			} else {
				$.alert("两次输入不一致");
			}
		}
	});
	avalon.scan();
	api.isQuestion({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			vm.hasProtected = true;
		} else {
			vm.hasProtected = false;
		}
	});
	
	//身份证认证				
	api.info({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			if (data.data.realname && data.data.realname!='') {
				vm.hasRealName = true;
			}else{
				vm.hasRealName = false;
			}
		} else {
			console.log(data);
			$.alert(data.msg);
		}
	});
	
	setTimeout(function() {
		paypass.addClass('on');
		if (get.data.from === 'dialog') {
			router.to('/view/paypass-choose');
		}
	},100);

});
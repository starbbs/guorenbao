// 张树垚 2015-12-30 16:55:15 创建
// H5微信端 --- 支付密码重置


require(['router', 'api', 'h5-view', 'check', 'h5-ident', 'h5-paypass', 'h5-text', 'h5-weixin'], function(router, api, View, check) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var paypass = $('.paypass-page');

	var paypassChoose = new View('paypass-choose');
	var paypassProtection1 = new View('paypass-protection-1');
	var paypassProtection2 = new View('paypass-protection-2');
	var paypassAuthentication = new View('paypass-authentication');
	var paypassIdent = new View('paypass-ident');
	var paypassView1 = new View('paypass-view-1');
	var paypassView2 = new View('paypass-view-2');
	var paypassView3 = new View('paypass-view-3');

	var vm = avalon.define({
		$id: 'paypass',

		paypass1: '', // 双向绑定, input只校验不控制值
		paypass1Next: false,
		paypass1Input: function() {
			vm.paypass1Next = check.paypassCondition(this.value);
		},
		paypass1Click: function() {
			if (vm.paypass1Next && check.paypass(vm.paypass1)) {
				//验证支付密码
				api.checkPayPwd({
					gopToken: gopToken,
					payPwd: vm.paypass1
				}, function(data) {
					if (data.status == 200) {
						router.go('/view/paypass-view-2');
					} else {
						console.log(data);
						$.alert(data.msg);
						$('#paypass-1').get(0).focus();
					}
				});
			}
		},
		paypass2: '', // 双向绑定, input只校验不控制值
		paypass2Next: false,
		paypass2Input: function() {
			vm.paypass2Next = check.paypassCondition(this.value);
		},
		paypass2Click: function() {
			if (vm.paypass2Next && check.paypass(vm.paypass2)) {
				router.go('/view/paypass-view-3');
			}
		},
		paypass3: '', // 双向绑定, input只校验不控制值
		paypass3Next: false,
		paypass3Input: function() {
			vm.paypass3Next = check.paypassCondition(this.value);
		},
		paypass3Click: function() {
			if (vm.paypass3Next && check.paypass(vm.paypass3) && vm.paypass2 === vm.paypass3) {
				api.setPayPassword({
					gopToken: gopToken,
					password: vm.paypass3
				}, function(data) {
					if (data.status == 200) {
						vm.paypass1 = '';
						vm.paypass2 = '';
						vm.paypass3 = '';
						vm.Idcard = '';
						vm.identifyingCode = '';
						$.alert('修改支付密码成功', function() {
							window.location.href = './security.html';
						}, 'half');
					} else {
						console.log(data);
						$.alert(data.msg);
					}
				});
			} else {
				$.alert("两次输入不一致");
			}
		},

		question1: '',
		quesiotn1Click: function() {
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
		question2: '',
		quesiotn2Click: function() {
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
		answer1: '',
		answer2: '',

		realName: '',
		Idcard: '',
		phone: '',
		identifyingCode: '',
		hasProtected: true,
		chooseUrl: '',
		checkCodeClick: function() {
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
		authenticationClick: function() {
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

	setTimeout(function() {
		paypass.addClass('on');
	}, 100);
});
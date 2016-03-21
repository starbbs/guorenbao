// 张树垚 2015-12-30 16:55:15 创建
// H5微信端 --- 支付密码重置


require(['router', 'api', 'h5-view', 'get', 'h5-dialog-success', 'h5-ident', 'h5-paypass', 'h5-text', 'h5-weixin'], function(router, api, View, get, dialogSuccess) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var paypass = $('.paypass-page');

	var finish = function() { // 最终
		switch(get.data.from) {
			case 'dialog':
				window.location.href = './transfer.html';
				break;
			default:
				window.location.href = './mine.html';
				break;
		}
	};
	var dialogShow = function() { // 显示浮层
		var timer = null;
		var second = 3;
		dialogSuccess.on('show', function() {
			timer = setInterval(function() {
				second--;
				if (second <= 0) {
					finish();
					dialogSuccess.hide();
					clearInterval(timer);
				} else {
					dialogSuccess.button.html('支付密码修改成功，请牢记，' + second + 's后自动跳转');
				}
			}, 1000);
		});
		dialogSuccess.set('支付密码修改成功，请牢记，3S后自动跳转');
		dialogSuccess.show();
	};

	setTimeout(function() {
		paypass.addClass('on');
		if (get.data.from === 'dialog') {
			router.to('/paypass-choose');
		}
	}, 100);

	new View('paypass-choose');
	new View('paypass-protection-1');
	new View('paypass-protection-2');
	new View('paypass-authentication');
	new View('paypass-ident');
	new View('paypass-view-1');
	new View('paypass-view-2');
	new View('paypass-view-3');

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
									router.go('/paypass-protection-1');
								} else {
									$.alert('验证码错误');
								}
							});
						} else if (vm.chooseUrl == 'paypass-authentication') {
							//身份证认证				
							if (vm.realName && vm.realName != '') {
								//vm.realName = '*' + vm.realName.substr(1, vm.realName.length - 1);
								router.go('/paypass-authentication');
							} else {
								$.alert('未实名认证,请先实名认证');
							}
						}
					} else {
						$.alert('验证码错误');
					}
				});
			} else {
				$.alert('请输入验证码');
			}
		},
		quesiotn1Click: function() { // 第一个密保问题
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
							router.go('/paypass-protection-2');
						} else {
							console.log(data);
						}
					});
				} else {
					$.alert('验证问题错误');
				}
			});
		},
		quesiotn2Click: function() { // 第二个密保问题
			api.checkQuestion({
				gopToken: gopToken,
				qtNumber: 2,
				question: vm.question2,
				answer: vm.answer2
			}, function(data) {
				if (data.status == 200) {
					router.go('/paypass-view-2');
				} else {
					$.alert('验证问题错误');
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
						vm.realName = data.data.realname;
					}
					vm.phone = data.data.phone;
					vm.identifyingCode = '';
					router.go('/paypass-ident');
				} else {
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
						router.go('/paypass-view-2');
					} else {
						$.alert(data.msg);
					}
				});
			} else {
				$.alert('身份证号码格式错误');
			}
		},
		paypass1Click: function() {
			if (vm.paypass1.length == 6) {
				//验证支付密码
				api.checkPayPwd({
					gopToken: gopToken,
					payPwd: vm.paypass1
				}, function(data) {
					if (data.status == 200) {
						router.go('/paypass-view-2');
					} else {
						$.alert(data.msg);
					}
				});
			}
		},
		paypass2Click: function() {
			if (vm.paypass2.length == 6) {
				router.go('/paypass-view-3');
			}
		},
		paypass3Click: function() {
			if (vm.paypass2 == vm.paypass3 && vm.paypass3.length == 6) {
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
						dialogShow();
					} else {
						$.alert(data.msg);
					}
				});
			} else {
				$.alert('两次输入不一致');
			}
		},
	});

	avalon.scan();

	api.isQuestion({
		gopToken: gopToken
	}, function(data) {
		vm.hasProtected = data.status == 200;
	});

	//身份证认证				
	api.info({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			vm.hasRealName = data.data.realname && data.data.realname != '';
		} else {
			$.alert(data.msg);
		}
	});
});
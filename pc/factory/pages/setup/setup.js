

// 张树垚 2015-07-30 15:20:56 创建
// 果仁宝 设置页js



require(['dom', 'api', 'top', 'router'], function(dom, api, top, router) {

	var pages = 'base,verify,password,security,linkman'.split(',');
	var tree = { // 路由结构树
		base: { // 基本信息
			_module: function() {
				if (tree.base._requested) {

				} else {
					tree.base._requested = true;
					api.getUserInfoFromSession(null, function(data) {
						vm.uid = data.uid;
						vm.name = data.name === 'null' ? '未认证' : data.name;
						vm.photo = data.photo;
						vm.cardNum = data.cardNum;
						vm.registerTime = data.registerTime.split(' ')[0].replace(/(\d{4})-(\d{2})-(\d{2})/g, function(s, s1, s2, s3) {
							return s1 + '年' + s2 + '月' + s3 + '日';
						});
						vm.address = data.address;
					});
				}
			},
			img: ''				// 修改头像
		},
		verify: { // 实名认证
			_module: function() {		// 默认 -- 需后台
				if (tree.verify._requested) {

				} else {
					tree.verify._requested = true;
					api.getValidateInfo(null, function(data) {
						switch(data.result) {
							case 'no_authority': // 未认证
								vm.page = 'not';
								break;
							case 'false': // 认证失败
								vm.page = 'fail';
								break;
							case 'success': // 认证成功
								vm.page = 'done';
								vm.name = data.name;
								vm.personId = data.personId;
								vm.authTime = data.authTime.replace(/\:\d*\.*\d*$/, '');
								break;
							default:
								console.log(data);
						}
						avalon.router.navigate('/verify/' + vm.page);
					});
				}
			},
			not: function() {				// 未认证 √
				console.log('未认证');
				tree.verify._module();
			},
			fail: function() {			// 认证失败 ×
				console.log('认证中');
				tree.verify._module();
			},
			done: function() {			// 已认证
				console.log('已认证');
				tree.verify._module();
			}
		},
		password: { // 修改密码
			_prev: 'password',
			_module: function() {
				setTimeout(function() {
					avalon.router.navigate('/password/' + (vm.page || tree.password._prev));
				}, 2);
			},
			password: function() { // 登录密码
				console.log('登录密码');
				tree.password._prev = password;
				passwordTab(0);
			},
			paypass: function() { // 支付密码
				console.log('支付密码');
				tree.password._prev = paypass;
				passwordTab(1);
			}
		},
		security: { // 密保问题
			_module: function() {
				if (tree.security._requested) {

				} else {
					tree.security._requested = true;
					api.getAllQuestion(null, function(data) {
						switch(data.hasQuestion) {
							case 'yes': // 已设置密保问题
								vm.page = 'done';
								vm.security_question_1_question = data.map.question1;
								vm.security_question_2_question = data.map.question2;
								break;
							case 'no': // 未设置密保问题
								vm.page = 'not';
								vm.security_questions = data.list;
								break;
							default:
								console.log(data);
						}
					});
				}
			},
			not: function() {					// 设置
				console.log('设置');
				vm.page = 'not';
				tree.security._module();
			},
			check: function() {				// 检查
				console.log('检查');
				vm.page = 'check';
				tree.security._module();
			},
			done: function() {				// 设置成功
				console.log('设置成功');
				vm.page = 'done';
				tree.security._module();
			}
		},
		linkman: {			// 联系人
			_module: function() {
				api.getAllWalletContacts(null, function(data) {
					// comm		-- 备注
					// contact	-- uid,手机号
					// var data = [
					// 	{"comm":"我是注释","contact":"1111*2222","id":23,"realName":"*雨"},
					// 	{"comm":"我是注释","contact":"1111*2222","id":24,"realName":"*雨"},
					// 	{"comm":"我是注释","contact":"1111*2222","id":25,"realName":"*雨"},
					// 	{"comm":"我是注释","contact":"1111*2222","id":26,"realName":"*雨"},
					// 	{"comm":"我是注释","contact":"1111*2222","id":27,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":28,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":29,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":30,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":31,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":32,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":33,"realName":"*雨"},
					// 	{"comm":"","contact":"1111*2222","id":34,"realName":"*雨"}
					// ];
					vm.linkman = data;
					vm.linkman_list = data.slice(0, vm.linkman_per);
					vm.linkman_now = 1;
				});
			}
		}
	};

	var elements		= {},
		$password		= elements.$password		= $('#password'),
		$passwordNew	= elements.$passwordNew		= $('#password-new'),
		$passwordNewRe	= elements.$passwordNewRe	= $('#password-new-re'),
		$passwordButton	= elements.$passwordButton	= $('#password-button'),
		$paypass		= elements.$paypass			= $('#paypass'),
		$paypassNew		= elements.$paypassNew		= $('#paypass-new'),
		$paypassNewRe	= elements.$paypassNewRe	= $('#paypass-new-re'),
		$paypassButton	= elements.$paypassButton	= $('#paypass-button'),
		headerHeight	= dom.header.height() + 1;
	var vm = avalon.define({
		$id: "setup",
		list: "",			// 目录
		page: "",			// 页面
		uid: '',			// 用户账号(手机)
		name: '',			// 用户名
		photo: '',			// 用户图片地址
		cardNum: '',		// 银行卡个数
		registerTime: '',	// 注册时间
		address: '',		// 地址
		personId: '',		// 身份证号
		authTime: '',		// 认证成功时间
		input_focus: function() { // 有提示框的input的focus
			$(this).removeClass('error')
		},
		input_blur: function() { // 有提示框的input的focus

		},
		verify_click: function() {
			if (this.isSending) {return}
			var _this = this;
			var name = $('#verify-name').val();
			var card = $('#verify-id-card').val();
			if (name && card) {
				this.isSending = true;
				api.validatePersonInfo({
					realName: name,
					personId: card
				}, function(data) {
					_this.isSending = false;
					switch(data) {
						case 'true':
							avalon.router.navigate('/verify/done');
							break;
						case 'false':
							$('#verify-name').val('');
							$('#verify-id-card').val('');
							avalon.router.navigate('/verify/fail');
							break;
						default:
							console.log(data);
					}
				});
			}
		},
		security_questions: [],
		security_question_1: '',
		security_question_2: '',
		security_question_1_question: '',
		security_question_2_question: '',
		security_question_change: function(num) { // 选择密保问题
			var value = this.value;
			vm['security_question_' + num] = value;
			vm['security_question_' + num + '_question'] = vm.security_questions.filter(function(item) {
				return parseInt(item.queId) === value ? true : false;
			})[0].question;
		},
		security_check: function() { // 密保答案验证
			if (!this.value) {
				$(this).addClass('error');
			}
		},
		security_not_click: function() {
			var _this = this;
			setTimeout(function() {
				var answer1 = $('#question-1-answer');
				var answer2 = $('#question-2-answer');
				if (answer1.hasClass('error') ||
					!vm.security_question_1 ||
					answer2.hasClass('error') ||
					!vm.security_question_2) {

				} else {
					$('#security-quesiton-1-answer').html(answer1.val());
					$('#security-quesiton-2-answer').html(answer2.val());
					avalon.router.navigate('/security/check');
				}
			}, 10);
		},
		security_check_button: function() {
			api.saveQuestion({
				secQ1: vm.security_question_1 + ':' + $('#question-1-answer').val(),
				secQ2: vm.security_question_2 + ':' + $('#question-2-answer').val()
			}, function(data) {
				switch(data) {
					case 'ok':
						avalon.router.navigate('/security/done');
						break;
					default:
						console.log(data);
				}
			});
		},
		password_focus: function() { // 密码修改输入框统一焦点事件, 个别再单加
			var $this = $(this);
			$this.removeClass('success error');
		},
		password_password_blur: function() { // 登录密码输入框失焦
			var value = this.value;
			var $this = $(this);
			if (this.value) {
				api.checkPassword({
					pass: value
				}, function(data) {
					switch(data) {
						case 'yes':
							$this.addClass('success');
							break;
						case 'no':
							$this.addClass('error');
							break;
						default:
							console.log(data)
					}
					checkButton('password');
				});
			}
		},
		password_password_new_input: function() { // 登陆新密码输入框输入

		},
		password_password_new_blur: function() { // 登陆新密码输入框失焦
			inputNewBlur.call(this, 'password');
		},
		password_password_new_re_blur: function() { // 登陆新密码再次输入输入框失焦
			inputNewReBlur.call(this, 'password');
		},
		password_password_click: function() { // 登录密码修改按钮点击
			var $this = $(this);
			if ($this.hasClass('disabled')) {
				return false;
			} else {
				api.updatePasswordByOld({
					pass: $password.val(),
					passNew: $passwordNew.val()
				}, function(data) {
					switch(data.result) {
						case 'success': 
							alert('登录密码修改成功');
							$password.val('').removeClass('success');
							$passwordNew.val('').removeClass('success');
							$passwordNewRe.val('').removeClass('success');
							break;
						case 'fail':
							alert('登录密码修改失败, 原因是: ' + data.reason);
							break;
						default:
							console.log(data);
					}
				});
			}
		},
		password_paypass_blur: function() { // 支付密码输入框失焦
			var value = this.value;
			var $this = $(this);
			if (this.value) {
				api.checkPaypassword({
					paypass: value
				}, function(data) {
					switch(data) {
						case 'yes':
							$this.addClass('success');
							break;
						case 'no':
							$this.addClass('error');
							break;
						default:
							console.log(data)
					}
					checkButton('paypass');
				});
			}
		},
		password_paypass_new_input: function() { // 支付密码输入框输入

		},
		password_paypass_new_blur: function() { // 支付密码输入框失焦
			inputNewBlur.call(this, 'paypass');
		},
		password_paypass_new_re_blur: function() { // 支付密码再次输入输入框失焦
			inputNewReBlur.call(this, 'paypass');
		},
		password_paypass_click: function() { // 支付密码修改按钮点击
			var $this = $(this);
			if ($this.hasClass('disabled')) {
				return false;
			} else {
				api.updatePaypassByOld({
					paypass: $paypass.val(),
					paypassNew: $paypassNew.val()
				}, function(data) {
					switch(data.result) {
						case 'success': 
							alert('支付密码修改成功');
							$paypass.val('').removeClass('success');
							$paypassNew.val('').removeClass('success');
							$paypassNewRe.val('').removeClass('success');
							break;
						case 'fail':
							alert('支付密码修改失败, 原因是: ' + data.reason);
							break;
						default:
							console.log(data);
					}
				})
			}
		},
		linkman: [], // 联系人序列
		linkman_list: [], // 联系人展示页面
		linkman_now: 1, // 联系人当前页数
		linkman_per: 9, // 联系人每页人数
		linkman_page_keydown: function(ev) {
			if (ev.keyCode === 13) {
				if (linkPage(this.value) === false) {
					this.value = vm.linkman_now;
				}
			}
		},
		linkman_page_next: function() {
			if (linkPage(vm.linkman_now + 1) === false) {
				return false;
			}
		},
		linkman_comm_click: function() { // 联系人: 添加备注点击
			var $this = $(this);
			$this.hide().next().show();
		},
		linkman_comm_blur: function() { // 联系人: 备注输入框失焦
			var $this = $(this);
			// setTimeout(function() {
			// 	$this.parent().hide().prev().show();
			// }, 100);
		},
		linkman_comm_confirm: function(index) { // 联系人: 备注修改确定
			var $this = $(this);
			var value = $this.prev().val();
			var now = vm.linkman_now;
			var per = vm.linkman_per;
			var man = vm.linkman[(now - 1) * per + index];
			if (man.comm != value) {
				man.comm = value;
				linkRefresh();
				api.setGopsiteContactComment({
					id: id,
					comment: value
				}, function(data) {
					switch(data) {
						case 'success':
							console.log('修改备注成功');
							break;
						case 'fail':
							console.log('修改备注失败');
							break;
						default:
							console.log(data);
					}
				})
			}
			$this.parent().hide().prev().show();
		},
		linkman_check_click: function() { // 联系人: checkbox点击
			var $this = $(this);
			$this.closest('.setup-linkman-item').toggleClass('check');
		},
		linkman_comm_delete: function(index, id) {
			if (confirm('是否确定删除该联系人?')) {
				var now = vm.linkman_now;
				var per = vm.linkman_per;
				vm.linkman.splice((now - 1) * per + index, 1);
				linkRefresh();
				api.deleteAccountGopsiteContactById({
					id: id
				}, function(data) {
					switch(data) {
						case 'success':
							console.log('联系人删除成功');
							break;
						case 'fail':
							console.log('联系人删除失败');
							break;
						default:
							console.log(data);
					}
				});
			}
		},
		linkman_head_all: function() {
			$('.setup-linkman-item').addClass('check');
		},
		linkman_head_cancel: function() {
			$('.setup-linkman-item').removeClass('check');
		},
		linkman_head_delete: function() {
			if (confirm('是否确定删除这些联系人?')) {
				var check = $('.setup-linkman-item.check');
				if (check.length) {
					var now = vm.linkman_now;
					var per = vm.linkman_per;
					var list = [];
					for (var i = check.length - 1; i >= 0; i--) {
						var index = check[i].dataset.index;
						var id = check[i].dataset.id;
						vm.linkman.splice((now - 1) * per + index, 1);
						list.push(id);
					}
					console.log(list)
					linkRefresh();
					api.deleteAccountGopsiteContactById({
						list: list
					}, function(data) {
						switch(data) {
							case 'success':
								console.log('联系人批量删除成功');
								break;
							case 'fail':
								console.log('联系人批量删除失败');
								break;
							default:
								console.log(data);
						}
					});
				}
			}
		}
	});
	avalon.scan();

	function linkPage(page) {
		if (page == vm.linkman_now) {return false;}
		if ($.isNumeric(page)) {
			page = parseInt(page);
			var per = vm.linkman_per
			var total = parseInt(vm.linkman.length / per) + 1;
			if (page > total || page < 1) {return false;}
			vm.linkman_now = page;
			vm.linkman_list = vm.linkman.$model.slice(per * (page - 1), per * page);
		}
		return true;
	}
	function linkDelete() {
		linkRefresh();
	}
	function linkRefresh() {
		var per = vm.linkman_per;
		var now = vm.linkman_now;
		var total = parseInt(vm.linkman.length / per) + 1;
		if (now > total) {
			now = total;
			vm.linkman_now = now;
		}
		vm.linkman_list = vm.linkman.$model.slice(per * (now - 1), per * now);
	}

	function passwordTab(num) { // 密码修改页面切换
		var titles = $('.setup-password-title').removeClass('on');
		var content = $('.setup-password-content').css({height: 0});
		titles.eq(num).addClass('on');
		content.eq(num).css({height: content.get(num).scrollHeight});
	}

	function inputNewBlur(name) { // 新密码输入框失焦
		var value = this.value;
		var $this = $(this);
		$this.addClass(!value ? 'error' : 'success');
		if (value != elements['$' + name + 'NewRe'].val()) {
			elements['$' + name + 'NewRe'].removeClass('success');
		}
		checkButton(name);
	}
	function inputNewReBlur(name) { // 新密码再次输入输入框失焦
		var value = this.value;
		var $this = $(this);
		$this.addClass((!value || value != elements['$' + name + 'New'].val()) ? 'error' : 'success');
		checkButton(name);
	}
	function checkButton(name) { // 检测登录密码按钮是否是可点击状态
		setTimeout(function() {
			if (elements['$' + name].hasClass('success') &&
				elements['$' + name + 'New'].hasClass('success') &&
				elements['$' + name + 'NewRe'].hasClass('success') &&
				elements['$' + name + 'New'].val() == elements['$' + name + 'NewRe'].val()) {
				elements['$' + name + 'Button'].removeClass('disabled');
			} else {
				elements['$' + name + 'Button'].addClass('disabled');
			}
		}, 10);
	}

	function listChange(list, end) { // 目录更改
		var time = 300;
		$('.setup-' + vm.list).parent().fadeOut(time);
		$('.setup-' + list).parent().fadeIn(time);
		vm.list = list;
		if (dom.wrap.scrollTop() > headerHeight) {
			dom.wrap.animate({
				"scrollTop": headerHeight
			}, time);
		}
		end && setTimeout(end, time);
	}

	function pageChange(list, page) { // 页面更改
		var todo = page === '' ? '_module' : page;
		page !== '' && (vm.page = page);
		tree[list] && tree[list][todo] && tree[list][todo]();
	}

	var preventTwice = false;
	avalon.router.get('/:list/:page', function(list, page) {

		// 阻止多次连续多次触发
		if (preventTwice) {
			return false;
		}
		preventTwice = true;
		setTimeout(function() {
			preventTwice = false;
		}, 1);

		// 要执行的路由规则
		if (list in tree) { // 正确路径
			if (list === vm.list) { // 同目录下, 切换页面
				if (page in tree[list] || page === '') { // 正确页面
					if (page === vm.page) { // 相同的
						return false;
					} else {
						// 切换页面
						pageChange(list, page);
					}
				} else { // 错误页面
					avalon.router.navigate('/' + list + '/');
				}
			} else { // 切换目录 => 1.准备页面 2.切换目录
				if (page in tree[list] || page === '') { // 正确页面
					listChange(list);
					pageChange(list, page);
				} else { // 错误页面
					avalon.router.navigate('/' + list + '/');
				}
			}
		} else { // 错误路径
			avalon.router.navigate('/base/');
		}
	});
	avalon.history.start({
		"hashPrefix": '!',
		"html5Mode": false,
		"basePath": '/'
	});

	setTimeout(function() {
		if (vm.list === '') { // 强制跳到第一步
			avalon.router.navigate('/base/');
		}
	}, 200);
});















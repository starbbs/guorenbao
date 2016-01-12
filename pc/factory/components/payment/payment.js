
// 张树垚 2015-10-29 17:34:48 创建
// 支付


define(['api', 'check'], function(api, check) {

	var vmodules = [];
	var payment = $('.payment');
	payment.each(function(i) {
		var options = {
			$id: 'payment',
			$skipArray: ['init'],
			check: '',
			error: '',
			paypass: '',
			state: 'default', // input状态: default, success, error
			init: function() {
				if (vm.check) { return; }
				vm.check = '安全监测中...';
				setTimeout(function() {
					vm.check = '安全设置检测成功！';
				}, 1500);
			},
			focus: function() {
			},
			blur: function() {
			},
			input: function() {
				var value = this.value;
				if (value.length === 6 ) {
					if (check.paypass(value).result) {
						api.verifyPayPass({
							payPass: value
						}, function(data) {
							if (data === 'true' || data === true) {
								vm.clickable = true;
								vm.state = 'success';
							} else {
								vm.clickable = false;
								vm.state = 'error';
								vm.error = '支付密码不正确';
							}
						});
					} else {
						vm.clickable = false;
						vm.state = 'error';
						vm.error = '支付密码不正确';
					}
				} else {
					vm.clickable = false;
				}
			},
			clickable: false, // 按钮是否可点击
		};
		if (payment.length > 1) {
			var id = 'payment' + i;
			this.setAttribute('ms-controller', id);
			options.$id = id;
		}
		var vm = avalon.define(options);
		avalon.scan(this, vm);
		if (payment.length > 1) {
			vmodules.push(vm);
		} else {
			vmodules = vm;
		}
	});

	if (Array.isArray(vmodules)) {
		vmodules.init = function() {
			this.forEach(function(item) {
				item.init && item.init();
			});
		};
	}

	return vmodules; // paymentVM / [paymentVM0, paymentVM1, ...]
});



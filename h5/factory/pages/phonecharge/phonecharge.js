// 张树垚 2016-01-09 12:54:11 创建
// H5微信端 --- 手机充值


require(['h5-api', 'check', 'get', 'filters', 'h5-alert', 'h5-weixin'], function(api, check, get, filters) {
	var gopToken = $.cookie('gopToken');
	var main = $('.phonecharge');
	var focusTimer = null;
	var cards = { // 各种充值卡
		'联通': [],
		'移动': [],
		'电信': [],
	};
	var confirmData = null;
	var vm = avalon.define({
		$id: 'phonecharge',
		phone: '',
		carrier: '', // 运营商
		input: function() { // 手机号输入
			if (check.phone(vm.phone).result) {
				api.phoneInfo({
					phone: vm.phone
				}, function(data) {
					if (data.status == 200) {
						vm.carrier = data.data.carrier;
						vm.goods = cards[data.data.carrier.substr(-2)];
					} else {
						$.alert(data.msg);
					}
				});
			}
		},
		focusing: false, // 焦点在输入框
		focus: function() { // 获取焦点
			vm.focusing = true;
			clearTimeout(focusTimer);
		},
		blur: function() { // 失去焦点
			clearTimeout(focusTimer);
			focusTimer = setTimeout(function() {
				vm.focusing = false;
			}, 300);
		},
		close: function() { // 输入框清除
			vm.phone = '';
			$('#phonecharge-text-input').val('').get(0).focus();
		},
		list: [], // 历史充值号码列表
		listClick: function() { // 选择历史号码
			vm.phone = this.innerHTML.replace(/ /g, '');
			vm.input();
		},
		listDelete: function(item, remove) { // 历史号码删除
			api.phoneDelete({
				gopToken: gopToken,
				phoneSet: [item]
			}, function(data) {
				if (data.status == 200) {
					remove();
				} else {
					$.alert(data.msg);
				}
			});
		},
		listClean: function() { // 历史号码清空
			api.phoneDelete({
				gopToken: gopToken,
				phoneSet: vm.list.$model
			}, function(data) {
				if (data.status == 200) {
					vm.list.clear();
				} else {
					$.alert(data.msg);
				}
			});
		},
		goods: [], // 商品列表
		goodsClick: function(ev) { // 商品点击
			var item = $(ev.target).closest('.phonecharge-box-item');
			if (item.length) {
				item.addClass('on').siblings().removeClass('on');
				confirmData = vm.goods[item.index()].$model;
				vm.button = '支付：¥' + filters.floorFix(confirmData.use);
			}
		},
		button: '支付', // 按钮显示
		buttonClick: function() { // 按钮点击
			if ($(this).hasClass('disabled')) {
				return;
			}
			api.phoneRecharge({
				gopToken: gopToken,
				productId: confirmData.id,
				phone: vm.phone
			}, function(data) {
				if (data.status == 200) {
					setTimeout(function() {
						window.location.href = get.add('order.html', {
							// 跳到公共订单页 build/order.html?from=phonecharge&id=1525
							from: 'phonecharge',
							id: data.data.consumeOrderId
						});
					}, 1000 / 60);
				} else {
					$.alert(data.msg);
				}
			});
		}
	});
	avalon.scan(main.get(0), vm);

	api.phoneLastest({
		gopToken: gopToken
	}, function(data) {
		if (data.status == 200) {
			vm.list = data.data.phoneList;
		} else {
			console.log(data);
		}
	});
	api.productList({
		productType: "SHOUJICHONGZHIKA"
	}, function(data) {
		// console.log(data);
		if (data.status == 200) {
			data.data.productList.forEach(function(item) {
				var desc = JSON.parse(item.extraContent);
				cards[desc.carrier].push({
					id: item.id, // 商品id
					currency: item.currency, // 货币(RMB)
					price: desc.price, // 显示价格
					use: item.price, // 实际价格
					desc: item.productDesc, // 描述
				});
			});
			// console.log(cards)
		} else {
			console.log(data);
		}
	});
	setTimeout(function() {
		main.addClass('on');
	}, 100);
	return;
});
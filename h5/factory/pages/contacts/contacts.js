// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-view', 'h5-view-nickname', 'h5-weixin', 'h5-component-keyboard'], function(router, api, View, nickname) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var main = $('.contacts');
	var view = new View('contacts-people');
	var tabs = { // 切换列表的内存
		guoren: {
			name: 'GOP_CONTACT',
			list: []
		},
		wallet: {
			name: 'WALLET_CONTACT',
			list: []
		},
	};
	var nowData = null;
	var dataHandler = function(data) { // 后台数据转显示数据
		var result = {
			arr: [],
			other: []
		};
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
					name: i!=='Other'?i:'其他',
					list: data[i]
				});
			}
		};
		result.arr.sort(function(a1, a2) {
			return a1.name > a2.name;
		});
		return result.arr.concat(result.other);
	};
	var getList = function(name) { // 获取列表
		if (tabs[name].list.length) { // 有就用内存的
			contacts.list = tabs[name].list;
		} else { // 没有就请求并挂到内存上
			api.person({
				contactType: tabs[name].name,
				contactQuery: '',
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					contacts.list = tabs[name].list = dataHandler(data.data);
				} else {
					console.log(data);
				}
			});
		}
	};
	var contacts = avalon.define({
		$id: 'contacts',
		search: '', // 搜索框--双向绑定
		submit: function(event) { // 搜索提交
			api.person({
				contactType: tabs[contacts.now].name,
				contactQuery: contacts.search,
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					contacts.list = dataHandler(data.data);
				} else {
					console.log(data);
				}
			});
			event.preventDefault();
			return false;
		},
		now: 'guoren', // 当前tab
		tab: function(name) { // 切换点击
			var self = $(this);
			if (self.hasClass('on')) {
				return;
			}
			contacts.search = ''; // 切换时清空搜索框
			getList(contacts.now = name); // 获取当前
		},
		list: [],
		listClick: function(ev) {
			var item = $(ev.target).closest('.contacts-item');
			if (!item.length) {
				return;
			}
			var arr = item.get(0).dataset.path.split('/'); 
			nowData = contacts.list[arr[0]].list[arr[1]];   
			$.extend(people, nowData.$model);
			console.log(nowData.$model)
			router.go('/contacts-people');
		},
	});
	var people = avalon.define({
		$id: 'contacts-people',
		address: '',
		phone: '',
		name: '',
		picture: './images/picture.png',
		gopUserNick: '',
		id: '',
		transfer: function() {
			$.cookie('gop_contact', JSON.stringify({
				address: people.address,
				phone: people.phone,
				name: people.name,
				picture: people.picture,
				gopUserNick: people.gopUserNick,
				id: people.id,
				type: contacts.now
			}), {
				expires: 1
			});
			setTimeout(function() {
				window.location.href = 'transfer.html?from=contact';
			}, 300);
		},
		click: function() {
			nickname.vm.id = people.id;
			nickname.vm.name = people.name;
			router.go('/nickname');
		},
	});
	nickname.onFinish = function() {
		people.name = nowData.name = nickname.vm.name; // 同步
		people.name = nowData.name = nickname.vm.nickname;
		tabs.guoren.list.length = tabs.wallet.list.length = 0; // 重新请求
	};
	avalon.scan();
	getList('guoren');

	setTimeout(function() {
		main.addClass('on');
	}, 100);
});

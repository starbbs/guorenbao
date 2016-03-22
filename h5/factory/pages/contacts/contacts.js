// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-view', 'filters', 'h5-component-bill', 'h5-view-nickname', 'h5-weixin', 'h5-component-keyboard'], function(router, api, View, filters, H5bill, nickname) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var main = $('.contacts');
	var view = new View('contacts-people');

	var tabs = { // 切换列表的内存
		GOP_CONTACT: [],
		WALLET_CONTACT: [],
	};

	var dataHandler = function(data) { // 后台数据转显示数据
		var result = {
			arr: [], // 分出来为了按字母顺序排序
			other: []
		};
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
					name: i !== 'Other' ? i : '其他',
					list: data[i].map(function(item) {
						return {
							id: item.id,
							picture: item.picture || './images/picture.png',
							name: item.name || H5bill.transferNoNames[contacts.now],
							phone: item.phone ? filters.phone(item.phone) : filters.address(item.address),
						};
					})
				});
			}
		};
		result.arr.sort(function(a1, a2) {
			return a1.name > a2.name;
		});
		return result.arr.concat(result.other);
	};
	var getList = function() { // 获取列表
		var name = contacts.now;
		if (tabs[name].length) { // 有就用内存的
			contacts.list = tabs[name];
		} else { // 没有就请求并挂到内存上
			api.person({
				contactType: name,
				contactQuery: '',
				gopToken: gopToken
			}, function(data) {
				if (data.status == 200) {
					contacts.list = tabs[name] = dataHandler(data.data);
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
				contactType: contacts.now,
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
		now: 'GOP_CONTACT', // 当前tab
		tab: function(name) { // 切换点击
			if (name === contacts.now) {
				return;
			}
			contacts.search = ''; // 切换时清空搜索框
			contacts.now = name;
			getList(); // 获取当前
		},
		list: [],
		listClick: function(ev) {
			var item = $(ev.target).closest('.contacts-item');
			if (!item.length) {
				return;
			}
			var arr = item.get(0).dataset.path.split('/');
			$.extend(people, contacts.list[arr[0]].list[arr[1]].$model);
			router.go('/contacts-people');
		},
	});
	var people = avalon.define({
		$id: 'contacts-people',
		id: '',
		phone: '',
		name: '',
		picture: './images/picture.png',
		transfer: function() {
			window.location.href = 'transfer.html?from=contacts&id=' + people.id;
		},
		click: function() {
			nickname.vm.id = people.id;
			nickname.vm.nickname = people.name;
			router.go('/nickname');
		},
	});
	avalon.scan();

	// 备注名策略: 同步修改联系人详情, 重新请求联系人列表
	nickname.onFinish = function() {
		if (people.name !== nickname.vm.nickname) {
			people.name = nickname.vm.nickname;
			tabs.GOP_CONTACT.length = tabs.WALLET_CONTACT.length = 0;
			getList();
		}
	};

	getList();

	setTimeout(function() {
		main.addClass('on');
	}, 100);
});
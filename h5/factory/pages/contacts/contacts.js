
// 张树垚 2015-12-20 11:27:22 创建
// H5微信端 --- 个人首页


require(['router', 'api', 'h5-view', 'h5-view-nickname', 'h5-weixin'], function(router, api, View, nickname) {

	router.init(true);

	var gopToken = $.cookie('gopToken');
	var main = $('.contacts');
	var view = new View('contacts-people');
	var tabs = {
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
	var dataHandler = function(data) {
		/*进入数据: {
			"B" : [{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				},{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				},{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				}
			],
			"C" : [{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				}
			],
			"D" : [{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				}
			],
			"Other" : [{
					"address" : "strduf************************************",
					"phone" : "139****7743",
					"name" : "bbb",
					"picture" : "aaaaaaaaaaaaaa"
				}
			]
		}*/
		var result = {
			arr: [],
			other: []
		};
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				result[i.length === 1 ? 'arr' : 'other'].push({ // 字母放到arr, 其他放到other
					name: i,
					list: data[i]
				});
			}
		};
		result.arr.sort(function(a1, a2) {
			return a1.name > a2.name;
		});
		return result.arr.concat(result.other);
		/*输出数据: [{
		"name": "B",
		"list": [{
			"address": "strduf************************************",
			"phone": "139****7743",
			"name": "bbb",
			"picture": "aaaaaaaaaaaaaa"
		}, {
			"address": "strduf************************************",
			"phone": "139****7743",
			"name": "bbb",
			"picture": "aaaaaaaaaaaaaa"
		}, {
			"address": "strduf************************************",
			"phone": "139****7743",
			"name": "bbb",
			"picture": "aaaaaaaaaaaaaa"
		}]
		}, {
			"name": "C",
			"list": [{
				"address": "strduf************************************",
				"phone": "139****7743",
				"name": "bbb",
				"picture": "aaaaaaaaaaaaaa"
			}]
		}, {
			"name": "D",
			"list": [{
				"address": "strduf************************************",
				"phone": "139****7743",
				"name": "bbb",
				"picture": "aaaaaaaaaaaaaa"
			}]
		}, {
			"name": "Other",
			"list": [{
				"address": "strduf************************************",
				"phone": "139****7743",
				"name": "bbb",
				"picture": "aaaaaaaaaaaaaa"
			}]
		}]*/
	};
	var getList = function(name) {
		if (tabs[name].list.length) {
			contacts.list = tabs[name].list;
		} else {
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
		search: '',
		submit: function() {
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
			return false;
		},
		now: 'guoren', // 当前tab
		tab: function(name) {
			var self = $(this);
			if (self.hasClass('on')) { return; }
			contacts.search = ''; // 切换时清空搜索框
			self.addClass('on').siblings().removeClass('on');
			getList(name);
			contacts.now = name;
		},
		list: [],
		listClick: function(ev) {
			var item = $(ev.target).closest('.contacts-item');
			if (!item.length) { return; }
			var arr = item.get(0).dataset.path.split('/');
			nowData = contacts.list[arr[0]].list[arr[1]];
			$.extend(people, nowData.$model);
			router.go('/view/contacts-people');
		}
	});
	var people = avalon.define({
		$id: 'contacts-people',
		address: '',
		phone: '',
		name: '',
		picture: '',
		gopUserNick: '',
		id: '',
		click: function() {
			nickname.vm.id = people.id;
			nickname.vm.name = people.name;
		}
	});
	nickname.onFinish = function() {
		people.name = nowData.name = nickname.vm.name; // 同步
		tabs.guoren.list.length = tabs.wallet.list.length = 0; // 重新请求
	};
	avalon.scan();
	getList('guoren');

	setTimeout(function() {
		main.addClass('on');
	}, 100);
});


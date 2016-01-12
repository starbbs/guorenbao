

// 张树垚 2015-06-18 13:23:58 创建
// 吸顶条行为
// 1. 滚动条
// 2. 是否登录
// 3. 用户信息



define(['dom', 'api'], function(dom, api) {

	var time = 150, // 间隔时间

		$top = dom.top,
		topHeight = $top.height(),

		$win = dom.win,
		$wrap = dom.wrap,

		timer,
		hasAddScroll = false,
		checkScroll = function() {

			var height = $win.height() - topHeight;
			$wrap.height(height); // wrap高度
			var scrollHeight = $wrap[0].scrollHeight;

			// 是否出滚动条
			if (height < scrollHeight) {
				if (!hasAddScroll) {
					$top.addClass('top-scroll');
					hasAddScroll = true;
				}
			} else {
				if (hasAddScroll) {
					$top.removeClass('top-scroll');
					hasAddScroll =false;
				}
			}
		};

	checkScroll();
	$win.on('resize', function() {
		clearTimeout(timer);
		timer = setTimeout(checkScroll, time);		
	});

	var top = {
		loadStack: [],
		onLoad: function(fun) {
			top.loadStack.push(fun);
			return this;
		},
		show: function() {
			$top.animate({marginTop: 0}, 100);
			return this;
		}
	};

	var topLogin = $('.top-login');
	if (topLogin.length) { // 登录弹窗
		topLogin.on('click', function() {
			top.dialogLogin && top.dialogLogin.show();
		});
	}

	if ($('.top-logout').length) { // 如果这个登录后元素, 则请求

		var photoDefault = './images/temp-1.jpg';
		var vm = top.vm = avalon.define({
			$id: 'top',
			name: '尊敬的用户', // 名字(未认证则取手机号)
			phone: '尊敬的用户', // 手机号
			photo: photoDefault, // 头像(默认的)
			gop: '---',	// 果仁数
			cny: '---', // 人民币数
			time: (function() { // 时间
				var arr = [6, 9, 12, 14, 18, 25];
				var times = ['晚上', '早晨', '上午', '中午', '下午', '晚上'];
				var hour = new Date().getHours();
				for (var i = 0; i < arr.length; i++) {
					if (hour < arr[i]) {
						return times[i];
					}
				}
			})(),
			logout: function() {
				api.closeSession(function() {
					location.href = './index.htm';
				});
			}
		});
		avalon.scan($top.get(0), vm);

		api.getUserInfoTop(function(data) {
			if (data === 'null') { // 未登录时 返回登陆页
				return api.log('未登录! 输入"testLogin()"登录!');
				// return window.location.replace('./');
			}
			vm.name = data.name || data.phone;
			vm.phone = data.phone;
			vm.photo = data.photo || photoDefault;
			vm.gop = data.totalGops;
			vm.cny = data.totalMoney;
			if (top.loadStack.length) {
				loadStack.forEach(function(fun) {
					fun.call(this, data, vm);
				});
			}
		});
	}

	setTimeout(top.show, 17);

	return top;
});
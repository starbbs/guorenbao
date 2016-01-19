
// 张树垚 2015-11-27 10:46:47 创建
// 移动端 右侧移入页面 View类

define('h5-view', ['router', 'h5-alert'], function(router) {

	// 存在问题:
	// 1.缺少进入页面首次路由的触发判断
	// 2.判断分页顺序, 由dom结构判断而不是实例, 之后由分页顺序来显示隐藏

	router.view = {};
	var _list = router.view._list = []; // 所有列表
	var _reset = router.view._reset = function() { // 重置, 隐藏所有
		mainHide();
	};
	router.onRoot = function() { // 开始执行2次, 之后返回执行1次
		for (var i = 0; i < _list.length; i++) {
			// console.log(_list[i], router.view[_list[i]], router.view[_list[i]].isShowing)
			if (router.view[_list[i]].isShowing) {
				_reset();
				break;
			}
		}
	};
	router.get('/', ['all'], router.onRoot);
	router.get('/view/:name', [_list], function(name) {
		if (name in router.view) {
			router.view[name].show();
		}
	});

	var time = 500; // 运动时间, 使用的定时器, 没有绑定transitionEnd/animationEnd
	var main = $('.view');
	var removeAllClass = function() {
		_list.forEach(function(name) {
			var view = router.view[name];
			view.self.removeClass('show show-immediately hide hide-immediately');
			view.isShowing = false;
			view[stackMaker('hide')].length && view[stackMaker('hide')].forEach(function(callback) {
				callback.call(view);
			});
		});
		main.removeClass('hide hide-immediately');
	};
	var mainHide = function(ifHideImmediately) {
		if (ifHideImmediately) {
			main.addClass('hide-immediately');
			removeAllClass();
		} else {
			main.addClass('hide');
			setTimeout(function() {
				removeAllClass();
			}, time);
		}
	};

	var refreshList = [];
	var refreshTimer = null;
	var refresh = function() {
		main.children().each(function(i, item) {
			var name = item.className.split(' ')[0];
			refreshList[i] = name;
			if (name in router.view) {
				router.view[name].refreshIndex = i;
			} else {
				console.log('view:' + name + '不存在!');
			}
		});
	};
	var stackSupports = ['show', 'hide'];
	var stackMaker = function(name) {
		return 'on' + name[0].toUpperCase() + name.substr(1) + 'Stack';
	};
	var View = function(name) {

		// 注册
		if (_list.indexOf(name) > -1) { return alert(name + '已被添加到view上!'); }
		_list.push(name);
		router.view[name] = this;

		// 定义
		this.name = name;
		this.main = main;
		this.className = '.' + name;
		this.self = $(this.className); // choice -> .choice
		this.native = this.self.get(0);
		this.isShowing = false;

		stackSupports.forEach(function(name) {
			this[stackMaker(name)] = [];
		}.bind(this));

		// 排序
		clearTimeout(refreshTimer);
		refreshTimer = setTimeout(refresh, 300);
	};
	View.prototype.config = function(opts) {
		opts && $.extend(this, opts);
	};
	View.prototype.show = function(ifShowImmediately) {
		refreshList.slice(this.refreshIndex + 1).forEach(function(name) {
			name in router.view && router.view[name].hide(ifShowImmediately);
		});
		if (this.isShowing) { return; }
		this.isShowing = true;
		this.self.addClass(ifShowImmediately ? 'show-immediately' : 'show');
		this[stackMaker('show')].length && this[stackMaker('show')].forEach(function(callback) {
			callback.call(this);
		}.bind(this));
	};
	View.prototype.hide = function(ifHideImmediately, ifHideOthers) {
		if (!this.isShowing) { return; }
		this.isShowing = false;
		if (ifHideOthers) { // 同时隐藏其他所有views
			mainHide(ifHideImmediately);
		} else {
			var self = this.self;
			if (ifHideImmediately) {
				self.addClass('hide-immediately');
				self.removeClass('hide-immediately show');
			} else {
				self.addClass('hide');
				setTimeout(function() {
					self.removeClass('hide show');
				}, time);
			}
			self.addClass(ifHideImmediately ? 'hide-immediately' : 'hide');
		}
		this[stackMaker('hide')].length && this[stackMaker('hide')].forEach(function(callback) {
			callback.call(this);
		}.bind(this));
	};
	View.prototype.on = function(name, callback) {
		this[stackMaker(name)].push(callback);
	};

	return View;
});

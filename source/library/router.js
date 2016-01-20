
// 张树垚 2015-10-13 17:14:59 创建
// 路由器整合


define(['mmRouter', 'mmHistory'], function() {

	var obj = {};

	var hasInit = false;
	var router = {
		/**
		 * [router.init 初始化]
		 * @Author   张树垚
		 * @DateTime 2015-10-13
		 * @param    {json}      opts [avalon.history.start的传参]
		 * @return   {[type]}         [无返回]
		 */
		init: function(opts, ifRoot) {
			if (hasInit) { return; }
			hasInit = true;
			if (typeof opts === 'boolean') {
				ifRoot = opts;
				opts = {};
			}
			if (ifRoot) {
				setTimeout(function() {
					router.to('/');
				}, 100);
			}
			return avalon.history.start(avalon.mix({
				"hashPrefix": '!',
				"html5Mode": false,
				"basePath": '/'
			}, opts || {}));
		},
		/**
		 * [router.replace 替换规则中的变量]
		 * @Author   张树垚
		 * @DateTime 2015-10-13
		 * @param    {string}      name [规则]
		 * @param    {array}       arr  [变量数组]
		 * @return   {string}           [替换后的结果]
		 */
		replace: function(name, arr) {
			var i = 0;
			return name.replace(/\:\w+/g, function(string) {
				return arr[i++];
			});
		},
		/**
		 * [router.get 设置路由规则]
		 * @Author   张树垚
		 * @DateTime 2015-10-13
		 * @param    {string}      name      [监听路由规则, 语法"/step/:num"]
		 * @param    {array}       available [每个参数范围, 语法"[[0, 1, 2], 'all']", 数组每一项对应回调传参, "all"表示]
		 * @param    {Function}    callback  [回调, 传参为规则中的变量]
		 * @return   {[type]}                [avalon.get的返回值]
		 */
		get: function(name, available, callback) {
			if (name in obj) {
				return alert('路由规则' + name + '已存在!');
			}
			// name: /step/:num/:aaa
			obj[name] = callback;
			return avalon.router.get(name, function() {

				var args = Array.prototype.slice.call(arguments);
				var hash = router.replace(name, args);

				// 是否有效
				for (var i = 0; i < available.length; i++) {
					var arr = available[i];
					if(arr !== 'all') { // 有限制数组
						if (arr.indexOf(args[i]) === -1) { // 不存在
							setTimeout(function() {
								console.log('不存在');
								// window.history.back();
							}, 10);
							return false;
						}
					}
				}

				// 与上次相同则阻止触发
				// if (obj[name + '-last'] === hash) {return false;}
				// obj[name + '-last'] = hash;

				// 要做的事情
				return callback.apply(this, args);
			});
		},
		/**
		 * [router.go 跳转]
		 * @Author   张树垚
		 * @DateTime 2015-10-13 16:10:28
		 * @param    {string}      hash [跳转路由描述]
		 */
		go: function(hash) {
			// if (hash === '/') { // 回归根部
			// 	router.onRoot && router.onRoot();
			// } else {
			// 	var arr = hash.split('/');
			// 	if (arr[1] === 'view') {
			// 		if (arr[2] in router.view) {
			// 			router.view[arr[2]].show();
			// 		}
			// 	}
			// }
			avalon.router.navigate(hash);
		},
		/**
		 * [router.to 更换URL,不产生历史记录]
		 * @Author   张树垚
		 * @DateTime 2016-01-20 16:10:28
		 * @param    {string}      hash [跳转路由描述]
		 */
		to: function(hash) {
			avalon.router.redirect(hash);
		}
	};

	return router;
});





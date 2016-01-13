
// 张树垚 2015-12-11 15:00:41 创建
// H5微信端 首页


require(['router', 'authorization', 'h5-weixin'], function(router, authorization) {
	router.init(true);
	console.log(authorization.default);
	avalon.define({
		$id: 'index',
		renzheng: function() {
			window.location.href = authorization.default;
		}
	});
	avalon.scan();
	setTimeout(function() {
		router.go('/view/alert');
		setTimeout(function() {
			alert(location.href);
		}, 100);
	}, 200);
});





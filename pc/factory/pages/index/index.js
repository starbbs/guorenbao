

// 张树垚 2015-10-28 09:32:52 创建
// 果仁宝 首页



require(['top', 'tabs', 'dialog-login'], function(top, tabs, dialogLogin) {

	var vm = avalon.define({
		$id: 'index'
	});
	avalon.scan();

	tabs({
		mainCell: '.index-answers-box',
		titCell: '.index-answers-nav-item',
		tabCell: '.index-answers-tab',
	})

	// dialogLogin.show();
});












// 张树垚 2015-11-16 16:27:08 创建
// 银行卡js


require(['api', 'router', 'top', 'dialog-bank'], function(api, router, top, dialogBank) {

	'use strict';

	var vm = avalon.define({
		$id: 'bankcard',
	});
	avalon.scan();

	// router.get();
	router.init();

	dialogBank.show();

});





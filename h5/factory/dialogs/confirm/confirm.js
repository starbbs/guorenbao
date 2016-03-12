
// 张树垚 2016-01-07 16:02:03 创建
// H5微信端 --- dialog-confirm


define('h5-dialog-confirm', ['h5-dialog'], function(Dialog) {
	var confirm = new Dialog('confirm');
	var _button = confirm.self.find('.dialog-confirm-button').on('click',function(){
		confirm.hide();
		confirm.onConfirm();
	});
	var _cancelBtn = confirm.self.find('.dialog-confirm-cancel').on('click',function(){
		confirm.hide();
	});

	var _main = confirm.self.find('.dialog-main');

	var _html = function(html){
		this.html(html);
		return confirm;
	};
	//bing this转指针好用方法

	confirm.setCancel = _html.bind(_cancelBtn);
	confirm.setConfirm = _html.bind(_button);
	confirm.set = _html.bind(_main);

	confirm.onConfirm = $.noop;

	return confirm;
});

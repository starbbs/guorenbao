
// 张树垚 2015-12-29 16:22:52 创建
// H5微信端 --- dialog-alert


define('h5-dialog-alert', ['h5-dialog'], function(Dialog) {
	var alert = new Dialog('alert');
	var _button = alert.self.find('.dialog-button').on('click', function() {
		alert.onAlert&&alert.onAlert();
		alert.hide();
	});
	var _main = alert.self.find('.dialog-main');

	var _html = function(html) {
		this.html(html);
		return alert;
	};
	alert.set = _html.bind(_main); // 设置内容
	alert.button = _html.bind(_button); // 设置按钮文字
	
	//13-17行代码 等于以下
	/*
	alert.set = function(html){
		_main.html(html);
		return alert;	
	}
	*/
	//===============================
	alert.onAlert = $.noop;
	return alert;
});
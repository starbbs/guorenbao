
// 张树垚 2016-01-07 16:02:03 创建
// H5微信端 --- dialog-success


define('h5-dialog-success', ['h5-dialog'], function(Dialog) {
	var success = new Dialog('success');
	var _button =success.button = success.self.find('.dialog-button');

	var _main = success.self.find('.dialog-main');


	var _html = function(html){
		this.html(html);	
		return success;
	};
	//bing this转指针好用方法

	success.setSuccess = _html.bind(_button);
	success.set = _html.bind(_button);

	success.onSuccess = $.noop;


	success.on('show',success.onSuccess);	


	return success;
});

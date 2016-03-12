
// 张树垚 2016-01-07 16:02:03 创建
// H5微信端 --- dialog-success


define('h5-dialog-info', ['h5-dialog'], function(Dialog) {
	var info = new Dialog('info');
	var _button = info.self.find('.dialog-button').on('click',function(){
		info.onInfo && info.onInfo();
		info.hide();
	});;

	var _main = info.self.find('.dialog-main');
	var _mainTit = info.self.find('.dialog-info-title');
	var _mainList = info.self.find('.dialog-info-list');

	var _html = function(html){
		this.html(html);
		return info;
	};
	//bing this转指针好用方法

	info.setBtn = _html.bind(_button);
	info.setTit = _html.bind(_mainTit);	
	info.setList = _html.bind(_mainList);	

	info.setListHtml = function(arr){
		var html = '';
		arr.forEach(function(name){
			html+= '<li>'+name+'</li>';
		})
		return html;
	};

	info.setMain = _html.bind(_main);
	info.onInfo = $.noop;

	return info;
});

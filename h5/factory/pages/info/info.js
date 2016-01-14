
// 张树垚 2016-01-13 14:46:21 创建
// H5微信端 --- 消息


require(['api', 'router', 'get', 'h5-weixin'], function(api, router, get) {

	router.init(true);

	var gopToken = $.cookie('gopToken');

	// www.goopal.me/info.html?from=wx_info&type=1&id=...
	switch(get.data.from) {
		case 'wx_info': // 来自微信消息
			switch(get.data.type) {
				case '1':
					$.alert('微信消息, 类型1');
					break;
				case '2':
					$.alert('微信消息, 类型2');
					break;
				default:
					$.alert('不是正确的微信消息种类');
			}		
			break;
		default:
			$.alert('没有收到通知<br>即将跳转首页', function() {
				window.location.href = 'home.html';
			});
	}
});


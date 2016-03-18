
// 张树垚 2016-01-13 14:46:21 创建
// H5微信端 --- 消息


require(['api', 'router', 'get', 'h5-view-bill', 'h5-weixin'], function(api, router, get, billView) {

	router.init(false);

	var gopToken = $.cookie('gopToken');

	var gotoHome = function(msg) {
		$.alert(msg + '<br>即将跳转首页', function() {
			// window.location.href = 'home.html';
		});
	};

	// www.goopal.me/info.html?from=wx_info&type=1&id=...
	// info.html?from=wx_info&type=CONSUME_ORDER&id=1111
	// info.html?from=wx_info&type=BUYIN_ORDER&id=1111
	// info.html?from=wx_info&type=TRANSFER_IN&id=1111
	// info.html?from=wx_info&type=TRANSFER_OUT&id=1111
	var type = get.data.type.toUpperCase();   //get方法中有url.js  主要是得到地址栏的相应数据
	//get方法返回一个json｛data:'',parse:'',stringify:'',add:''｝
	//get.data = {from:wx_info,type:BUYIN_ORDER,id:1111}
	switch(get.data.from) {
		case 'wx_info': // 来自微信消息
			switch(type) {
				case 'CONSUME_ORDER': // 超时关闭消费果仁订单消息
				case 'BUYIN_ORDER': // 超时关闭买果仁订单消息
				case 'TRANSFER_IN': // 转入消息
				case 'TRANSFER_OUT': // 转出消息
					// window.location.href = 'transfer.html?from=wx_info&id=' + get.data.id;
					billView.set(type, get.data.id, {
						onRendered: function() {
							router.to('/view/bill');
						},
					});
					break;
				case 'DUOBAO_ACTIVITY': // 果仁夺宝
					gotoHome('果仁夺宝尚未上线!');
					break;
				default:
					gotoHome('不是正确的微信消息种类');
					break;
			}
			break;
		default:
			gotoHome('没有收到通知');
			break;
	}
});



// 张树垚 2015-12-11 15:00:41 创建
// H5微信端 首页


require(['authorization', 'touch-slide', 'h5-weixin'], function(authorization, TouchSlide) {
	var main = $('.welcome');
	TouchSlide({
		slideCell: 'welcome-banner',
		titCell: '.welcome-banner-nav .welcome-banner-nav-item',
		mainCell: '.welcome-banner-box',
		effect: 'leftLoop',
		autoPlay: true,
		delayTime: 500,
		interTime: 5000,
		titOnClassName: 'on'
	});
	avalon.define({
		$id: 'welcome',
		renzheng: function() {
			// window.location.href = authorization.default;
		}
	});
	avalon.scan();
	setTimeout(function() {
		main.addClass('on');
	}, 100);
});





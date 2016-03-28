
// 张树垚 2015-12-27 16:23:25 创建
// H5微信端 --- 微信授权链接


define(['get'], function(get) {
	// <a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx55923db8dfb94e44&redirect_uri=http%3A%2F%2Fwww.goopal.me%2Findex2222.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect">点击授权登录</a>
	var set = function(url) {
		return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx55923db8dfb94e44&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
	};
	var url = 'https://www.goopal.com.cn/wx/';
	return {
		// base: base,
		set: set,
		default: set(url)
	}
});



// 张树垚 2016-01-10 18:07:06 创建
// H5微信端 --- 微信分享


define('h5-weixin', ['api', 'url', 'h5-alert'], function(api, url) {
	var gopToken = $.cookie('gopToken');
	var base = 'www.goopal.com.cn/wx'; // 地址
	var weixin = {
		// 参数
		appId: null,
		timestamp: null,
		nonceStr: null,
		signature: null,
		// 分享
		title: '果仁宝',
		desc: '果仁宝，一站式消费理财新平台',
		link: window.location.protocol + '//' + base + '/welcome.html',
		imgUrl: window.location.protocol + '//' + base + '/images/share.jpg',
		type: '',
		dataUrl: '',
		success: function() { // 用户确认分享后执行的回调函数
			$.alert('分享成功');
		},
		cancel: function() { // 用户取消分享后执行的回调函数
			$.alert('分享取消');
		},
		/**
		 * [setShare 设置微信分享]
		 * @Author   张树垚
		 * @DateTime 2016-01-13 16:38:42
		 * @param    {[string]}         type        [分享类型, all, timeline, appMessage]
		 * @param    {[json]}           options       [分享标题]
		 *           {[string]}         options.title        [description]
		 *           {[string]}         options.desc         [description]
		 *           {[string]}         options.link         [description]
		 *           {[string]}         options.imgUrl         [description]
		 */
		setShare: function(type, options) {
			if (typeof type !== 'string') {
				options = type;
				type = 'all';
			}
			options = options || {};
			if (arguments.length === 0 || type === 'all' || type === 'timeline') { // 分享到朋友圈
				wx.onMenuShareTimeline($.extend({
					title: weixin.title, // 分享标题
					link: weixin.link, // 分享链接
					imgUrl: weixin.imgUrl, // 分享图标
					success: weixin.success,
					cancel: weixin.cancel,
				}, options));
			}
			if (arguments.length === 0 || type === 'all' || type === 'appMessage') {
				wx.onMenuShareAppMessage($.extend({
					title: weixin.title, // 分享标题
					desc: weixin.desc, // 分享描述
					link: weixin.link, // 分享链接
					imgUrl: weixin.imgUrl, // 分享图标
					type: weixin.type, // 分享类型,music、video或link，不填默认为link
					dataUrl: weixin.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
					success: weixin.success,
					cancel: weixin.cancel,
				}, options));
			}
		},
		pay: { // 支付
			options: { // 参数
				timestamp: '', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				nonceStr: '', // 支付签名随机串，不长于 32 位
				package: '', // 统一支付接口返回的prepay_id参数值，提交格式如:prepay_id=***）
				signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: '', // 支付签名
				success: function(res) { // 成功
					weixin.pay.onSuccess(res);
				},
				fail: function(res) { // 失败
					alert('微信支付失败:\n' + JSON.stringify(res));
					weixin.pay.onFail(res);
				},
				cancel: function(res) { // 取消
				},
				trigger: function(res) { // 菜单点击
				},
				complete: function(res) { // 完成
					weixin.pay.onComplete(res);
				},
			},
			set: function(pay) {
				$.extend(weixin.pay.options, {
					timestamp: pay.timeStamp,
					nonceStr: pay.nonceStr,
					package: pay.package,
					signType: pay.signType,
					paySign: pay.paySign,
				});
			},
			create: function(money, callback) {
				api.createBuyinOrder({ // 创建买入订单
					gopToken: gopToken,
					orderMoney: money,
					payType: 'WEIXIN_MP_PAY'
				}, function(data) {
					if (data.status == 200) {
						weixin.pay.set(data.data.WEIXIN_MP_PAY);
						weixin.pay.onCreate(data);
						callback && callback(data);
					} else {
						$.alert(data.msg);
						console.log(data);
					}
				});
			},
			work: function() {
				wx.chooseWXPay(weixin.pay.options);
			},
			onCreate: $.noop,
			onSuccess: $.noop,
			onFail: $.noop,
			onComplete: $.noop,
		},
	};

	api.weixinInfo({
		// url: encodeURIComponent(window.location.href)
		url: url.url + url.search
	}, function(data) {
		if (data.status == 200) {
			var returnData = data.data.signatureData;
			wx.config({
				debug: false, // 开启调试模式，调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: weixin.appId = returnData.appId, // 必填，公众号的唯一标识
				timestamp: weixin.timestamp = returnData.timestamp, // 必填，生成签名的时间戳
				nonceStr: weixin.nonceStr = returnData.nonceStr, // 必填，生成签名的随机串
				signature: weixin.signature = returnData.signature, // 必填，签名，见附录1
				jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					// 分享接口
					'onMenuShareTimeline', // 微信分享到朋友圈
					'onMenuShareAppMessage', // 分享给朋友
					'onMenuShareQQ', // 分享到QQ
					'onMenuShareWeibo', // 分享到腾讯微博
					'onMenuShareQZone', // 分享到QQ空间
					// 音频接口
					'startRecord', // 开始录音
					'stopRecord', // 停止录音
					'onVoiceRecordEnd', // 监听录音自动停止
					'playVoice', // 播放语音接口
					'pauseVoice', // 暂停播放
					'stopVoice', // 停止播放
					'onVoicePlayEnd', // 监听语音播放完毕
					'uploadVoice', // 上传语音
					'downloadVoice', // 下载语音
					// 图像接口
					'chooseImage', // 拍照或从手机相册中选图接口
					'previewImage', // 预览图片接口
					'uploadImage', // 上传图片接口
					'downloadImage', // 下载图片接口
					// 智能接口
					'translateVoice', // 识别音频并返回识别结果
					// 设备信息
					'getNetworkType', // 获取网络状态
					// 地理位置
					'openLocation', // 使用微信内置地图查看位置
					'getLocation', // 获取地理位置
					// 界面操作
					'hideOptionMenu', // 隐藏右上角菜单
					'showOptionMenu', // 显示右上角菜单
					'hideMenuItems', // 批量隐藏功能按钮
					'showMenuItems', // 批量显示功能按钮
					'hideAllNonBaseMenuItem', // 隐藏所有非基础按钮
					'showAllNonBaseMenuItem', // 显示所有功能按钮
					'closeWindow', // 关闭当前网页窗口
					// 微信扫一扫
					'scanQRCode', // 调起微信扫一扫
					// 微信支付
					'chooseWXPay', // 发起一个微信支付请求
					// 微信小店
					'openProductSpecificView', // 跳转微信商品页
					// 微信卡券
					'addCard', // 批量添加卡券
					'chooseCard', // 拉取适用卡券列表并获取用户选择信息
					'openCard', // 查看微信卡包中的卡券
					// 摇一摇周边
					'startSearchBeacons', // 开启查找周边ibeacon设备
					'stopSearchBeacons', // 关闭查找周边ibeacon设备
					'onSearchBeacons', // 监听周边ibeacon设备
				]
			});
			wx.ready(function() {
				// wx.hideOptionMenu(); // 隐藏右上角菜单接口
				wx.hideMenuItems({
					menuList: [ // 批量隐藏功能按钮接口
						// 基本类
						"menuItem:exposeArticle", // 举报
						"menuItem:setFont", // 调整字体
						"menuItem:dayMode", // 日间模式
						"menuItem:nightMode", // 夜间模式
						// "menuItem:refresh", // 刷新
						// "menuItem:profile", // 查看公众号（已添加）
						// "menuItem:addContact", // 查看公众号（未添加）
						// 传播类
						// "menuItem:share:appMessage", // 发送给朋友
						// "menuItem:share:timeline", // 分享到朋友圈
						"menuItem:share:qq", // 分享到QQ
						"menuItem:share:weiboApp", // 分享到Weibo
						// "menuItem:favorite", // 收藏
						"menuItem:share:facebook", // 分享到FB
						"menuItem:share:QZone", // 分享到 QQ 空间
						// 保护类
						"menuItem:editTag", // 编辑标签
						"menuItem:delete", // 删除
						"menuItem:copyUrl", // 复制链接
						"menuItem:originPage", // 原网页
						"menuItem:readMode", // 阅读模式
						"menuItem:openWithQQBrowser", // 在QQ浏览器中打开
						"menuItem:openWithSafari", // 在Safari中打开
						"menuItem:share:email", // 邮件
						"menuItem:share:brand", // 一些特殊公众号
					]
				});
				weixin.setShare();
			});
		} else { //状态码分支
			console.log(data);
		}
	});

	return weixin;
});
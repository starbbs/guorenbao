

// 张树垚 2015-12-03 11:16:36 创建
// 临时页面 点卡



require(['top', 'dialog'], function(top, Dialog) {

	var dialogGamecards = new Dialog('.dialog-gamecards');
	var dialogSuccess = new Dialog('.dialog-success');

	var vm = avalon.define({
		$id: 'gamecards',
		list: [
			{
				src: 'http://pimg1.126.net/shop/content-image/3592_101_20131122113555.jpg',
				name: '星际争霸2'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3573_101_20130204083237.png',
				name: '梦幻西游'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/dixiachengyuyongshi.png',
				name: '地下城与勇士'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3578_101_20130201185209.png',
				name: '倩女幽魂'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3574_101_20130204202814.png',
				name: '大话西游2'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3579_101_20130205145834.png',
				name: '大唐无双2'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3587_101_20130204202927.png',
				name: '天下3'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/3586_101_20130205145912.png',
				name: '武魂'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/chuanyuehuoxian.png',
				name: '穿越火线'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/shengdadianquan.png',
				name: '盛大在线'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/wendao.png',
				name: '问道'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/24_101_20130201185455.png',
				name: '摩尔庄园'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/jianxia2waizhuan.jpg',
				name: '新剑侠外传2燕云剑戈'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/GTjinwutuan2.png',
				name: '劲舞团2'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/wendaowaizhuan.png',
				name: '问道外传'
			},
			{
				src: 'http://pimg1.126.net/shop/content-image/wanmeishijieguojiban.png',
				name: '完美世界'
			}
		],
		click: function(item) {
			vm.name = item.name;
			dialogGamecards.show();
		},
		name: '',
		next: function() {
			vm.number = Math.random() * 1e16 + 1e16;
			vm.password = Math.random() * 1e17 + 1e17;
			dialogSuccess.show();
		},
		number: 0,
		password: 0,
		confirm: function() {
			dialogSuccess.hide(true);
		}
	});
	avalon.scan();
});











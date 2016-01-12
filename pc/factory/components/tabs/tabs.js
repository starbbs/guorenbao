
// 张树垚 2015-11-16 10:50:40 创建
// 标签切换插件


define('tabs', function() {

	var Tabs = function(opts) {
		this.init($.extend({
			mainCell: 'body', // 包裹层
			titCell: null, // 点击元素
			tabCell: null, // 切换元素
			titClass: 'on', // 点击元素class
			tabClass: 'on', // 切换元素class
			defaultIndex: 0, // 默认初始索引
		}, opts));
	};
	Tabs.prototype.init = function(opts) { // 初始
		var _this = this;
		this.main = $(opts.mainCell);
		this.tits = this.main.find(opts.titCell).on('click', function() {
			_this.set($(this).index());
		});
		this.tabs = this.main.find(opts.tabCell);
		this.titClass = opts.titClass;
		this.tabClass = opts.tabClass;
		this.set(opts.defaultIndex);
	};
	Tabs.prototype.set = function(index) { // 直接切换
		this.tits.removeClass(this.titClass).eq(index).addClass('on');
		this.tabs.removeClass(this.tabClass).eq(index).addClass('on');
	};

	var tabs = function(opts) {
		return new Tabs(opts);
	};

	return tabs;
});


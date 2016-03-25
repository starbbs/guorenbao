// 张树垚 2015-12-17 18:13:15 创建
// H5微信端 -- 浮层


define('h5-dialog', [], function() {

	var _dialogsArr = []; // 所有浮层列表.数组
	var _dialogsJson = {}; // 所有浮层列表.JSON
	var _duration = 400; // 运动时间
	var main = $('.dialog');

	main.on('touchmove', function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		return false;
	});
	main.isShowing = false;
	main.show = function() {
		if (main.isShowing) {
			return;
		}
		main.isShowing = true;
		main.addClass('on');
		return this;
	};
	main.hide = function(ifHideImmediately) {
		if (!main.isShowing) {
			return;
		}
		main.isShowing = false;
		main.removeClass('on');
		return this;
	};

	var stackSupports = ['show', 'hide'];
	var stackMaker = function(name) {
		return 'on' + name[0].toUpperCase() + name.substr(1) + 'Stack';
	};
	var Dialog = function(name) {

		_dialogsArr.push(this);

		this.name = name;
		this.className = '.dialog-' + name;
		this.self = $(this.className);
		this.native = this.self.get(0);

		stackSupports.forEach(function(name) {
			this[stackMaker(name)] = [];
		}.bind(this));

		this.reset();
	};
	Dialog.prototype.main = main; // .dialog
	Dialog.prototype.reset = function() { // 重置
		this.self.removeClass('show show-immediately hide hide-immediately');
		this.isShowing = false;
	};
	/**
	 * [show description]
	 * @Author   张树垚
	 * @DateTime 2016-01-07 10:24:54
	 * @param    {[boolean]}         ifShowImmediately      [是否立即显示, 默认false]
	 * @param    {[boolean]}         ifHideOthers           [是否隐藏其他浮层, 默认false]
	 * @param    {[array]}           HideArr                [隐藏指定的浮层, 数组是浮层的名称集合]
	 * @return   {[this]}                                   [返回自己]
	 */
	Dialog.prototype.show = function(ifShowImmediately, ifHideOthers, HideArr) { // 隐藏
		if (this.isShowing) {
			return;
		}
		this.isShowing = true;
		this.main.show();
		this.self.show();
		this[stackMaker('show')].length && this[stackMaker('show')].forEach(function(callback) {
			callback.call(this);
		}.bind(this));
		setTimeout(function() {
			this.self.addClass(ifShowImmediately ? 'show-immediately' : 'show');
		}.bind(this), 10);
		return this;
	};
	Dialog.prototype.hide = function(ifHideImmediately, ifNotHideMain) { // 显示
		if (!this.isShowing) {
			return;
		}
		this.isShowing = false;
		this.self.addClass(ifHideImmediately ? 'hide-immediately' : 'hide');
		this[stackMaker('hide')].length && this[stackMaker('hide')].forEach(function(callback) {
			callback.call(this);
		}.bind(this));
		setTimeout(function() {
			this.reset();
			this.self.hide();
			this.main.hide();
		}.bind(this), ifHideImmediately ? 10 : _duration);
		return this;
	};
	Dialog.prototype.on = function(name, callback) {
		this[stackMaker(name)].push(callback);
	};
	Dialog.prototype.off = function(name, callback) {};
	return Dialog;
});

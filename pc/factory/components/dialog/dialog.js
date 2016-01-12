
// 弹出层js

define(function() {

	var Dialog = function(name, options) {
		var main = $(name); // .dialog-box的下一层选择器
		var box = main.closest('.dialog-box');
		$.extend(this, {
			main: main,
			box: box,
			close: box.find('.dialog-close'),
			beforeShow: $.noop,
			onShow: $.noop,
			beforeHide: $.noop,
			onHide: $.noop
		}, options);
		dialogList.push(this);
		this.init();
	};
	var dialogShow = null;
	var dialog = Dialog.dialog = $('.dialog');
	var dialogList = Dialog.dialogList = [];
	var aniTime = Dialog.aniTime = 300;
	Dialog.prototype.init = function() {
		this.close.on('click', function() {
			this.hide(true);
		}.bind(this));
	};
	Dialog.prototype.show = function(force, fnEnd) { // 1.打开 2.切换
		if ($.isFunction(force)) {
			fnEnd = force;
			force = false; // 强制, 立即
		}
		var time = force ? 0 : aniTime;
		if (dialogShow) {
			if (dialogShow === this) { return; }
			// 切换
			this.beforeShow.call(this);
			dialogShow.hide();
			dialogShow = this;
			this.box.fadeIn(time, function() {
				this.onShow.call(this);
				fnEnd && fnEnd.call(this);
			}.bind(this));
		} else {
			// 打开
			this.beforeShow.call(this);
			dialogShow = this;
			this.box.show().css('opacity', 1);
			dialog.fadeIn(time, function() {
				this.onShow.call(this);
				fnEnd && fnEnd.call(this);
			}.bind(this));
		}
	};
	Dialog.prototype.hide = function(all, fnEnd) { // 关闭
		if (all !== true && !dialogShow) { return; }
		if ($.isFunction(all)) {
			fnEnd = all;
			all = false;
		}
		dialogShow = null;
		this.beforeHide.call(this);
		var box = all ? dialog : this.box;
		box.fadeOut(aniTime, function() {
			this.box.hide();
			this.onHide.call(this);
			fnEnd && fnEnd.call(this);
		}.bind(this));
	};

	return Dialog;
});











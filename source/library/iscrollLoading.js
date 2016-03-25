/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
define('iscrollLoading', ['iScroll4'], function(iScroll4) {
	var bottomHeight = 20; // 下拉加载的高度
	var iscrollLoading = {};

	//以下 上拉  下拉刷新的  业务函数	
	iscrollLoading.beforeScrollStart = function() {}; //开始移动前
	iscrollLoading.scrollMove = function() {}; //手指移动时候
	iscrollLoading.beforeScrollEndTrue = function() {}; //手指移开前 满足条件
	iscrollLoading.beforeScrollEndFalse = function() {}; //手指移开前 不满足条件
	iscrollLoading.scrollEnd = function() {}; //滑动完成后	
	iscrollLoading.downLoadingData = function() {}; //下拉加载数据API
	iscrollLoading.upLoadingData = function() {}; //上拉加载数据API

	//添加订阅事件用的
	['onBeforeScrollStart', 'onScrollMove', 'onBeforeScrollEnd', 'onScrollEnd'].forEach(function(name) {
		iscrollLoading[name] = [];
	});
	iscrollLoading.on = function(name, cbFn) {
		iscrollLoading[name].push(cbFn);
	};

	iscrollLoading.set = function(id, options) {
		if (!id) {
			return;
		}
		options = options || {};

		options = $.extend({
			vScrollbar: false,
			preventDefault: true,
			fixedScrollbar: true,
			useTransition: true,
			click: true,
			onBeforeScrollStart: function() {
				iscrollLoading['onBeforeScrollStart'].length && iscrollLoading['onBeforeScrollStart'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onScrollMove: function() {
				if (this.y >= 0 && options.userUp) {
					iscrollLoading.scrollMove && iscrollLoading.scrollMove();
				}
				iscrollLoading['onScrollMove'].length && iscrollLoading['onScrollMove'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onBeforeScrollEnd: function() { //松手时
				if (this.y >= 60 && options.userUp) {
					iscrollLoading.beforeScrollEndTrue && iscrollLoading.beforeScrollEndTrue();
				} else {
					iscrollLoading.beforeScrollEndFalse && iscrollLoading.beforeScrollEndFalse();
				}
				iscrollLoading['onBeforeScrollEnd'].length && iscrollLoading['onBeforeScrollEnd'].forEach(function(cbFn) {
					cbFn();
				});
			},
			onScrollEnd: function() {
				//长帐单
				if (this.y < 0 && (this.y - bottomHeight < this.maxScrollY) && options.userDown) {
					iscrollLoading.scrollEnd && iscrollLoading.scrollEnd();
				}
				iscrollLoading['onScrollEnd'].length && iscrollLoading['onScrollEnd'].forEach(function(cbFn) {
					cbFn();
				});
			},
		}, options);
		return iScroll4Obj = (new iScroll4(id, options));
	};

	return iscrollLoading;
});
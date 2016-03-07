

// Zepto的个人补充
// 张树垚 2015年02月25日11:47:16 创建
// 根据自己的喜好,习惯添加的一些常用功能



// 我的Zepto命名空间
$.zsy = {
	default_time: 0.5,		// 默认运动时间
	default_type: "linear"	// 默认运动方式
};



// Zepto对象,追加方法

$.fn.transition = function(transition) {
	if (!arguments.length) {transition = ".3s all ease"};
	return this.css($.fx.cssPrefix + "transition", transition);
};



/**
 * [x 设置translateX]
 * @param  {[css_length]}	x	[设置translateX,值为百分比,像素等,不带单位会加px]
 * @return {[zepto_object]}		[返回this]
 */
$.fn.x = function(x) {
	if (parseInt(x) == x) {x = x + "px"};
	return this.css("-webkit-transform", "translateX(" + x + ")");
};

/**
 * [toX 运动translateX]
 * @param  {[css_length]}	x     [设置translateX,值为百分比,像素等,不带单位会加px]
 * @param  {[time]}			time  [时间,单位s]
 * @param  {[str]}			type  [运动方式,ease、linear等]
 * @param  {[function]}		fnEnd [运动完成后执行的回调]
 * @return {[zepto_object]}       [返回this]
 */
$.fn.toX = function(x, time, type, fnEnd) {
	var default_time = 0.6;
	var default_type = "ease";
	if (parseInt(x) == x) {x = x + "px"};
	if ($.isFunction(time)) {
		fnEnd = time;
		time = default_time;
	};
	return this.anim({"-webkit-transform": "translateX(" + x + ")"}, time || default_time, type || default_type, fnEnd);
};


/**
 * [y 设置translateY]
 * @param  {[css_length]}	y	[设置translateY,值为百分比,像素等,不带单位会加px]
 * @return {[zepto_object]}		[返回this]
 */
$.fn.y = function(y) {
	if (parseInt(y) == y) {y = y + "px"};
	return this.css("-webkit-transform", "translateY(" + y + ")");
};

/**
 * [toY 运动translateY]
 * @param  {[css_length]}	y     [设置translateY,值为百分比,像素等,不带单位会加px]
 * @param  {[time]}			time  [时间,单位s]
 * @param  {[str]}			type  [运动方式,ease、linear等]
 * @param  {[function]}		fnEnd [运动完成后执行的回调]
 * @return {[zepto_object]}       [返回this]
 */
$.fn.toY = function(y, time, type, fnEnd) {
	var default_time = 0.6;
	var default_type = "ease";
	if (parseInt(y) == y) {y = y + "px"};
	if ($.isFunction(time)) {
		fnEnd = time;
		time = default_time;
	};
	return this.anim({"-webkit-transform": "translateY(" + y + ")"}, time || default_time, type || default_type, fnEnd);
};



$.fn.scale = function(scale, time, type, fnEnd) {
	if (!arguments.length) { // 没有参数,返回样式
		return this.css("-webkit-transform");
	};
	if (arguments.length == 1) { // 1个参数,设置样式
		return this.css("-webkit-transform", "scale(" + scale + ")");
	};
	// 多个参数,运动
	var default_time = 0.6;
	var default_type = "linear";
	if ($.isFunction(time)) {
		fnEnd = time;
		time = default_time;
	} else if ($.isFunction(type)) {
		fnEnd = type;
		type = default_type;
	}
	return this.anim({"-webkit-transform": "scale(" + scale + ")"}, time || default_time, type || default_type, fnEnd);
};



$.fn.rotate = function(rotate, time, type, fnEnd) {
	if (!arguments.length) { // 没有参数,返回样式
		return this.css("-webkit-transform");
	};
	if (parseInt(rotate) == rotate) {rotate = rotate + "deg"};
	if (arguments.length == 1) { // 1个参数,设置样式
		return this.css("-webkit-transform", "rotate(" + rotate + ")");
	};
	// 多个参数,运动
	var default_time = 0.6;
	var default_type = "linear";
	if ($.isFunction(time)) {
		fnEnd = time;
		time = default_time;
	} else if ($.isFunction(type)) {
		fnEnd = type;
		type = default_type;
	}
	return this.anim({"-webkit-transform": "rotate(" + rotate + ")"}, time || default_time, type || default_type, fnEnd);
};


/**
 * [fadeIn 淡入]
 * @param  {[time]}			time  [时间,单位s]
 * @param  {[function]}		fnEnd [运动完成后执行的回调]
 * @return {[zepto_object]}       [返回this]
 */
$.fn.fadeIn = function(time, fnEnd) {
	if (!arguments.length) {
		time = 0.4;
	};
	if ($.isFunction(time)) {
		fnEnd = time;
		time = 0.4;
	};
	return this.show().anim({opacity: 1}, time, "linear", fnEnd);
};

/**
 * [fadeOut 淡出]
 * @param  {[time]}			time  [时间,单位s]
 * @param  {[function]}		fnEnd [运动完成后执行的回调]
 * @return {[zepto_object]}       [返回this]
 */
$.fn.fadeOut = function(time, fnEnd) {
	if (!arguments.length) {
		time = 0.4;
	};
	if ($.isFunction(time)) {
		fnEnd = time;
		time = 0.4;
	};
	var self = this;
	return this.anim({opacity: 0}, time, "linear", function() {
		self.hide();
		fnEnd && fnEnd.call(this);
	});
};



// Zepto工具追加方法

/**
 * [loader 绑定图片加载]
 * @param  {string}		selector	[需要加载的图片的容器]
 * @param  {string}		attr		[图片上保存src的属性]
 * @param  {function}	fnOne		[每加载一张图片后触发的回调函数,会传入fnOne(i, count),当前个数,总个数]
 * @param  {function}	fnEnd		[所有图片都加载完成后触发的回调函数,会传入fnEnd(count),总个数]
 * @return {undefined}	undefined	[没有返回值]
 */
// $.loader("body", "_src", function(i, count) { // 同步加载
// 	i // 第几个
// 	count // 总数
// }, function(count) {
// 	// 全部加载完
// });
// "<audio src=""></audio>"
// $.loader(".loader", "_src", null, function() { // 加载加载页
// 	var loader = $(".loader").fadeIn(0.3, function() { // 加载页显示
// 		$.loader("", "_src", function(i, c) { // 加载主页面
// 			$(".loader_span").html(i/c); // 显示加载进度
// 		}, function() {
// 			setTimeout(function() {
// 				loader.fadeOut(0.3, function() { // 加载页隐藏
// 					$("[_src2]", "_src2"); // 加载次要图片
// 				});
// 			}, 500);
// 		});
// 	});
// });
$.loader = function(selector, attr, fnOne, fnEnd) {
	var i = 0;
	var srcs = [];
	/*var imgs = $(selector).each(function(i, img) { // 异步加载
		var src = img.getAttribute(attr);
		if(srcs.indexOf(src) == -1) { // 第一次
			img.onload = function() { // 会出现22 12 的情况
				i++;
				fnOne && fnOne(i, count);
				if(i == count) {
					fnEnd && fnEnd(count);
					imgs = srcs = null;
				}
				img = img.onload = null;
			};
		} else {
			i++;
			fnOne && fnOne(i, count);
		}
		img.src = src;
		img.removeAttribute(attr);
	});*/
	var imgs = typeof selector === "string" ?
			$(selector + " [" + attr + "]") :
			$(selector).find("[" + attr + "]");
	var count = imgs.length;
	if(count == 0) {
		fnEnd && fnEnd(0);
		return;
	}

	(function () { // 同步加载
		var load = arguments.callee;
		if(i == count) {
			// var name =  (typeof selector === "string" ? selector : "." + selector.get(0).className) + " [" + attr + "]";
			// console.log(name + " 图片加载完成,count:", count);
			fnEnd && fnEnd(count);
			imgs = srcs = null;
			return;
		}
		var img = imgs[i];
		var src = img.getAttribute(attr);
		if(srcs.indexOf(src) == -1) {
			srcs.push(src);
			img.onload = function() {
				i++;
				fnOne && fnOne(i, count);
				img = img.onload = null;
				load();
			};
		} else {
			i++;
			fnOne && fnOne(i, count);
			load();
		}
		img.src = src;
		img.removeAttribute(attr);
	})();
};


$.aniframe = function(fn) {
	// return window[$.fx.cssPrefix.replace(/-/g, "") + "RequestAnimationFrame"](fn);
	return window.requestAnimationFrame(fn) ||
			window.webkitRequestAnimationFrame(fn) ||
			setTimeout(fn, 1000 / 60);
};
$.zsy.resize = function(onVertical, onHorizontal) { // 横竖屏
	var onResize = function() {
		if (window.orientation == 180 || window.orientation == 0 || window.innerHeight > window.innerWidth) { // 竖屏
			onVertical && onVertical();
		}
		if (window.orientation == 90 || window.orientation == -90 || window.innerHeight <= window.innerWidth) { // 横屏
			onHorizontal && onHorizontal();
		}
	}
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", onResize, false);
	onResize();
};

// $.os.weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0
$.os.weixin = /micromessenger/i.test(navigator.userAgent);
















// 张树垚 2015-06-18 13:43:19 创建
// dom 主要节点和属性缓存


define(function() {

	var win = $(window),
		res = {
			doc: $(document),
			win: win,
			body: $("body"),
			wrap: $(".wrap"),
			top: $(".top"),
			container: $(".container"),
			header: $(".header"),
			footer: $(".footer")
		};

	return res;
});



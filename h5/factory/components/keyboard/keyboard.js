// 张树垚 2016-03-07 10:18:14 创建
// H5微信端 --- component-keyboard 键盘控制插件组


define(function() {

	var handles = { // 控制器
		hide: function(id) { // 写法: data-keyboard="hide(id)" (id不用带引号)
			var self = $(this);
			var input = $('#' + id)
				.on('focus', function() {
					self.hide();
				})
				.on('blur', function() {
					self.show();
				})
		},
	};

	var scan = function(context) { // 扫描
		$('[data-keyboard]', context).each(function(i, element) {
			element.dataset.keyboard.split('|').forEach(function(string) {
				var match = string.match(/(\w+)(\(([\w\,\-]+)\))?/);
				// hide				["hide", "hide", undefined, undefined]
				// hide(id)			["hide(id)", "hide", "id"]
				// hide(id,111)		["hide(id,111)", "hide", "id,111"]
				if (match && match[1] in handles) {
					handles[match[1]].apply(element, match[3] ? match[3].split(',') : []);
				}
			});
		});
	};

	scan();

	return {
		scan: scan,
	};
});
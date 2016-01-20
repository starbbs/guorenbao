
// 张树垚 2015-12-28 16:42:53 创建
// H5微信端 --- 支付js


define('h5-paypass', ['check'], function(check) {
	var scan = function(context) {
		$('.paypass input', context).each(function(i, native) {
			var input = $(native);
			if (native._hasBindPaypassInput) { return; }
			native._hasBindPaypassInput = true;
			var items = input.next().children();
			native.paypassClear = function() {
				native.value = '';
				items.removeClass('on');
			};
			input.on('input', function() {
				for (var i = 0; i < items.length; i++) {
					var item = items.eq(i);
					if (item.hasClass('on')) {
						if (i >= this.value.length) {
							item.removeClass('on');
						}
					} else {
						if (i < this.value.length) {
							item.addClass('on');
						}
					}
				}
			});
		});
	};
	scan();
	return {
		scan: scan
	};
});


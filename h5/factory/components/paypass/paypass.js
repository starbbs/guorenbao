
// 张树垚 2015-12-28 16:42:53 创建
// H5微信端 --- 支付js


define('h5-paypass', ['check'], function(check) {
	var scan = function(context) {
		$('.paypass input', context).forEach(function(input) {
			input = $(input);
			var native = input.get(0);
			if (native._hasBindPaypassInput) { return; }
			native._hasBindPaypassInput = true;
			input.on('input', function() {
				// items.removeClass('on').slice(0, this.value.length).addClass('on');
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
			var items = input.next().children();
		});
	};
	scan();
	return {
		scan: scan
	};
});


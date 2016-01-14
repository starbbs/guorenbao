
// 张树垚 2015-12-27 17:37:42 创建
// H5微信端 --- components-text


define('h5-text', ['check'], function(check) {
	var checkClose = function(value, close) {
		close[value ? 'addClass' : 'removeClass']('on');
	};
	var checkEye = function(input) {
		input[input.attr('type') === 'text' ? 'removeClass' : 'addClass']('on');
	};
	var checkSafe = function(input, safe) {
		var level = '低中高'.indexOf(check.safe(input.val())) + 1; // 1,2,3
		safe.get(0).className = 'text-safe' + ' s' + level;
	};
	var bind = {
		close: function(input) {
			input = $(input).on('input', function() {
				checkClose(this.value, close);
			});
			var close = input.closest('.text').find('.text-close').on('touchstart', function() {
				close.removeClass('on');
				input.val('').get(0).focus();
			});
			checkClose(input.val(), close);
		},
		eye: function(input) {
			input = $(input);
			var eye = input.closest('.text').find('.text-eye').on('touchstart', function() {
				if (eye.hasClass('on')) {
					eye.removeClass('on');
					input.attr('type', 'password');
				} else {
					eye.addClass('on');
					input.attr('type', 'text');
				}
			});
			checkEye(input);
		},
		safe: function(input) {
			input = $(input).on('input', function() {
				checkSafe(input, safe);
			});
			var safe = input.closest('.text').find('.text-safe');
			checkSafe(input, safe);
		}
	};
	var scan = function(context) {
		$('input[data-text]', context).each(function(i, input) {
			input.dataset.text.split('|').forEach(function(name) {
				name in bind ? bind[name](input) : console.log('[Error] h5-text "' + name + '" do not exist!');
			});
			input.removeAttribute('data-text');
		});
	};
	scan();
	return {
		scan: scan
	};
});

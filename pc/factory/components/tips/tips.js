
// 张树垚 2015-11-04 14:00:58 创建
// 提示框


define('tips', ['check'], function(check) {

	// 加在input标签上
	// data-tips=""				提示类型: one(1条提示)
	// data-tips-word=""		默认文字: "xxx"(1条)

	var tips = {};

	var Tip = tips.Tip = function(element) {
		this.element = element;
		this.self = $(element);
		element.tip = this;
		var _element = this.element = $(element); // input标签
		this.type = _element.attr('data-tips');
		this.word = _element.attr('data-tips-word');
	};
	Tip.prototype.init = function() {
		var offset = this.element.offset();
	};
	Tip.prototype.show = function() {};
	Tip.prototype.hide = function() {};

	tips.selector = 'input[data-tips]';
	tips.scan = function(context) {
		$(tips.selector, context).each(function() {
			new Tip(this);
		});
	};

	return tips;
});





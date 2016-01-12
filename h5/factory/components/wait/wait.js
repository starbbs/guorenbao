
// 张树垚 2016-01-12 15:31:58 创建
// H5微信端 --- component-wait 等待


define('h5-wait', function() {
	/**
	 * [wait 等待]
	 * @Author   张树垚
	 * @DateTime 2016-01-12T16:15:08+0800
	 * @param    {[string|null]}      text     [有内容则显示内容和小数点, 没有内容则暂停显示, 后续跟.html()再设置]
	 * @return   {[jQurey]}                    [返回jQuery或Zepto对象]
	 */
	$.fn.wait = function(text) {
		var el = this.get(0);
		if (!text) { // 停止
			clearInterval(el.waitTimer);
			delete el.waitTimer;
		} else { // 开始
			var count = 0;
			clearInterval(el.waitTimer);
			el.waitTimer = setInterval(function() {
				this.html(text + '....'.slice(0, ++count % 4));
			}.bind(this), 1000);
		}
		return this;
	};
});



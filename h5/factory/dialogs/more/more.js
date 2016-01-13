
// 张树垚 2016-01-09 22:11:57 创建
// H5微信端 --- dialog-more 订单-更多


define('h5-dialog-more', ['h5-dialog'], function(Dialog) {
	var more = new Dialog('more');
	var vm = more.vm = avalon.define({
		$id: 'dialog-more',
		orderId: '',
		flowId: '',
		close: function(ev) {
			if (ev.target == this) {
				more.hide();
			}
		}
	});
	avalon.scan(more.native, vm);
	return more;
});

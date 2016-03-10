// 张树垚 2015-12-22 18:00:56 创建
// H5微信端 --- 联系人备注名修改


define('h5-view-nickname', ['h5-view', 'api', 'h5-text'], function(View, api) {
	var gopToken = $.cookie('gopToken');
	var nicknameView = new View('nickname');
	var vm = avalon.define({
		$id: 'nickname',
		nickname: '',
		id: '',
		callback: $.noop,
		nickname_click: function() {
			api.updateRemark({
				gopToken: gopToken,
				remark: vm.nickname,
				personId: vm.id,
			}, function(data) {
				if (data.status == 200) {
					vm.callback();
					if (nicknameView.onFinish() === false) {

					} else {
						window.history.back();
					}
				} else {
					console.log(data);
				}
			});
		}
	});
	return $.extend(nicknameView, {
		onFinish: $.noop, // return false 时, 取消默认后退
		vm: vm
	});
});
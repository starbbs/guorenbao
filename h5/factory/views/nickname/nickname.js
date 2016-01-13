
// 张树垚 2015-12-22 18:00:56 创建
// H5微信端 --- 联系人备注名修改


define('h5-view-nickname', ['h5-view', 'api', 'h5-text'], function(View, api) {
    var nicknameView = new View('nickname');
    var gopToken = $.cookie('gopToken');
	nicknameView.onFinish = $.noop;
	var vm = nicknameView.vm = avalon.define({
		$id: 'nickname',
		nickname: '',
		id: '',
		nickname_click: function() {
			api.updateRemark({
				gopToken: gopToken,
				remark: vm.nickname,
				personId: vm.id
			}, function(data) {
				if (data.status == 200) {
					nicknameView.onFinish();
					if(vm.callback){
						vm.callback();
					}
					window.history.back();
				} else {
					console.log(data);
				}
			});
		}
	});
	return nicknameView;
});


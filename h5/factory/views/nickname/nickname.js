// 张树垚 2015-12-22 18:00:56 创建
// H5微信端 --- 联系人备注名修改


define('h5-view-nickname', ['h5-view', 'api','check', 'h5-text'], function(View, api,check) {
	var gopToken = $.cookie('gopToken');
	var nicknameView = new View('nickname');
	var vm = avalon.define({
		$id: 'nickname',
		nickname: '',
		id: '',
		callback: $.noop,
		nicknameClick: function() {//更改昵称按钮
			if (!check.empty(vm.nickname)) {
				if(vm.id){//有id是给给别人nikename
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
				}else{//没有id 给自己改
					api.updateNick({
						gopToken: gopToken,
						nick: vm.nickname
					}, function(data) {
						if (data.status == 200) {
							vm.callback();
						} else {
							console.log(data);
						}
					});
				}
			}else{
				$.alert('请输入昵称!');
			}
			
		}
	});
/*
	vm.callback = function(){
		$.alert('设置成功!');
		if (!vm.setRealName) {
			vm.name = nick.nickname;
		}
		if (vm.setnick == '未设置') {
			vm.setnick == '修改';
		}
		vm.nickname = nick.nickname;
		router.go('/');		
	};
*/

	avalon.scan(nicknameView.self.get(0), vm);
	return $.extend(nicknameView, {
		onFinish: $.noop, // return false 时, 取消默认后退
		vm: vm
	});
});

// 张树垚 2015-11-19 10:49:04 创建
// tips的avalon组件


define('avalon-tips', [], function() {

	avalon.ui.tips = function(element, data, vmodels) {

		console.log(arguments);

		var vm = avalon.define({
			$id: data.tipsid
		});

		return vm;
	};
});


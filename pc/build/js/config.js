
// 张树垚 2015-10-10 17:45:21 创建
// require.config 配置文件


(function() {

	var PATH_LIBRARY = '../../source/library';
	var PATH_COMPONENTS = '../factory/components';

	require.config({
		baseUrl: './',
		paths: {
			'bank': PATH_COMPONENTS + '/bank/bank',
			'bank-icon': PATH_COMPONENTS + '/bank-icon/bank-icon',
			'bank-list': PATH_COMPONENTS + '/bank/bank-list',
			'api': PATH_LIBRARY + '/api',
			'avalon-define': PATH_LIBRARY + '/avalon-define',
			'check': PATH_LIBRARY + '/check',
			'dialog': PATH_COMPONENTS + '/dialog/dialog',
			'dialog-bank': PATH_COMPONENTS + '/dialog-bank/dialog-bank',
			'dialog-bankadd': PATH_COMPONENTS + '/dialog-bankadd/dialog-bankadd',
			'dialog-login': PATH_COMPONENTS + '/dialog-login/dialog-login',
			'dom': PATH_LIBRARY + '/dom',
			'filters': PATH_LIBRARY + '/filters',
			'hchart': PATH_LIBRARY + '/src/highcharts',
			'm': PATH_LIBRARY + '/api',
			'mmRouter': PATH_LIBRARY + '/src/mmRouter',
			'mmHistory': PATH_LIBRARY + '/src/mmHistory',
			'module': PATH_LIBRARY + '/api',
			'payment': PATH_COMPONENTS + '/payment/payment',
			'router': PATH_LIBRARY + '/router',
			'tabs': PATH_COMPONENTS + '/tabs/tabs',
			'top': PATH_COMPONENTS + '/top/top',
		},
		shim: {
			jquery: {
				exports: "jQuery"
			},
			$: {
				exports: "jQuery"
			}
		},
		include: [],
		module: []
	});
})();





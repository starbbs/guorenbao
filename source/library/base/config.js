// 张树垚 2015-10-10 17:45:21 创建
// require.config 配置文件


(function() {

	var PATH_LIBRARY = '../../source/library';
	var PATH_COMPONENTS = '../factory/components';

	var H5_FACTORY = '../factory';
	var H5_VIEWS = H5_FACTORY + '/views';
	var H5_COMPONENTS = H5_FACTORY + '/components';
	var H5_DIALOGS = H5_FACTORY + '/dialogs';
	var H5_PAGES = H5_FACTORY + '/pages';
	var H5_SOURCE = '../source';

	require.config({
		baseUrl: './',
		paths: {
			// 公用部分
			'api': 				PATH_LIBRARY + '/api',
			'authorization': 	PATH_LIBRARY + '/authorization',
			'check': 			PATH_LIBRARY + '/check',
			'cookie': 			PATH_LIBRARY + '/cookie',
			'dom': 				PATH_LIBRARY + '/dom',
			'filters': 			PATH_LIBRARY + '/filters',
			'get': 				PATH_LIBRARY + '/get',
			'hchart': 			PATH_LIBRARY + '/src/highcharts',
			'm': 				PATH_LIBRARY + '/api',
			'mmRouter': 		PATH_LIBRARY + '/src/mmRouter',
			'mmHistory': 		PATH_LIBRARY + '/src/mmHistory',
			'module': 			PATH_LIBRARY + '/api',
			'router': 			PATH_LIBRARY + '/router',
            'hashMap':          PATH_LIBRARY + '/hashMap',
			// PC端部分
			'bank': 			PATH_COMPONENTS + '/bank/bank',
			'bank-icon': 		PATH_COMPONENTS + '/bank-icon/bank-icon',
			'bank-list': 		PATH_COMPONENTS + '/bank/bank-list',
			'dialog': 			PATH_COMPONENTS + '/dialog/dialog',
			'dialog-bank': 		PATH_COMPONENTS + '/dialog-bank/dialog-bank',
			'dialog-bankadd': 	PATH_COMPONENTS + '/dialog-bankadd/dialog-bankadd',
			'dialog-login': 	PATH_COMPONENTS + '/dialog-login/dialog-login',
			'payment': 			PATH_COMPONENTS + '/payment/payment',
			'tabs': 			PATH_COMPONENTS + '/tabs/tabs',
			'top': 				PATH_COMPONENTS + '/top/top',
			// H5微信端部分
			'h5-check': 				H5_SOURCE + '/js/check',
			'h5-price': 				H5_SOURCE + '/js/price',
			'h5-weixin': 				H5_SOURCE + '/js/weixin',
			'h5-alert': 				H5_COMPONENTS + '/alert/alert',
			'h5-bank': 					H5_COMPONENTS + '/bank/bank',
			'h5-ident': 				H5_COMPONENTS + '/ident/ident',
			'h5-text': 					H5_COMPONENTS + '/text/text',
			'h5-paypass': 				H5_COMPONENTS + '/paypass/paypass',
			'h5-wait': 					H5_COMPONENTS + '/wait/wait',
			'h5-view': 					H5_VIEWS + '/view',
			'h5-view-authentication': 	H5_VIEWS + '/authentication/authentication',
			'h5-view-choose': 			H5_VIEWS + '/choose/choose',
			'h5-view-login': 			H5_VIEWS + '/login/login',
			'h5-view-password': 		H5_VIEWS + '/password/password',
			'h5-view-nickname': 		H5_VIEWS + '/nickname/nickname',
			'h5-dialog': 				H5_DIALOGS + '/dialog',
			'h5-dialog-alert': 			H5_DIALOGS + '/alert/alert',
			'h5-dialog-bankcard': 		H5_DIALOGS + '/bankcard/bankcard',
			'h5-dialog-paypass': 		H5_DIALOGS + '/paypass/paypass',
            'h5-bankcard-append':       H5_FACTORY + '/pages/bankcard/bankcard-append',
    		'h5-bankcard-detail':       H5_FACTORY + '/pages/bankcard/bankcard-detail',
			'h5-bankcard-ident':        H5_FACTORY + '/pages/bankcard/bankcard-ident',
            'h5-view-address-mine':     H5_VIEWS + '/address/address-mine',
            'h5-view-address-wallet':     H5_VIEWS + '/address/address-wallet',
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
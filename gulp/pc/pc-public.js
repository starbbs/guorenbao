
// 张树垚 2015-10-13 11:41:38  创建
// gulp 正式模式 -- 生成到public文件夹


var gulp = require('gulp');


var tools = require('../tools');
var paths = require('./pc-paths');


// css 处理
gulp.task('pc-css', function() {
	return tools.cssSprite(paths.build + '/css/*.css', {
		css: paths.public + '/css',
		img: paths.public + '/images'
	}, {
		server: {
			css: paths.server + '/css',
			img: paths.server + '/images'
		}
	});
});


// html 处理
gulp.task('pc-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		server: paths.server,
		remove: '<script src="js/config.js"></script>'
	});
});


// 图片处理
gulp.task('pc-img', function() {
	return tools.fileMove(paths.build + '/images/**', paths.public + '/images', {
		imagemin: true,
		server: paths.server + '/images'
	});
});


// js处理
gulp.task('pc-js-1', function() { // 压缩转移
	return tools.fileMove(paths.build + '/js/**', paths.public + '/js', {
		uglify: true,
		server: paths.server + '/js'
	});
});
var PATH_COMPONENTS = paths.components;
var PATH_LIBRARY = paths.library;
var rjsPaths = {
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
};
gulp.task('pc-js-2', function() { // rjs
	return gulp.src(paths.build + '/*.html', function(somethingNULL, filePaths) {
		filePaths.forEach(function(path) {
			path = tools.filePath(path);
			console.log(path.path + '/js/' + path.basename + '.js');
			rjs({
				baseUrl: path.path + '/js',
				// mainConfigFile: '../config.js',
				name: path.basename,
				out: path.basename + '.js',
				paths: rjsPaths,
				shim: {
					// jquery: {
					// 	exports: "jQuery"
					// },
					// $: {
					// 	exports: "jQuery"
					// }
				},
				include: [],
				module: [],
			});
		});
	});
});


// 由build文件夹生成
gulp.task('pc-public-from-build', ['pc-js', 'pc-css', 'pc-img', 'pc-html']);


// 由factory文件夹生成
gulp.task('pc-public-from-factory');


// 生成正式
gulp.task('pc-public', ['pc-public-from-build'], function() {
	return gulp.src('./').pipe(tools.notify('正式目录生成成功!'));
});








// 张树垚 2015-10-17 15:33:33 创建
// require合并, js压缩
// require.config 配置
// basePath修改


var gulp = require('gulp');
var rename = require('gulp-rename');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


var paths = require('../paths');
var tools = require('../tools');


var PATH_LIBRARY = '../../../source/library';
var PATH_COMPONENTS = '../../factory/components';


gulp.task('js-uglify', function() {
	return gulp.src(paths.build.js + '/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.public.js))
		.pipe(gulp.dest(paths.server.js))
});


gulp.task('js-rjs', ['js-uglify'], function() {
	gulp.src(paths.build.html)
		.pipe(rename(function(path) {
			var name = path.basename;
			rjs({
				baseUrl: paths.build.js,
				// mainConfigFile: '../config.js',
				name: name,
				out: name + '.js',
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
				module: [],
				// optimize: 'uglify'
			}).pipe(uglify())
			.pipe(gulp.dest(paths.public.js))
			.pipe(gulp.dest(paths.server.js))
		}))
});


gulp.task('js-avalon-concat', ['js-rjs'], function() {
	return gulp.src(paths.source.concat)
		.pipe(concat(paths.source.avalon))
		.pipe(uglify())
		.pipe(gulp.dest(paths.public.js))
		.pipe(gulp.dest(paths.server.js))
});


gulp.task('js', ['js-avalon-concat'], function() {
	return gulp.src('./').pipe(tools.notify('js处理完成!'));
});



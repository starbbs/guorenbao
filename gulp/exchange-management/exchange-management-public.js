// 徐乐天 2016年3月1日20:22:44  创建
// gulp 交易所 生成到public文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = require('./exchange-management-paths');
var uglify = require('gulp-uglify');
var rjs = require('gulp-requirejs');
var imagemin = require('gulp-imagemin');
gulp.task('exchange-management-js', function() {
	return gulp.src(path.join(paths.build, '/js/*.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.public + '/js'))
});

gulp.task('exchange-management-rjs', ['exchange-management-js'], function() {
	return gulp.src([

		paths.build + '/js/cashiIn.js',
		paths.build + '/js/cashiOut.js',
		paths.build + '/js/controllPanel.js',
		paths.build + '/js/guoRenDeal.js',
		paths.build + '/js/guorenGuaDan.js',
		paths.build + '/js/guorenInput.js',
		paths.build + '/js/guorenKaDan.js',
		paths.build + '/js/guorenOutput.js',
		
		paths.build + '/js/home.js',
		paths.build + '/js/login.js',
		paths.build + '/js/user-info.js',
		paths.build + '/js/user.js'
	], function(somethingNULL, filePaths) {
		filePaths.forEach(function(url) {
			var name = path.basename(url, '.js');
			rjs({
				baseUrl: paths.build + '/js',
				// mainConfigFile: '../config.js',
				name: name,
				out: name + '.js',
				paths: paths.rjs,
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
			})
			.pipe(uglify())
			.pipe(gulp.dest(paths.public + '/js'));
		});
	});
});

// gulp.task('exchange-management-rjs', ['exchange-management-js'], function() {
// 	return tools.rjs(paths.build + '/*.html', paths.public + '/js', {
// 		rjsPaths: paths.rjs,
// 		uglify: true
// 	});
// });
gulp.task('exchange-management-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script type="text/javascript" src="./js/config.js"></script>'
	});
});
gulp.task('exchange-management-img', function() {
	return gulp.src(paths.build + '/images/**/**')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.public + '/images'))
});
gulp.task('exchange-management-css', function() {
	return tools.fileMove(paths.build+'/css/**/**',paths.public+'/css',{
		type:'css',
		removeDirname:false
	});
});
gulp.task('exchange-management-public', ['exchange-management-rjs', 'exchange-management-html', 'exchange-management-img','exchange-management-css']);
// 徐乐天 2016年3月1日20:22:44  创建
// gulp 交易所 生成到public文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = require('./exchange-manage-paths');
var uglify = require('gulp-uglify');
gulp.task('exchange-js', function() {
	return gulp.src(path.join(paths.build, '/js/*.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.public + '/js'))
});
gulp.task('exchange-rjs', ['exchange-js'], function() {
	return tools.rjs(paths.build + '/*.html', paths.public + '/js', {
		rjsPaths: paths.rjs,
		uglify: true
	});
});
gulp.task('exchange-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script src="./js/config.js"></script>',
	});
});
gulp.task('exchange-img', function() {
	return tools.fileMove(paths.build + '/images/**/**', paths.public + '/images', {
		type: 'image',
		imagemin: true,
		removeDirname: false
	});
});
gulp.task('exchange-public', ['exchange-rjs', 'exchange-html', 'exchange-img']);

// 张树垚 2015-12-10 15:05:15  创建
// gulp H5微信端 生成到public文件夹


var gulp = require('gulp');
var tools = require('../tools');
var paths = require('./h5-paths');

var uglify = require('gulp-uglify');


gulp.task('h5-js', function() {
	return gulp.src(paths.build + '/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.public + '/js'))
});
gulp.task('h5-rjs', ['h5-js'], function() {
	return tools.rjs(paths.build + '/*.html', paths.public + '/js', {
		rjsPaths: paths.rjs,
		uglify: true
	});
});

gulp.task('h5-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script src="./js/config.js"></script>',
	});
});

gulp.task('h5-img', function() {
	return tools.fileMove(paths.build + '/images/**/**', paths.public + '/images', {
		type: 'image',
		imagemin: true,
		removeDirname: false
	});
});

gulp.task('h5-sprite', function() {
	return tools.cssSprite(paths.build + '/css/*.css', {
		css: paths.public + '/css',
		img: paths.public + '/images'
	})
});


gulp.task('h5-public', ['h5-rjs', 'h5-html', 'h5-img', 'h5-sprite']);


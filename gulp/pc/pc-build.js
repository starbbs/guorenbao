
// 张树垚 2015-09-21 19:46:55 创建
// gulp PC端 生成到build文件夹


var gulp = require('gulp');
var tools = require('../tools');
var paths = require('./pc-paths');


// html部分
gulp.task('pc-include', function() {
	return tools.fileInclude([paths.pages + '/**/*.html'], paths.build, { strict: true });
});
gulp.task('pc-include-notify', ['pc-include'], function() {
	return gulp.src('./').pipe(tools.notify('pc-include执行完成! -- html合成'));
});
gulp.task('pc-include-watch', function() {
	gulp.watch([paths.components + '/**/*.html'], ['pc-include-notify']);
});


// sass部分
gulp.task('pc-sass', function() {
	return tools.sass(paths.pages, paths.build + '/css');
});
gulp.task('pc-sass-notify', ['pc-sass'], function() {
	return gulp.src('./').pipe(tools.notify('pc-sass编译完成!'));
});
gulp.task('pc-sass-watch', function() {
	gulp.watch([paths.common + '/**/*.scss', paths.pc + '/**/*.scss'], ['pc-sass-notify']);
});


// 图片部分
gulp.task('pc-img-move', function() {
	tools.fileMove([paths.pages + '/**/**'], paths.build + '/images', {
		type: 'image',
		fileReg: /^_/,
		rename: function(path) {
			path.basename = path.dirname.replace(/\/?images\/?/, '') + path.basename.replace(/^_+/, '-');
		}
	});
	tools.fileMove([paths.source + '/images/**/**'], paths.build + '/images', {
		type: 'image',
		rename: function(path) {
			if (path.dirname != '.') {
				path.basename = path.dirname.replace(/\//g, '-') + '-' + path.basename;
			}
		}
	});
});
gulp.task('pc-img-move-notify', ['pc-img-move'], function() {
	return gulp.src('./').pipe(tools.notify('pc-img-move执行完成 -- 静态图片转移'));
});
gulp.task('pc-img-move-watch', ['pc-img-move-notify'], function() {
	return gulp.watch([paths.source + '/images/**/**'], function(event) {
		var path = tools.filePath(event.path);
		if (path.type === 'image') {
			gulp.start('pc-img-move-notify');
		}
	});
});


// js部分
gulp.task('pc-js-move', function() {
	return gulp.src([paths.pages + '/**/*.js', paths.common + '/library/base/*.js'])
		.pipe(tools.removeDirname())
		.pipe(gulp.dest(paths.build + '/js'));
});
gulp.task('pc-js-move-notify', ['pc-js-move'], function() {
	return gulp.src('./').pipe(tools.notify('pc-js-move执行完成! -- js转移'));
});
gulp.task('pc-js-move-watch', function() {
	return gulp.watch([paths.common + '/library/base/*.js'], ['pc-js-move-notify']);
});


// 全局部分
gulp.task('pc-build', ['pc-sass', 'pc-img-move', 'pc-js-move', 'pc-include']);
gulp.task('pc-build-watch', ['pc-build'], function() {
	gulp.start('pc-sass-watch');
	gulp.start('pc-img-watch');
	gulp.start('pc-js-move-watch');
	gulp.start('pc-include-watch');
	gulp.watch(paths.pages + '/**/**', function(event) { // pages文件夹监控
		var path = tools.filePath(event.path);
		var tasks = {
			image: 'pc-img-move-notify',
			js: 'pc-js-move-notify',
			css: 'pc-sass-notify',
			html: 'pc-include-notify'
		};
		gulp.start(tasks[path.type]);
	});
});










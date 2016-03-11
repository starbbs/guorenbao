// 徐乐天 2016年3月1日20:26:53 创建
// gulp 交易所 生成到build文件夹


var gulp = require('gulp');
var path = require('path');

var tools = require('../tools');
// var paths = require('./exchange-paths');
var paths = {
	build: '../exchange/build',
	source: '../exchange/source',
	pages: '../exchange/factory/pages',
	common: '../source'
};


var notify = function(task, path) { // 提示
	var notice = (path && !Array.isArray(path) && tools.filePath(path).type !== 'dir') ? tools.filePath(path).filename + ' ' : '全部文件';
	return tools.notify(task + ': ' + notice + '编译完成!');
};



// html部分
gulp.task('exchange-include', function() {
	var page = path.join(paths.pages, '/**/*.html');
	var todo = function(url) { // 转移pages里的html文件到build里, 经过gulp-file-include的合并
		return tools.fileInclude(url || page, paths.build, {
			strict: false
		}).pipe(notify('exchange-include', url));
	};
	gulp.watch(page, function(event) {
		return todo(event.path);
	});
	return todo();
});


// 图片部分
gulp.task('exchange-img-move', function() {
	var todo = function(url, useReg) { // 1.转移pages里的图片到build/images里,经过重命名 2.转移source/images的图片到build/images里
		var opts = {
			type: 'image',
			rename: function(path) {
				path.dirname = path.dirname.replace(/\\/g, '/');
				path.basename = path.dirname.replace(/(\/?images\/?)|(^\.)/, '') + path.basename.replace(/^_+/, '-');
			}
		};
		useReg && (opts.fileReg = /^_/);
		tools.fileMove(url, path.join(paths.build, '/images'), opts)
			.pipe(notify('exchange-img-move', url))
	};
	todo(path.join(paths.pages, '/**/**'));
	todo(path.join(paths.source, '/images/**/**'));
	gulp.watch([
		path.join(paths.pages, '/**/**'),
		path.join(paths.source, '/images/**/**')
	], function(event) {
		var path = tools.filePath(event.path);
		if (path.type === 'image') {
			todo(path.origin, /\/pages\//.test(path.origin));
		}
	});
});


// js部分
gulp.task('exchange-js-move', function() {
	var js = [
		path.join(paths.pages, '/**/*.js'),
		path.join(paths.common, '/library/base/*.js'),
		path.join(paths.source, '/**/*.js'),
	];
	var todo = function(url) { // 转移js到build/js中
		return gulp.src(url)
			.pipe(tools.removeDirname())
			.pipe(gulp.dest(path.join(paths.build, '/js')))
			.pipe(notify('exchange-js-move', url))
	};
	todo(js);
	gulp.watch(js, function(event) {
		return todo(event.path);
	});
});


gulp.task('exchange-css-move', function() {
	var css = [
		path.join(paths.pages, '/**/*.css'),
		path.join(paths.source, '/**/*.css'),
	];
	var todo = function(url) {
		return gulp.src(url)
			.pipe(tools.removeDirname())
			.pipe(gulp.dest(path.join(paths.build, '/css')))
			.pipe(notify('exchange-css-move', url))
	};
	todo(css);
	gulp.watch(css, function(event) {
		return todo(event.path);
	});
});


gulp.task('exchange-build', ['exchange-include', 'exchange-img-move', 'exchange-js-move', 'exchange-css-move']);








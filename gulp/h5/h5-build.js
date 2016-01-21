
// 张树垚 2015-12-10 14:59:58 创建
// gulp H5微信端 生成到build文件夹


var gulp = require('gulp');
var tools = require('../tools');
var paths = require('./h5-paths');


var notify = function(task, path) { // 提示
	var notice = (path && !Array.isArray(path) && tools.filePath(path).type !== 'dir') ? tools.filePath(path).filename + ' ' : '全部文件';
	return tools.notify(task + ': ' + notice + '编译完成!');
};


// html部分
gulp.task('h5-include', function() {
	var page = paths.pages + '/**/*.html';
	var todo = function(path) {
		return tools.fileInclude(path || page, paths.build, { strict: true })
				.pipe(notify('h5-include', path));
	};
	gulp.watch(page, function(event) {
		var path = tools.filePath(event.path);
		return todo(path.path + '/' + path.dirname + '.' + path.extname);
	});
	gulp.watch([
		paths.source + '/include/*.html',
		paths.views + '/**/*.html',
		paths.dialogs + '/**/*.html',
		paths.components + '/**/*.html'], function(event) {
			return todo();
		});
	return todo();
});


// sass部分
gulp.task('h5-sass', function() {
	var page = paths.pages + '/**/*.scss';
	var todo = function(path) {
		return tools.sass(path || page, paths.build + '/css')
				.pipe(notify('h5-sass', path));
	};
	gulp.watch(page, function(event) {
		return todo(event.path);
	});
	gulp.watch([paths.source + '/scss/**/*.scss', paths.common + '/zSass/**/*.scss', paths.views + '/**/*.scss', paths.components + '/**/*.scss', paths.dialogs + '/**/*.scss'], function(event) {
		return todo();
	});
	return todo();
});


// 图片部分
gulp.task('h5-img-move', function() {
	var todo = function(path, useReg) {
		var opts = {
			type: 'image',
			rename: function(path) {
				path.basename = path.dirname.replace(/(\/?images\/?)|(^\.)/, '') + path.basename.replace(/^_+/, '-');
			}
		};
		useReg && (opts.fileReg = /^_/);
		tools.fileMove(path, paths.build + '/images', opts)
			.pipe(notify('h5-img-move', path))
	};
	todo(paths.pages + '/**/**', true);
	todo(paths.source + '/images/**/**');
	gulp.watch([paths.pages + '/**/**', paths.source + '/images/**/**'], function(event) {
		var path = tools.filePath(event.path);
		if (path.type === 'image') {
			todo(path.origin, /\/pages\//.test(path.origin));
		}
	});
});


// js部分
gulp.task('h5-js-move', function() {
	var js = [paths.pages + '/**/*.js', paths.common + '/library/base/*.js'];
	var todo = function(path) {
		return gulp.src(path)
			.pipe(tools.removeDirname())
			.pipe(gulp.dest(paths.build + '/js'))
			.pipe(notify('h5-js-move', path))
	};
	todo(js);
	gulp.watch(js, function(event) {
		return todo(event.path);
	});
});


// font部分


// template部分 -- 慎用, name不清会覆盖原文档
gulp.task('h5-template', function() {
	var date = new Date();
	var opts = {
		name: '', // name一定要清空, 慎用!
		desc: '服务协议', // 描述'// H5微信端 --- {{desc}}'
		date: date.toLocaleDateString().replace(/\//g, '-') + ' ' + date.toTimeString().split(' ')[0]
	};
	return tools.template('../h5/source/template/**', '../h5/factory/pages', opts).pipe(tools.notify(opts.name + '模版已建立完成!'));
});


gulp.task('h5-build', ['h5-include', 'h5-sass', 'h5-img-move', 'h5-js-move']);






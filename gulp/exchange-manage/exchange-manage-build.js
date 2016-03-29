// 徐乐天 2016年3月1日20:26:53 创建
// gulp 果仁市场后台管理系统 生成到build文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = {
    build: '../exchange-manage/build',
    source: '../exchange-manage/source',
    pages: '../exchange-manage/factory/pages',
    common: '../source',
    includes: '../exchange-manage/factory/includes',
    font:'../exchange-manage/source/fonts'
};
var notify = function(task, path) { // 提示
    var notice = (path && !Array.isArray(path) && tools.filePath(path).type !== 'dir') ? tools.filePath(path).filename + ' ' : '全部文件';
    return tools.notify(task + ': ' + notice + '编译完成!');
};
// html部分
gulp.task('exchange-manage-include', function() {
    var page = path.join(paths.pages, '/**/*.html');
    var todo = function(url) { // 转移pages里的html文件到build里, 经过gulp-file-include的合并
        return tools.fileInclude(url || page, paths.build, {
            strict: false
        }).pipe(notify('exchange-manage-include', url));
    };
    gulp.watch(page, function(event) {
        return todo(event.path);
    });
    gulp.watch([path.join(paths.includes, '/**/*.html')], function(event) {
        return todo();
    });
    return todo();
});
// sass部分
gulp.task('exchange-manage-sass', function() {
	var page = path.join(paths.pages, '/**/*.scss');
	var todo = function(url) {
		return tools.sass(url || page, path.join(paths.build, '/css'))
				.pipe(tools.log())
				.pipe(notify('exchange-manage-sass', url));
	};
	// gulp.watch(page, function(event) {
	// 	return todo(event.path);
	// });
	return todo();
});

// font部分
gulp.task('exchange-manage-fontbuild', function() {
	return gulp.src(path.join(paths.font, '*.*'))
		.pipe(gulp.dest(path.join(paths.build, '/css/fonts')))
});

// 图片部分
gulp.task('exchange-manage-img-move', function() {
    var todo = function(url, useReg) { // 1.转移pages里的图片到build/images里,经过重命名 2.转移source/images的图片到build/images里
        var opts = {
            type: 'image',
            rename: function(path) {
                if (path.dirname !== '.') {
                    path.dirname = path.dirname.replace(/\\/g, '/').replace(/(\/?images\/?)|(^\.)/, '');
                    path.basename = path.dirname.replace(/\//g, '_') + '_' + path.basename.replace(/^_+/, '');
                }
            }
        };
        tools.fileMove(url, path.join(paths.build, '/images'), opts)
            .pipe(notify('exchange-manage-img-move', url))
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
gulp.task('exchange-manage-js-move', function() {
    var js = [
        path.join(paths.pages, '/**/*.js'),
        path.join(paths.common, '/library/base/*.js'),
        path.join(paths.source, '/**/*.js'),
    ];
    var todo = function(url) { // 转移js到build/js中
        return gulp.src(url)
            .pipe(tools.removeDirname())
            .pipe(gulp.dest(path.join(paths.build, '/js')))
            .pipe(notify('exchange-manage-js-move', url))
    };
    todo(js);
    gulp.watch(js, function(event) {
        return todo(event.path);
    });
});
gulp.task('exchange-manage-css-move', function() {
    var css = [
        path.join(paths.source, '/css/*.css'),
    ];
    var todo = function(url) {
        return gulp.src(url)
            .pipe(tools.removeDirname())
            .pipe(gulp.dest(path.join(paths.build, '/css')))
            .pipe(notify('exchange-manage-css-move', url))
    };
    todo(css);
    gulp.watch(css, function(event) {
        return todo(event.path);
    });
});
gulp.task('exchange-manage-build', ['exchange-manage-include', 'exchange-manage-img-move', 'exchange-manage-fontbuild','exchange-manage-js-move','exchange-manage-sass']);

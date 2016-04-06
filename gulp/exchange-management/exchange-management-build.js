// 徐乐天 2016年3月1日20:26:53 创建
// gulp 果仁市场后台管理系统 生成到build文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = {
    build: '../exchange-management/build',
    source: '../exchange-management/source',
    pages: '../exchange-management/factory/pages',
    common: '../source',
    font:'../exchange-management/source/fonts'
};
var notify = function(task, path) { // 提示
    var notice = (path && !Array.isArray(path) && tools.filePath(path).type !== 'dir') ? tools.filePath(path).filename + ' ' : '全部文件';
    return tools.notify(task + ': ' + notice + '编译完成!');
};
// html部分
gulp.task('exchange-management-include', function() {
    var page = path.join(paths.pages, '/**/*.html');
    var todo = function(url) { // 转移pages里的html文件到build里, 经过gulp-file-include的合并
        return tools.fileInclude(url || page, paths.build, {
            strict: false
        }).pipe(notify('exchange-management-include', url));
    };
    gulp.watch(page, function(event) {
        return todo(event.path);
    });
    // gulp.watch([path.join(paths.includes, '/**/*.html')], function(event) {
    //     return todo();
    // });
    return todo();
});
// sass部分
gulp.task('exchange-management-sass', function() {
	var page = path.join(paths.pages, '/**/*.scss');
	var todo = function(url) {
		return tools.sass(url || page, path.join(paths.build, '/css'))
				.pipe(tools.log())
				.pipe(notify('exchange-management-sass', url));
	};
	// gulp.watch(page, function(event) {
	// 	return todo(event.path);
	// });
	return todo();
});

// font部分
gulp.task('exchange-management-fontbuild', function() {
	return gulp.src(path.join(paths.font, '*.*'))
		.pipe(gulp.dest(path.join(paths.build, '/css/fonts')))
});

// 图片部分
gulp.task('exchange-management-img-move', function() {
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
            .pipe(notify('exchange-management-img-move', url))
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
gulp.task('exchange-management-js-move', function() {
    var js = [
        path.join(paths.pages, '/**/*.js'),
        path.join(paths.common, '/library/base/*.js'),
        path.join(paths.source, '/**/*.js'),
    ];
    var todo = function(url) { // 转移js到build/js中
        return gulp.src(url)
            .pipe(tools.removeDirname())
            .pipe(gulp.dest(path.join(paths.build, '/js')))
            .pipe(notify('exchange-management-js-move', url))
    };
    todo(js);
    gulp.watch(js, function(event) {
        return todo(event.path);
    });
});
gulp.task('exchange-management-css-move', function() {
    var css = [
        path.join(paths.source, '/css/*.css'),
    ];
    var todo = function(url) {
        return gulp.src(url)
            .pipe(tools.removeDirname())
            .pipe(gulp.dest(path.join(paths.build, '/css')))
            .pipe(notify('exchange-management-css-move', url))
    };
    todo(css);
    gulp.watch(css, function(event) {
        return todo(event.path);
    });
});
gulp.task('exchange-management-build', ['exchange-management-include', 'exchange-management-img-move', 'exchange-management-fontbuild','exchange-management-js-move','exchange-management-css-move','exchange-management-sass']);

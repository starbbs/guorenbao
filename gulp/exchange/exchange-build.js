// 徐乐天 2016年3月1日20:26:53 创建
// gulp 交易所 生成到build文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = require('./exchange-paths');
var notify = function(task, path) { // 提示
    var notice = (path && !Array.isArray(path) && tools.filePath(path).type !== 'dir') ? tools.filePath(path).filename + ' ' : '全部文件';
    return tools.notify(task + ': ' + notice + '编译完成!');
};



// html部分
gulp.task('exchange-include', function() {
    var page = '../exchange/factory/pages/**/*.html';
    var todo = function(path) {
        return gulp.src(path || page)
            .pipe(tools.removeDirname())
            .pipe(gulp.dest('../exchange/build'))
    };
    gulp.watch(page, function(event) {
        return todo(event.path);
        // var path = tools.filePath(event.path);
        // return todo(path.path + '/' + path.dirname + '.' + path.extname);
    });
    // gulp.watch([
    //     path.join(paths.source, '/include/*.html'),
    //     path.join(paths.views, '/**/*.html'),
    //     path.join(paths.dialogs, '/**/*.html'),
    //     path.join(paths.components, '/**/*.html')
    // ], function(event) {
    //     return todo();
    // });
    return todo();
});


// 图片部分
gulp.task('exchange-img-move', function() {
    var todo = function(url, useReg) {
        var opts = {
            type: 'image',
            rename: function(url) {
                url.dirname = url.dirname.replace(/\\/g, '/');
                url.basename = url.dirname.replace(/(\/?images\/?)|(^\.)/, '') + url.basename.replace(/^_+/, '-');
            }
        };
        useReg && (opts.fileReg = /^_/);
        tools.fileMove(url, path.join(paths.build, '/images'), opts)
            .pipe(notify('exchange-img-move', url))
    };
    todo(path.join(paths.pages, '/**/**'), true);
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
    var js = [path.join(paths.pages, '/**/*.js'), path.join(paths.common, '/library/base/*.js')];
    var todo = function(url) {
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
gulp.task('exchange-build', ['exchange-include', 'exchange-img-move', 'exchange-js-move']);

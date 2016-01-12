

// 张树垚 2015-09-21 16:37:50 创建
// gulp -- 我是工人阶级


var gulp = require("gulp");

var config = require('./config');
var paths = require('./paths');
var tools = require('./tools');


// PC端
require('./pc/pc-build');
require('./pc/pc-public');

gulp.task('pc', ['pc-build']);


// H5微信端
require('./h5/h5-build');
require('./h5/h5-public');

gulp.task('h5', ['h5-build']);


// 任务
// gulp.task('watch', ['pc-build-watch']);
gulp.task('default', ['h5']);
















// 张树垚 2015-12-03 15:12:10 创建
// gulp sass编译
// 包括:
// 1. 自动补全autoprefixer
// 2. sourcemap


var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var removeDirname = require('./03 removeDirname 去掉文件夹路径.js');


/**
 * [sass sass编译]
 * @Author   张树垚
 * @DateTime 2015-12-03 15:16:08
 * @param    {[string|array]}      input  [输入路径]
 * @param    {[string|funtion]}    output [输出路径]
 * @return   {[gulp-stream]}
 * @用法:
 * gulp.task('sass', function() {
 * 		return tools.sass('INPUT PATH', 'OUTPUT PATH');
 * });
 */
module.exports = function(input, output) {
	return sass(input, {
			// style: 'nested',
			// style: 'expanded',
			style: 'compact',
			// style: 'compressed',
			sourcemap: true
		})
		.on('error', sass.logError)
		.pipe(removeDirname())
		.pipe(autoprefixer('last 10 version'))
		.pipe(gulp.dest(output))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(output))
};











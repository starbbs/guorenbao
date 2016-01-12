
// 张树垚 2015-12-12 13:15:14 创建
// gulp工具 -- 模版


var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');


/**
 * [template 模版]
 * @Author   张树垚
 * @DateTime 2015-12-12 13:21:09
 * @param    {[string]}             input                  [输入路径]
 * @param    {[string]}             output                 [输出路径]
 * @param    {[json]}               options                [参数]
 *           {[string]}             options.name           [参数: 名称, 默认输出到output/name中]
 *           {[boolean]}            options.withoutName    [参数: 不使用名称, 直接输出到output中]
 * @return   {[gulp-stream]}
 * @用法:
 * gulp.task('template', function() {
 * 		return tools.template(paths.template, paths.factory, { name: 'index' });
 * });
 */
module.exports = function(input, output, options) {
	if (!options || !options.name) { return; } // 加限制, 该方法慎用, 以防覆盖已写好的文件
	return gulp.src(input)
		.pipe(replace(/\{\{([^\}]+)\}\}/g, function(s, s1) {
			return s1 in options ? options[s1] : s;
		}))
		.pipe(rename(function(path) {
			path.basename !== '' && path.basename !== 'images' && (path.basename = options.name);
		}))
		.pipe(gulp.dest(options.withoutName ? output : output + '/' + options.name))
};






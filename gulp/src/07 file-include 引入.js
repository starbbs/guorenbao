
// 张树垚 2015-12-05 19:17:35 创建
// gulp工具 -- html引入


var gulp = require('gulp');
var include = require('gulp-file-include');

var filePath = require('./05 file-path 路径处理.js');


/**
 * [fileInclude html引入]
 * @Author   张树垚
 * @DateTime 2015-12-05 19:22:09
 * @param    {[string|array]}       input             [输入路径]
 * @param    {[string|function]}    output            [输出路径]
 * @param    {[json]}               options           [参数]
 *           {[boolean]}            options.strict    [参数: 严格(当文件名和文件夹名一致时起效)]
 * @return   {[gulp-stream]}
 */
module.exports = function(input, output, options) {
	options = options || {};
	return gulp.src(input, function(somethingNULL, filePaths) {
		gulp.src(filePaths.filter(function(path) {
			path = filePath(path);
			if (options.strict) { return path.basename === path.dirname;}
			return true;
		})).pipe(include({
			prefix: '@@',
			basepath: '@file',
			filters: {},
			context: {}
		})).on('error', console.log).pipe(gulp.dest(output))
	});
};



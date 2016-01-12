
// 张树垚 2015-12-10 10:54:42 创建
// gulp工具 -- 多路径输出


var gulp = require('gulp');


/**
 * [output 多路径输出]
 * @Author   张树垚
 * @DateTime 2015-12-10 10:55:26
 * @param    {[gulp-stream]}          stream       [流]
 * @param    {[string|array]}         output       [输出路径]
 * @return   {[gulp-stream]}
 */
module.exports = function(stream, output) {
	return !Array.isArray(output) ? stream.pipe(gulp.dest(output)) : output.reduce(function(stream, path) {
		return stream.pipe(gulp.dest(path));
	}, stream);
};


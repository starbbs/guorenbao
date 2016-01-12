
// 张树垚 2015-12-07 15:50:12 创建
// gulp工具 -- 页面处理
// :: 未知原因, 无法在file-move中实现压缩, 所以单独拿出


var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var replace = require('gulp-replace');


/**
 * [html 压缩, 删除]
 * @Author   张树垚
 * @DateTime 2015-12-07 16:03:14
 * @param    {[string|array]}           input                 [输入路径]
 * @param    {[string|function]}        output                [输出路径]
 * @param    {[json]}                   options               [参数]
 *           {[string]}                 options.server        [参数: 服务器地址]
 *           {[string|regexp]}          options.remove        [参数: 要删除的文字]
 * @return   {[gulp-stream]}
 */
module.exports = function(input, output, options) {
	options = options || {};
	var stream = gulp.src(input)
		.pipe(replace(options.remove, ''))
		.pipe(minifyHtml({
			empty: true, // 保留空属性
			cdata: false, // 保留scripts标签的CDATA
			comments: false, // 保留注释
			conditionals: true, // 保留条件语句
			spare: true, // 保留多余属性
			quotes: true, // 保留所有引用
			loose: true // 保留1个空白符
		}))
		.pipe(gulp.dest(output));
	options.server && stream.pipe(gulp.dest(options.server));
	return stream;
};
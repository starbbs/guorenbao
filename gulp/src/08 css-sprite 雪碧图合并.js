
// 张树垚 2015-12-06 13:37:06 创建
// gulp工具 -- sprite生成, css压缩, sprite图压缩


var gulp = require('gulp');
var rename = require('gulp-rename');
var sprite = require('gulp-sprite-generator');
var minifycss = require("gulp-minify-css");
var imagemin = require('gulp-imagemin');

var filePath = require('./05 file-path 路径处理.js');


/**
 * [cssSprite sprite生成, css压缩, sprite图压缩]
 * @Author   张树垚
 * @DateTime 2015-12-06 13:51:27
 * @param    {[string|array]}           input                 [输入路径]
 * @param    {[json]}                   output                [输出路径]
 *           {[json]}                   output.css            [输出路径: css]
 *           {[json]}                   output.img            [输出路径: img]
 * @param    {[json]}                   options               [参数]
 *           {[json]}                   options.server        [参数: 服务器配置]
 *           {[string]}                 options.server.css    [参数: 服务器css路径]
 *           {[string]}                 options.server.img    [参数: 服务器图片路径]
 * @return   {[gulp-stream]}
 */
module.exports = function(input, output, options) {
	options = options || {};
	return gulp.src(input, function(somethingNULL, filePaths) {
		filePaths.forEach(function(path) {
			path = filePath(path);
			console.log(path)
			if (path.type === 'css') {
				var spriteOutput = gulp.src(path.origin).pipe(sprite({
					baseUrl: './',
					spriteSheetName: path.basename + '.png',
					spriteSheetPath: '../images',
					padding: 10,
					filter: [
						// this is a copy of built in filter of meta skip 
						// do not forget to set it up in your stylesheets using doc block /* */ 
						function(image) {
							if (image.meta.h5) {
								image.isRetina = true;
								image.retinaRatio = 2;
							}
							return true;
						}
					],
				}));
				spriteOutput.css.pipe(minifycss()).pipe(gulp.dest(output.css));
				spriteOutput.img.pipe(imagemin()).pipe(gulp.dest(output.img));
				if (options.server) {
					spriteOutput.css.pipe(gulp.dest(options.server.css));
					spriteOutput.img.pipe(gulp.dest(options.server.img));
				}
			}
		});
	});
};





// 张树垚 2015-12-03 15:30:24 创建
// gulp工具 -- 去掉文件夹路径


var rename = require('gulp-rename');


/**
 * [removeDirname 去掉文件夹路径]
 * @Author   张树垚
 * @DateTime 2015-12-03 15:44:21
 * @return   {[gulp-stream]}
 * @用法:
 * .pipe(removeDirname())
 */
module.exports = function() {
	return rename(function(path) {
		path.dirname = '';
	});
};


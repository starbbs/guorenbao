
// 张树垚 2015-12-05 12:48:23 创建
// gulp工具 -- 处理原始路径


var path = require('path');



/**
 * [filePath 处理原始路径]
 * @Author   张树垚
 * @DateTime 2015-12-05 12:49:23
 * @param    {[string]}          path            [gulp回调中的路径]
 * @return   {[json]}                            [返回路径解析json]
 *           {[string]}          json.type       [路径类型:file(image|js|css|...)|dir]
 *                                               file                            dir
 *           {[string|null]}     json.filename   [文件名file.json]                [文件名null]
 *           {[string]}          json.basename   [文件名file]                     [文件夹名dir1]
 *           {[string|null]}     json.extname    [后缀名json]                     [后缀名null]
 *           {[string]}          json.dirname    [文件夹名dir1]                   [父文件夹名dir1]
 *           {[string]}          json.path       [路径./dir2/dir1]                [路径./dir2]
 *           {[string]}          json.origin     [原路径./dir2/dir1/file.json]     [原路径./dir2/dir1]
 */
module.exports = function(url) {
	url = path.normalize(url).replace(/\\/g, '/');
  	if (/\.\w+$/.test(url)) { // 所有文件
		var filename = url.match(/\/([\*\w\-\.\s]+)$/)[1]; // 文件名(带后缀)
		var pathname = url.replace('/' + filename, ''); // 路径名
		var extname = filename.match(/\.(\w+)$/)[1]; // 后缀名
		var dirname = pathname.match(/\/([\w\-]+)$/)[1]; // 文件夹名
		var basename = filename.replace(/\.[^\.]+$/, ''); // 文件名(不带后缀)
		var result = {
			type: 'file',
			filename: filename,
			basename: basename,
			extname: extname, 
			dirname: dirname,
			path: pathname,
			origin: url
		};
		var types = [{
			name: 'image',
			exts: ['png', 'gif', 'jpg', 'jpeg', 'svg']
		}, {
			name: 'js',
			exts: ['js', 'jsx']
		}, {
			name: 'css',
			exts: ['css', 'scss', 'sass']
		}, {
			name: 'html',
			exts: ['html', 'htm', 'xhtml', 'xhtm']
		}];
		for (var i = 0; i < types.length; i++) {
			if(new RegExp('\\.(' + types[i].exts.join('|') + ')$', 'i').test(filename)) {
				result.type = (basename === '*' || basename === '**') ? types[i].name + '-all' : types[i].name;
				break;
			}
		}
		return result;
	} else { // 文件夹
		return {
			type: 'dir',
			filename: null,
			basename: matchDir(url, /\/([\w\-\s]+)$/, 1),
			extname: null,
			dirname: matchDir(url, /\/([\w\-\s]+)\/([\w\-\s]+)$/, 1),
			path: url.replace(/\/([\w\-\s]+)$/, ''),
			origin: url
		}
	}
};


function matchDir(url, reg, index) {
	var match = url.match(reg);
	if (match && match[index]) { return match[index]; }
	return '.';
}







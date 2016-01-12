
// 张树垚 2015-09-22 14:53:10 创建
// 工具


var PATH_SRC = './src';


module.exports = {
	notify: require(PATH_SRC + '/01 notify 提示.js'),
	log: require(PATH_SRC + '/02 log 打印路径.js'),
	removeDirname: require(PATH_SRC + '/03 removeDirname 去掉文件夹路径.js'),
	sass: require(PATH_SRC + '/04 sass编译.js'),
	filePath: require(PATH_SRC + '/05 file-path 路径处理.js'),
	fileMove: require(PATH_SRC + '/06 file-move 文件转移.js'),
	fileInclude: require(PATH_SRC + '/07 file-include 引入.js'),
	cssSprite: require(PATH_SRC + '/08 css-sprite 雪碧图合并.js'),
	rjs: require(PATH_SRC + '/09 rjs合并.js'),
	html: require(PATH_SRC + '/10 html页面处理.js'),
	output: require(PATH_SRC + '/11 output 多路径输出.js'),
	template: require(PATH_SRC + '/12 template 模版.js'),
};





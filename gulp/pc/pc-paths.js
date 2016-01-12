
// 张树垚 2015-12-06 15:00:51 创建
// gulp PC端 路径(相对于gulpfile.js)


var PATH_PC = '../pc';
var PATH_SOURCE = '../source';

module.exports = {
	pc: PATH_PC,
	factory: PATH_PC + '/factory',
	build: PATH_PC + '/build',
	public: PATH_PC + '/public',
	pages: PATH_PC + '/factory/pages',
	components: PATH_PC + '/factory/components',
	source: PATH_PC + '/source',
	server: '../../GOPServer/WebContent',
	common: PATH_SOURCE,
	library: PATH_SOURCE + '/library',
};

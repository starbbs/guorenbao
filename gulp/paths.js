
// 张树垚 2015-09-21 17:29:49 创建
// gulp 路径


var PATH_BATH = '../pc'; 						// 根目录			I/O 	描述
var PATH_GULP = '.';							// gulp文件夹		读写		工人,全局调控
var PATH_SOURCE = PATH_BATH + '/source';		// source文件夹		读写 	资源(库,框架,组件),源代码
var PATH_FACTORY = PATH_BATH + '/factory';		// factory文件夹		读写 	工厂,业务逻辑与页面,源代码
var PATH_BUILD = PATH_BATH + '/build';			// build文件夹		只读 	第一次编译(由factory生成),本地调试
var PATH_PUBLIC = PATH_BATH + '/public';		// public文件夹		只读 	第二次编译(由build生成或factory直接生成),线上调试
var PATH_SERVER = '../../GOPServer/WebContent';	// svn

var paths = {
	gulp: PATH_GULP,
	source: {
		toString: function() {
			return PATH_SOURCE;
		},
		zSass: PATH_SOURCE + '/zSass',
		library: PATH_SOURCE + '/library',
		components: PATH_SOURCE + '/components',
		avalon: 'avalon.js',
		concat: [PATH_SOURCE + '/library/base/concat.js', PATH_SOURCE + '/library/base/avalon.js'],
	},
	factory: {
		toString: function() {
			return PATH_FACTORY + '/pages';
		},
		sass: PATH_FACTORY + '/pages',			// sass插件要求路径
		sassWatch: PATH_BATH + '/**/*.scss',	// 所有scss文件
		js: [									// 主js文件
			PATH_FACTORY + '/pages/**/*.js',
			'../source/library/base/*.js'
		],
		jsWatch: [								// 所有js文件
			PATH_FACTORY + '/**/*.js',
			PATH_SOURCE + '/**/*.js'
		],
		img: [
			PATH_FACTORY + '/pages/**/**',			// 所有文件, 从中筛选图片
			PATH_SOURCE + '/images/**/**',		// 静态图片
		],
		include: PATH_FACTORY + '/pages/**/*.html',	// 主html文件(需筛选)
		includeWatch: [							// 所有html文件
			PATH_FACTORY + '/**/*.html',
			PATH_SOURCE + '/**/*.html'
		]
	},
	build: {
		toString: function() {
			return PATH_BUILD;
		},
		css: PATH_BUILD + '/css',				// css生成
		js: PATH_BUILD + '/js',					// js转移
		img: PATH_BUILD + '/images',			// 图片转移
		ajax: PATH_BUILD + '/ajax',				// ajax文件转移
		include: PATH_BUILD,					// html生成
		html: PATH_BUILD + '/*.htm'				// 所有html文件
	},
	public: {
		toString: function() {
			return PATH_PUBLIC;
		},
		css: PATH_PUBLIC + '/css',				// css生成
		js: PATH_PUBLIC + '/js',				// js生成
		img: PATH_PUBLIC + '/images',			// 图片压缩
		ajax: PATH_PUBLIC + '/ajax',			// ajax压缩
		html: PATH_PUBLIC						// html压缩
	},
	server: {
		toString: function() {
			return PATH_SERVER;
		},
		css: PATH_SERVER + '/css',				// css
		js: PATH_SERVER + '/js',				// js
		img: PATH_SERVER + '/images',			// 图片
		ajax: PATH_SERVER + '/ajax',			// ajax
		html: PATH_SERVER						// html
	}
};


module.exports = paths;




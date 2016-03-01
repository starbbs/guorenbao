
// 张树垚 2015-12-02 15:08:58 创建
// gulp工具 -- 桌面提示


// {
// 	err: function(message) {},
// 	success: function(message) {},
// 	warning: function(message) {},
// 	info: function(message) {},
// }

var notify = null;
var images = {
	avatar: ''
};
var maker = function(message, image) {
	notify = notify || require('gulp-notify');
	if (!/zsy$/.test(message)) { message += ' -- by zsy'; }
	return notify({
		title: '果仁宝 by zsy', // 标题
		// subtitle: 'subtitle', // 子标题(可省)
		message: message,
		// message: function(file) { // 内容, 默认文件路径
		// 	return '' +
		// 			// 'file.relative:' + file.relative + '\n' + // 文件名
		// 			// 'file.contents:' + file.contents + // 文件内容
		// 			'sucess:' + file.path + '\n' + // 文件路径
		// 			// 'file.base:' + file.base + '\n' + // 文件夹路径
		// 			// 'file.cwd:' + file.cwd + '\n' + // 相对路径
		// 			'';
		// },
		sound: 'Glass', // 提示音: '叮'
		// sound: 'Funk', // 提示音: '咚'
		// sound: 'Ping', // 提示音: '噔'
		// sound: 'Sosumi', // 提示音: '噌'
		icon: './notify_images/h5.png', // 左侧小图
		contentImage: './notify_images/avatar.png' // 右侧大图
	});
};
var error = maker.error = function() {};
var success = maker.success = function() {};


module.exports = maker;





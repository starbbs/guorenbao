
// 张树垚 2015-12-02 15:08:58 创建
// gulp工具 -- 桌面提示


var notify = require('gulp-notify');


// {
// 	err: function(message) {},
// 	html: function(message) {},
// 	sass: function(message) {},
// 	build: function(message) {},
// }


/**
 * [notify 桌面提示]
 * @Author   张树垚
 * @DateTime 2015-12-02 15:17:30
 * @param    {[string]}      message [提示语]
 * @return   {[gulp-stream]}
 * @用法:
 * .pipe(tools.notify('今天天气不错'))
 */
module.exports = function(message) {
	if (!/zsy$/.test(message)) { message += ' -- by zsy'; }
	return notify({
		title: "果仁宝 by zsy",					// 标题
		// subtitle: "subtitle",				// 子标题(可省)
		message: message/*function(file) {				// 内容, 默认文件路径
			// return "scss编译完毕! 输出文件: " + file.relative + ""
			return "" +
					// "file.relative:" + file.relative + "\n" +	// 文件名
					// "file.contents:" + file.contents +			// 文件内容
					"sucess:" + file.path + "\n" +			// 文件路径
					// "file.base:" + file.base + "\n" +			// 文件夹路径
					// "file.cwd:" + file.cwd + "\n" +				// 相对路径
					""
		}*/,
		sound: "Glass", 						// 提示音: "叮"
		// sound: "Funk", 						// 提示音: "咚"
		// sound: "Ping", 						// 提示音: "噔"
		// sound: "Sosumi", 					// 提示音: "噌"
		// icon: path.join(__dirname, "notify_icon.png"),		// 左侧小图
		contentImage: "../notify_img.jpg"	// 右侧大图
	});
};




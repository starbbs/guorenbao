// 徐乐天 2016年3月1日20:22:44  创建
// gulp 交易所 生成到public文件夹
var gulp = require('gulp');
var path = require('path');
var tools = require('../tools');
var paths = require('./exchange-paths');
var uglify = require('gulp-uglify');
var rjs = require('gulp-requirejs');
var imagemin = require('gulp-imagemin');
gulp.task('exchange-js', function() {
	return gulp.src(path.join(paths.build, '/js/*.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(paths.public + '/js'))
});
gulp.task('exchange-rjs', ['exchange-js'], function() {
	return gulp.src([

		paths.build + '/js/basicinfo.js',
		paths.build + '/js/certification.js',
		paths.build + '/js/cnydepositswithdrawal.js',
		paths.build + '/js/cnydepositswithdrawal_new.js',
		paths.build + '/js/common.js',
		paths.build + '/js/conditionofassets.js',
		paths.build + '/js/conditionofassets_new.js',
		paths.build + '/js/footer.js',
		paths.build + '/js/index.js',
		
		paths.build + '/js/judge_certification.js',
		paths.build + '/js/judge_login.js',
		paths.build + '/js/modifyloginpassword.js',
		paths.build + '/js/modifypaymentcode.js',
		paths.build + '/js/nutstopupwithdrawal.js',
		paths.build + '/js/nutstopupwithdrawal_new.js',
		paths.build + '/js/pagehead.js',
		paths.build + '/js/regist.js',
		paths.build + '/js/resetloginpwd.js',
		paths.build + '/js/resetpaymentcode.js',
		paths.build + '/js/ssmessage.js',
		paths.build + '/js/tradingfloor.js',
		paths.build + '/js/tradingfloor_new.js',
		paths.build + '/js/withdraw.js',
		paths.build + '/js/withdraw_new.js',
		paths.build + '/js/withdraw-city.js'
	], function(somethingNULL, filePaths) {
		filePaths.forEach(function(url) {
			var name = path.basename(url, '.js');
			rjs({
				baseUrl: paths.build + '/js',
				// mainConfigFile: '../config.js',
				name: name,
				out: name + '.js',
				paths: paths.rjs,
				shim: {
					jquery: {
						exports: "jQuery"
					},
					$: {
						exports: "jQuery"
					}
				},
				include: [],
				module: [],
				// optimize: 'uglify'
			})
			.pipe(uglify())
			.pipe(gulp.dest(paths.public + '/js'));
		});
	});
});

gulp.task('exchange-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script type="text/javascript" src="./js/config.js"></script>',
		//oldChar: './',
		//newChar: '//static.goopal.net.cn/'
	});
});

gulp.task('exchange-img', function() {
	return gulp.src(paths.build + '/images/**/**')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.public + '/images'))
});

gulp.task('exchange-css', function() {
	return tools.fileMove(paths.build+'/css/**/**',paths.public+'/css',{
		type:'css',
		removeDirname:false
	});
});

gulp.task('exchange-public', ['exchange-rjs', 'exchange-html', 'exchange-img','exchange-css']);
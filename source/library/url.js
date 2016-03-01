
// 张树垚 2016-03-01 10:06:32 创建
// 公用 --- url


define('url', function() {

	var json = {};

	var location = window.location;
	var decode = window.decodeURIComponent;

	// http://localhost/h5/build/account.html?from=aaa&id=111#%21/view/bill
	var href = json.href = decode(location.href); // 同上
	var host = json.host = decode(location.host); // localhost
	var search = json.search = decode(location.search); // ?from=aaa&id=111
	var hash = json.hash = decode(location.hash); // #%21/view/bill
	var origin = json.origin = decode(location.origin); // http://localhost
	var pathname = json.pathname = decode(location.pathname); // /h5/build/account.html
	var port = json.port = decode(location.port); // 端口
	var protocol = json.protocol = decode(location.protocol); // http:

	var arr = pathname.split('/');
	var filename = json.filename = arr[arr.length - 1] || '';
	var dirname = json.dirname = arr[arr.length - 2] || '';

	var log = function(name, color) {
		console.log('%c' + name + ': %c' + json[name], 'color:blue;', 'color:' + (color || 'black'));
	};

	log('href', 'red');
	log('host');
	log('search');
	log('hash');
	log('origin', 'red');
	log('pathname');
	log('port');
	log('protocol');
	log('filename');
	log('dirname');

	// console.log(
	// 	'href: ' + href + '\n' +
	// 	'host: ' + host + '\n' +
	// 	'search: ' + search + '\n' +
	// 	'hash: ' + hash + '\n' +
	// 	'origin: ' + origin + '\n' +
	// 	'pathname: ' + pathname + '\n' +
	// 	'port: ' + port + '\n' +
	// 	'protocol: ' + protocol + '\n' +
	// 	'filename: ' + filename + '\n' +
	// 	'dirname: ' + dirname + '\n' +
	// 	''
	// );

	return json;
});



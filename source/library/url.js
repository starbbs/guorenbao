
// 张树垚 2016-03-01 10:06:32 创建
// 公用 --- url


define('url', function() {

	var json = {};

	var location = window.location;
	var decode = window.decodeURIComponent;

	// http://localhost:8888/h5/build/account.html?from=aaa&id=111#%21/view/bill
	var href = json.href = decode(location.href); // 同上(所有与均为字符串)
	var host = json.host = decode(location.host); // localhost:8888
	var hostname = json.hostname = decode(location.hostname); // localhost
	var search = json.search = decode(location.search); // ?from=aaa&id=111
	var hash = json.hash = decode(location.hash); // #%21/view/bill
	var origin = json.origin = decode(location.origin); // http://localhost
	var pathname = json.pathname = decode(location.pathname); // /h5/build/account.html
	var port = json.port = decode(location.port); // 8888
	var protocol = json.protocol = decode(location.protocol); // http:

	var arr = pathname.split('/');
	var filename = json.filename = arr[arr.length - 1] || ''; // account.html
	var dirname = json.dirname = arr[arr.length - 2] || ''; // build
	var url = json.url = origin + pathname;                 //http://localhost/h5/build/account.html

	var log = function(name, isURL) {
		console.log('%c' + name + ': %c' + json[name], 'color:blue;', isURL ? 'color:red;text-decoration:underline;' : 'color:black;');
	};

	// log('href', true);
	// log('host');
	// log('search');
	// log('hash');
	// log('origin', true);
	// log('pathname');
	// log('port');
	// log('protocol');
	// log('filename');
	// log('dirname');

	return json;
});



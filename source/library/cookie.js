
// 张树垚 2015-12-27 14:41:14 创建
// cookie插件


define(function() {
	/**
	 * [cookie]
	 * @Author   张树垚
	 * @DateTime 2015-12-27 14:43:03
	 * @param    {[string]}            key              [键]
	 * @param    {[string|number]}     value            [值]
	 * @param    {[json]}              options          [参数]
	 *           {[number]}            options.raw      [是否转码]
	 *           {[number]}            options.expires  [保存天数]
	 *           {[number]}            options.path     [路径]
	 *           {[number]}            options.domain   [域]
	 *           {[number]}            options.secure   []
	 * @return   {[type]}                               [description]
	 */
	return $.cookie = function (key, value, options) {
        var days, time, result, decode

        // A key and value were given. Set cookie.
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            // Enforce object
            options = $.extend({}, options);

            if (value === null || value === undefined) options.expires = -1;

            if (typeof options.expires === 'number') {
                days = (options.expires * 24 * 60 * 60 * 1000);
                time = options.expires = new Date();

                time.setTime(time.getTime() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Key and possibly options given, get cookie
        options = value || {};

        decode = options.raw ? function (s) { return s } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };
});




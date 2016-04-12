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
    return $.cookie = function(key, value, options, whichtab) {
        var days, time, result, decode
        var getsec = function(str) {
            var str1 = str.substring(1, str.length) * 1;
            var str2 = str.substring(0, 1);
            if (str2 == "s") {
                return str1 * 1000;
            } else if (str2 == "h") {
                return str1 * 60 * 60 * 1000;
            } else if (str2 == "d") {
                return str1 * 24 * 60 * 60 * 1000;
            }
        }
        // A key and value were given. Set cookie.
        /**
            //这是有设定过期时间的使用示例：
            //s20是代表20秒
            //h是指小时，如12小时则是：h12
            //d是天数，30天则：d30
         */
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            // Enforce object
            options = $.extend({}, options);
            if (value === null || value === undefined) options.expires = -1;
            if (whichtab == "guorenmarket") {
                if (typeof options.expires === 'string') {
                    var strsec = getsec(options.expires);
                    // console.log("===========" + strsec);
                    var exp = options.expires = new Date();
                    exp.setTime(exp.getTime() + strsec * 1);
                }
            } else {
                if (typeof options.expires === 'number') {
                    days = (options.expires * 24 * 60 * 60 * 1000);
                    time = options.expires = new Date();
                    time.setTime(time.getTime() + days);
                }
            }
            console.log("options.expires`````````" + typeof options.expires);
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
        decode = options.raw ? function(s) {
            return s
        } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };
});

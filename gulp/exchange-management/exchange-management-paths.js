// 徐乐天 2016年3月1日20:27:07 创建
// gulp exchange-manage 路径(相对于gulpfile.js)
var PATH_EXCHANGE_MANAGEMENT = '../exchange-management';
// 用于rjs的相对路径
var PATH_BATH = '../../..';
var PATH_LIBRARY = PATH_BATH + '/source/library';
var PATH_COMPONENTS = PATH_BATH + '/factory/components';

var EXCHANGE_MANAGE_FACTORY = PATH_BATH + '/exchange-management/factory';
var EXCHANGE_MANAGE_SOURCE = PATH_BATH + '/exchange-management/source';

var EXCHANGE_MANAGE_VIEWS = EXCHANGE_MANAGE_FACTORY + '/views';
var EXCHANGE_MANAGE_COMPONENTS = EXCHANGE_MANAGE_FACTORY + '/components';
var EXCHANGE_MANAGE_DIALOGS = EXCHANGE_MANAGE_FACTORY + '/dialogs';
var EXCHANGE_MANAGE_PAGES = EXCHANGE_MANAGE_FACTORY + '/pages';
module.exports = {
    pc: PATH_EXCHANGE_MANAGEMENT,
    factory: PATH_EXCHANGE_MANAGEMENT + '/factory',
    build: PATH_EXCHANGE_MANAGEMENT + '/build',
    public: PATH_EXCHANGE_MANAGEMENT + '/public',
    pages: PATH_EXCHANGE_MANAGEMENT + '/factory/pages',
    components: PATH_EXCHANGE_MANAGEMENT + '/factory/components',
    views: PATH_EXCHANGE_MANAGEMENT + '/factory/views',
    dialogs: PATH_EXCHANGE_MANAGEMENT + '/factory/dialogs',
    source: PATH_EXCHANGE_MANAGEMENT + '/source',
    server: '../../GOPServer/WebContent',
    common: '../source',
    rjs: {
        // 公用部分
        'api': PATH_LIBRARY + '/api',
        'authorization': PATH_LIBRARY + '/authorization',
        'check': PATH_LIBRARY + '/check',
        'cookie': PATH_LIBRARY + '/cookie',
        'dom': PATH_LIBRARY + '/dom',
        'filters': PATH_LIBRARY + '/filters',
        'get': PATH_LIBRARY + '/get',
        'url': PATH_LIBRARY + '/url',
        'hchart': PATH_LIBRARY + '/src/highcharts',
        'm': PATH_LIBRARY + '/api',
        'mmRouter': PATH_LIBRARY + '/src/mmRouter',
        'mmHistory': PATH_LIBRARY + '/src/mmHistory',
        'iScroll4': PATH_LIBRARY + '/src/iscroll4',
        'module': PATH_LIBRARY + '/api',
        'router': PATH_LIBRARY + '/router',
        'hashMap': PATH_LIBRARY + '/hashMap',
        'touch-slide': PATH_LIBRARY + '/src/TouchSlide.1.1.source',
        // PC端部分
        'bank': PATH_COMPONENTS + '/bank/bank',
        'bank-icon': PATH_COMPONENTS + '/bank-icon/bank-icon',
        'bank-list': PATH_COMPONENTS + '/bank/bank-list',
        'dialog': PATH_COMPONENTS + '/dialog/dialog',
        'dialog-bank': PATH_COMPONENTS + '/dialog-bank/dialog-bank',
        'dialog-bankadd': PATH_COMPONENTS + '/dialog-bankadd/dialog-bankadd',
        'dialog-login': PATH_COMPONENTS + '/dialog-login/dialog-login',
        'payment': PATH_COMPONENTS + '/payment/payment',
        'tabs': PATH_COMPONENTS + '/tabs/tabs',
        'top': PATH_COMPONENTS + '/top/top',
        // 交易所
    }
};

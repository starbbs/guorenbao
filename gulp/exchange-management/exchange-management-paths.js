// 徐乐天 2016年3月1日20:27:07 创建
// gulp exchange-manage 路径(相对于gulpfile.js)
var PATH_EXCHANGE_MANAGEMENT = '../exchange-management';
// 用于rjs的相对路径
var PATH_BATH = '../../..';
var PATH_LIBRARY = PATH_BATH + '/source/library';
var PATH_COMPONENTS = PATH_BATH + '/factory/components';

var H5_FACTORY = PATH_BATH + '/h5/factory';
var H5_SOURCE = PATH_BATH + '/h5/source';
var H5_VIEWS = H5_FACTORY + '/views';
var H5_COMPONENTS = H5_FACTORY + '/components';
var H5_DIALOGS = H5_FACTORY + '/dialogs';
var H5_PAGES = H5_FACTORY + '/pages';

var MKT_FACTORY = PATH_BATH + '/exchange/factory';
var MKT_PAGES = MKT_FACTORY + '/pages';
var MKT_SOURCE = PATH_BATH + '/exchange/source';

var MKT_MANAGEMENT_SOURCE = PATH_BATH + '/exchange-management/source';
var EXCHANGE_MANAGE_FACTORY = PATH_BATH + '/exchange-management/factory';
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
            'api':              PATH_LIBRARY + '/api',
            'authorization':    PATH_LIBRARY + '/authorization',
            'check':            PATH_LIBRARY + '/check',
            'mydate':           PATH_LIBRARY + '/mydate',
            'cookie':           PATH_LIBRARY + '/cookie',
            'dom':              PATH_LIBRARY + '/dom',
            'filters':          PATH_LIBRARY + '/filters',
            'get':              PATH_LIBRARY + '/get',
            'url':              PATH_LIBRARY + '/url',
            'hchart':           PATH_LIBRARY + '/src/highcharts',
            'm':                PATH_LIBRARY + '/api',
            'mmRouter':         PATH_LIBRARY + '/src/mmRouter',
            'mmHistory':        PATH_LIBRARY + '/src/mmHistory',
            'iScroll4':         PATH_LIBRARY + '/src/iscroll4',
            'module':           PATH_LIBRARY + '/api',
            'router':           PATH_LIBRARY + '/router',
            'hashMap':          PATH_LIBRARY + '/hashMap',
            'iscrollLoading':   PATH_LIBRARY + '/iscrollLoading',
            'touch-slide':      PATH_LIBRARY + '/src/TouchSlide.1.1.source',
            // PC端部分
            'bank':             PATH_COMPONENTS + '/bank/bank',
            'bank-icon':        PATH_COMPONENTS + '/bank-icon/bank-icon',
            'bank-list':        PATH_COMPONENTS + '/bank/bank-list',
            'dialog':           PATH_COMPONENTS + '/dialog/dialog',
            'dialog-bank':      PATH_COMPONENTS + '/dialog-bank/dialog-bank',
            'dialog-bankadd':   PATH_COMPONENTS + '/dialog-bankadd/dialog-bankadd',
            'dialog-login':     PATH_COMPONENTS + '/dialog-login/dialog-login',
            'payment':          PATH_COMPONENTS + '/payment/payment',
            'tabs':             PATH_COMPONENTS + '/tabs/tabs',
            'top':              PATH_COMPONENTS + '/top/top',
            // H5微信端部分
            'h5-check':                 H5_SOURCE + '/js/check',
            'h5-price':                 H5_SOURCE + '/js/price',
            'h5-weixin':                H5_SOURCE + '/js/weixin',
            'h5-alert':                 H5_COMPONENTS + '/alert/alert',
            'h5-bank':                  H5_COMPONENTS + '/bank/bank',
            'h5-ident':                 H5_COMPONENTS + '/ident/ident',
            'h5-text':                  H5_COMPONENTS + '/text/text',
            'h5-paypass':               H5_COMPONENTS + '/paypass/paypass',
            'h5-wait':                  H5_COMPONENTS + '/wait/wait',
            'h5-component-bill':        H5_COMPONENTS + '/bill/bill',
            'h5-component-keyboard':    H5_COMPONENTS + '/keyboard/keyboard',
            'h5-dialog':                H5_DIALOGS + '/dialog',

            //添加对话
            'h5-dialog-alert':          H5_DIALOGS + '/alert/alert',   
            'h5-dialog-success':        H5_DIALOGS + '/success/success',
            'h5-dialog-info':           H5_DIALOGS + '/info/info',   
            'h5-dialog-confirm':        H5_DIALOGS + '/confirm/confirm',
            'h5-dialog-bankcard':       H5_DIALOGS + '/bankcard/bankcard',
            'h5-dialog-paypass':        H5_DIALOGS + '/paypass/paypass',
            'h5-dialog-more':           H5_DIALOGS + '/more/more',


            'h5-bankcard-append':       H5_VIEWS + '/bankcard/bankcard-append',
            'h5-bankcard-ident':        H5_VIEWS + '/bankcard/bankcard-ident',
            'h5-view':                  H5_VIEWS + '/view',
            'h5-view-about-us':         H5_VIEWS + '/about-us/about-us',
            'h5-view-address-mine':     H5_VIEWS + '/address/address-mine',
            'h5-view-address-wallet':   H5_VIEWS + '/address/address-wallet',
            'h5-view-authentication':   H5_VIEWS + '/authentication/authentication',
            'h5-view-agreement':        H5_VIEWS + '/agreement/agreement',
            'h5-view-bill':             H5_VIEWS + '/bill/bill', 
            'h5-view-choose':           H5_VIEWS + '/choose/choose',
            'h5-view-login':            H5_VIEWS + '/login/login',
            'h5-view-password':         H5_VIEWS + '/password/password',
            'h5-view-nickname':         H5_VIEWS + '/nickname/nickname',

            //交易所项目
            'api_mkt':                      MKT_SOURCE + '/js/api_market',
            'mkt_info':                     MKT_SOURCE + '/js/info',
            'mkt_trade':                    MKT_SOURCE + '/js/trade',

            //交易所管理系统
            'api_mkt_management':                    MKT_MANAGEMENT_SOURCE + '/js/api_manage'
    }
};

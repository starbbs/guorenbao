require.config({//第一块，配置baseUrl,让home.js去引
    baseUrl: 'js/',
    paths: {
        jquery: 'jquery-2.1.1.min',  //此路径是根据index.html而定位的
        avalon:'avalon'
    },
    shim: {						 //加载非AMD库 同步库
        jquery: {
            exports: 'jquery'
        },
        avalon:{
        	exports:'avalon'
        }
    }
});
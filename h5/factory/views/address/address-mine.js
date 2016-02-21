// 余效俭 2016-01-11 17:26:56 创建
// H5微信端 --- 我的
define('h5-view-address-mine', ['router', 'api', 'h5-view', 'check', 'h5-alert', 'h5-text'], function(router, api, View, check) {
    var gopToken = $.cookie('gopToken');
    var address_mine = new View('address-mine');
    var vm = address_mine.vm = avalon.define({
        $id: 'address-mine',
        hasStepNext: false, //是否有下一步跳转
        hasMarketAddress: false, //是否有果仁市场地址标志
        setMarketAddress: false, //正在设置果仁市场地址标志
        marketGopAddress: '', //果仁市场地址
        callback: $.noop,
        setSuccess: $.noop,
        setDelSuccess: $.noop,
        address_mine_next: function() { //返回
            console.log("~~~xxx~~~~")
            console.log(vm);
            console.log(vm.callback);
            console.log("~~~~xxx~~~")
            if (vm.callback) {
                vm.callback();
            }
        },
        marketAddress_add_click: function() { //添加果仁市场地址
            vm.setMarketAddress = true;
        },
        marketAddress_save_click: function() { //保存果仁市场地址
            if (check.empty(vm.marketGopAddress)) {
                $.alert('请输入果仁市场地址!');
                return false;
            }
            if (vm.marketGopAddress.indexOf('GOP') < 0) {
                $.alert('果仁市场地址格式错误!');
                return false;
            }
            api.marketAdd({
                gopToken: gopToken,
                gopMarketAddress: vm.marketGopAddress
            }, function(data) {
                if (data.status == 200) {
                    //$.alert('设置成功!');
                    vm.hasMarketAddress = true;
                    vm.setMarketAddress = false;
                    //vm.marketGopAddress = '';

                    vm.hasStepNext = false;
                    vm.setSuccess();
                } else {
                    console.log(data);
                }
            });
        },
        marketAddress_del_click: function() { //删除果仁市场地址 
            api.marketDel({
                gopToken: gopToken
            }, function(data) {
                if (data.status == 200) {
                    $.alert('删除成功!');
                    vm.hasStepNext = false;
                    vm.hasMarketAddress = false;
                    vm.marketGopAddress = '';
                    $('#address-mine-input').val('');
                    vm.setDelSuccess();
                    $(this).removeClass('del');
                } else {
                    console.log(data);
                }
            });
        }
    });
    $(document).on('swipeLeft', '.address-item', function() {
        $(this).addClass('del');
    });
    $(document).on('swipeRight', '.address-item', function() {
        $(this).removeClass('del');
    });
    address_mine.on("hide", function() {
        $(".address-item").removeClass('del top');
        //vm.setMarketAddress=false;
    });
    address_mine.on("show", function() {
        //$(".address-item").removeClass('del top');
        //vm.setMarketAddress=false;
    });
    return address_mine;
});
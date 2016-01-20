
// 余效俭 2016-01-11 17:26:56 创建
// H5微信端 --- 我的
define('h5-view-address-wallet', ['router', 'api','h5-view','check','h5-alert','h5-text'], function(router, api,View,check) {
    var gopToken = $.cookie('gopToken');
	var address_wallet = new View('address-wallet');
	var vm=address_wallet.vm = avalon.define({
		$id: 'address-wallet',
        hasNext:false,//是否有下一步跳转
		walletList:[],//钱包地址列表
        walletAddress:'',//添加的钱包地址
        walletAddress_add_show:false,//是否显示添加钱包地址		
        address_wallet_next: function () {//返回
        	if(vm.callback){
               vm.callback();
            }
        },
        walletAddress_query_click:function(){//查询钱包地址列表
            vm.walletList.clear();
            api.walletList({
                gopToken: gopToken
            }, function(data) {
                if (data.status == 200) {
                    for (var i=0;i<data.data.walletList.length;i++) {
                        var item=data.data.walletList[i]; 
                        if(item.defaultWallet){
                            vm.walletList.unshift(item);
                        }else{
                            vm.walletList.push(item);
                        }                       
                    }                   
                } else {
                    console.log(data);
                }
            }); 
        },
        walletAddress_add_click:function(){//显示添加钱包地址
                vm.walletAddress_add_show=true;
        },
        walletAddress_save_click:function(){//添加钱包地址
            if(check.empty(vm.walletAddress)){
                $.alert('请输入钱包地址!');
                return false;
            }
            if(vm.walletAddress.indexOf('GOP')<0){
                $.alert('钱包地址格式错误!');
                return false;
            }
            api.walletAdd({
                gopToken: gopToken,
                defaultWallet:vm.walletList.length>0?false:true,
                address:vm.walletAddress
            }, function(data) {
                if (data.status == 200) {
                    $.alert('添加成功!'); 
                    vm.walletAddress='';
                    vm.walletAddress_add_show=false;
                    vm.walletAddress_query_click();                 
                } else {
                    $.alert(data.msg);
                }
            }); 
        },
        walletAddress_top_click:function(){//置顶添加钱包地址
            var walletId=$(this).attr("data-id");
            api.walletSet({
                gopToken: gopToken,
                walletId:walletId
            }, function(data) {
                if (data.status == 200) {
                    $.alert('置顶成功!'); 
                    vm.walletAddress_query_click();                 
                } else {
                    console.log(data);
                }
            }); 
        },
        walletAddress_del_click:function(){//删除添加钱包地址
            var walletId=$(this).attr("data-id");
            api.walletDel({
                gopToken: gopToken,
                walletId:walletId
            }, function(data) {
                if (data.status == 200) {
                    $.alert('删除成功!'); 
                    vm.walletAddress_query_click();                 
                } else {
                    console.log(data);
                }
            }); 
        }
	});

    
    address_wallet.on("hide",function(){
        address_wallet.vm.walletAddress_add_show=false;
        address_wallet.vm.walletAddress='';
    });
	
    $(document).on('swipeLeft', '.address-wallet-item', function() {        
        var top=$(this).attr('data-top');
        $(this).removeClass('del');
        if(top=='true'){
            $(this).addClass('del');
        }else{
            $(this).addClass('top');
        }       
    });
    
    $(document).on('swipeRight', '.address-wallet-item', function() {        
        $(this).removeClass('del');
        $(this).removeClass('top');      
    });
    
	return address_wallet;
});



require(['jquery','avalon'],function($,avalon){

    avalon.ready(function(){
        var vm = avalon.define({
            $id:'test',
            NoName:'匿名',
            checkedA:'true',
            aa:function(){
                vm.checkedA = !vm.checkedA;
                
                if(vm.NoName === '18911234294'){
                    vm.NoName = '匿名';
                }else{
                    vm.NoName = '18911234294'
                };
            }
        });
        avalon.scan();
    });
    //控制面板右侧 常用 的显示隐藏
        $(".aside-div-spanRight").hover(function(){
            $(".aside-div-spanRight-div").show();
        },function(){
            var timer = setTimeout(function(){
                $(".aside-div-spanRight-div").hide();
            },500);
            $(".aside-div-spanRight-div").hover(function(){
            $(".aside-div-spanRight-div").show();
            clearInterval(timer);
            });
        });
         
    //选项卡
    $(function(){
        $(".aside-tabContent-span:gt(0)").hide();
        var liA = $(".aside-tabList-li");
        liA.click(function(){
            $(this).addClass("aside-tabList-li-active").siblings(".aside-tabList-li").removeClass("aside-tabList-li-active");
            var liA_index = liA.index(this);
            $(".aside-tabContent-span").eq(liA.index(this)).show().siblings(".aside-tabContent-span").hide();
        });
    });
    
//end
});




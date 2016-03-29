require(['jquery','avalon'],function($,avalon){

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
 
  
//end
});




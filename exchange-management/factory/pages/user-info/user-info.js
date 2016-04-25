require(['api_mkt_management'], function(api_mkt_management) {

    /*avalon.ready(function(){
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
    });*/
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

    $('.userInfoNum').text($.cookie('userUidMobile'));
    //用户_基本信息
    api_mkt_management.userInfo({
        'uId':$.cookie('userUid')
    },function(data){
        if (data.status == 200) {
            console.log(data.data.name);
            var html = [];
                html.push("<tr>");
                html.push("<td>"+ data.data.name +"</td>");
                html.push("<td class='idType'>"+ data.data.idType +"</td>");
                html.push("<td>"+ data.data.idNumber +"</td>");
                html.push("<td>"+ data.data.motime +"</td>");
                html.push("<td>"+ data.data.idAuthip +"</td>");
                html.push("</tr>");
                $(".userInfo").html("");  //添加前，先清空 
                $(".userInfo").append(html.join("")); 

                $('.idType').filter(':contains("false")').text('身份证');
        }else{
            var html = [];
            html.push("<tr><td colspan='5'>"+ data.msg +"</td></tr>");
            $(".userInfo").html("");  //添加前，先清空 
            $(".userInfo").append(html.join("")); 
        }
    });
    //bankCard
    $('.bankCard').click(function(){
        api_mkt_management.userAcBank({
            'uId':$.cookie('userUid'),
            'pageNo':1,
            'pageSize':5
        },function(data) {
            if (data.status == 200 && data.data.list.length !== 0) {
                //console.log(data.list[0].length);
                var html = [];
                for(var i=0; i<10;i++){
                    html.push("<tr>");
                    html.push("<td>"+data.data.list[i].bank+"</td>");
                    html.push("<td><h2>"+data.data.list[i].name+"</h2><br/><span>"+data.data.list[i].province+" / "+data.data.list[i].city+" - "+data.data.list[i].subbank+"</span></td>");
                    html.push("<td>"+ data.data.list[i].acnumber +"</td>");
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("</tr>");
                    $(".userInfoBank").html("");  //添加前，先清空 
                    $(".userInfoBank").append(html.join(""));
                }                
            }else{
                //data.data.list.length = 0  
                var text ='<tr><td colspan="4">该用户没有添加银行卡</td></tr>';
                $(".userInfoBank").html(text);
            }
        });
    });
    
//end
});




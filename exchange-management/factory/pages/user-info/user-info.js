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

                $('.idType').filter(':contains("false")').text('身份证号');
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

    //分页 
    function page(opt){

        if(!opt.id){return false};
        
        var obj = document.getElementById(opt.id);

        var nowNum = opt.nowNum || 1;
        var allNum = opt.allNum || 5;
        var callBack = opt.callBack || function(){};
        
        if( nowNum>=4 && allNum>=6 ){ 
        
            var oA = document.createElement('a');
            oA.href = '#1';
            oA.innerHTML = '首页';;
            obj.appendChild(oA);
        
        }
        
        if(nowNum>=2){
            var oA = document.createElement('a');
            oA.href = '#' + (nowNum - 1);
            oA.innerHTML = '上一页';
            obj.appendChild(oA);
        }
        
        if(allNum<=5){
            for(var i=1;i<=allNum;i++){
                var oA = document.createElement('a');
                oA.href = '#' + i;
                if(nowNum == i){
                    oA.innerHTML = '[ '+ i +' ]';
                }
                else{
                    oA.innerHTML = i;
                }
                obj.appendChild(oA);
            }   
        }
        else
        {
            for(var i=1;i<=5;i++){
                var oA = document.createElement('a');
                
                if(nowNum == 1 || nowNum == 2){
                    
                    oA.href = '#' + i;
                    if(nowNum == i){
                        oA.innerHTML = '[ '+ i +' ]';
                    }
                    else{
                        oA.innerHTML = i;
                    }
                    
                }
                else if( (allNum - nowNum) == 0 || (allNum - nowNum) == 1 ){
                
                    oA.href = '#' + (allNum - 5 + i);
                    
                    if((allNum - nowNum) == 0 && i==5){
                        oA.innerHTML = '[ '+ (allNum - 5 + i) +' ]';
                    }
                    else if((allNum - nowNum) == 1 && i==4){
                        oA.innerHTML ='[ '+ (allNum - 5 + i) +' ]';
                    }
                    else{
                        oA.innerHTML = (allNum - 5 + i);
                    }
                
                }
                else{
                    oA.href = '#' + (nowNum - 3 + i);
                    
                    if(i==3){
                        oA.innerHTML = '[ '+ (nowNum - 3 + i) +' ]';
                    }
                    else{
                        oA.innerHTML = (nowNum - 3 + i);
                    }
                }
                obj.appendChild(oA);
                
            }
        
        }
        
        if( (allNum - nowNum) >= 1 ){

            var oA = document.createElement('a');
            oA.href = '#' + (nowNum + 1);
            oA.innerHTML = '下一页';
            obj.appendChild(oA);
        }
        
        if( (allNum - nowNum) >= 3 && allNum>=6 ){
        
            var oA = document.createElement('a');
            oA.href = '#' + allNum;
            oA.innerHTML = '尾页';
            obj.appendChild(oA);
        
        }
        
        callBack(nowNum,allNum);
        
        var aA = obj.getElementsByTagName('a');
        
            for(var i=0;i<aA.length;i++){
                aA[i].onclick = function(){

                    this.style.background = 'blue';
                    
                    var nowNum = parseInt(this.getAttribute('href').substring(1));

                    obj.innerHTML = '';
                    
                    page({
                    
                        id : opt.id,
                        nowNum : nowNum,
                        allNum : allNum,
                        callBack : callBack
                    
                    });
                    
                    return false;
                    
                };
            }
    //end 符号
    }
    //分页 结束
    
//end
});




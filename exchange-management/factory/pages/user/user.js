require(['jquery','api_mkt_management'], function($,api_mkt_management) {
    avalon.ready(function(){
        var vm = avalon.define({
            $id:'test',
            NoName:'匿名',
            showCashOut:function(){
                vm.htmlFiles = '../cash/cashOut.html';
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

    $(".set, .set-icon").click(function(e){
        var ul=$(".new");
        if(ul.css("display")=="none"){
            ul.slideDown();
        }else{
            ul.slideUp();
        };
        e.stopPropagation(); 
    });
    
    $(".select li").click(function(e){
        var li=$(this).text();
        $(".select p").html(li);
        $(".new").hide();
        /*$(".set").css({background:'none'});*/
        e.stopPropagation();   
    });
    
    //请求
    api_mkt_management.userList({
        'uid':'',
        'phone':'',
        'name':'',
        'pageNo':1,
        'pageSize':10
    },function(data){
        if (data.status == 200) {
            //console.log(data.data.list[0].mobile); 
            var html = [];
            for(var i=0; i<10;i++){
                html.push("<tr>");
                html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</a></td>");
                html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                html.push("<td class='userNameHave'>"+ data.data.list[i].name +"</td>");
                html.push("<td>"+ data.data.list[i].createTime +"</td>");
                html.push("<td>"+ data.data.list[i].createip +"</td>");
                html.push("</tr>");
                $(".aside-table-tbody").html("");  //添加前，先清空 
                $(".aside-table-tbody").append(html.join("")); 

                //用户详情
                $('.toUidInfo').click(function(){
                    if($(this).parent().find('.userNameHave').text().length == 0){
                        alert('用户认证信息不存在！');
                    }else{
                        $.cookie('userUid',$(this).children().text());
                        $.cookie('userUidMobile',$(this).parent().find('.mobile').text());
                        api_mkt_management.userInfo({
                            'uId':$(this).children().text()
                        },function(data) {
                            if (data.status == 200) {
                                console.log(data);
                                window.location.href='user-info.html';
                            } else {
                                console.log(data.msg);
                            }
                        });
                    }
                });
            }            
        }
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

    //表格 select -> onchange -> filter
    $(".aside-table-thead-select").change(function(){
        //ar oVal = $(".aside-table-thead-select").val();
        var oVal =  $(".aside-table-thead-select").find("option:selected").text();  //被选中的选项
        //console.log(oVal);
        $(".aside-table-tbody tr td").each(function(){   //找到每行的
            //$(this).children("td").filter(":contain(oVal)").show().end().siblings().hide();
            if(oVal === "成功"){
                //$(this).filter(":contains('成功')").parent().css("backgroundColor","red");
                $(".aside-table-tbody tr").each(function(){
                    //$(this).filter(":contains('成功')").css("background","red");  
                    $(this).hide();
                    $(this).filter(":contains('成功')").show().css('padding','10px');
                });
            }else if(oVal === "等待"){
                $(".aside-table-tbody tr").each(function(){
                    $(this).hide();
                    $(this).filter(":contains('等待')").show();
                });
            }else if(oVal === "已取消"){
                $(".aside-table-tbody tr").each(function(){
                    $(this).hide();
                    $(this).filter(":contains('已取消')").show();
                });
            }else{
                $(this).parent().show();
            }
        });
    });

    //输入文本框 + 下拉菜单选择 -> 搜索
    /*$(".aside-div-searchBtn").submit(function(){
        var oSearchText = $(".aside-div-input").val() + $(".aside-div-select").find("option:selected").text();
        
        
    });*/

//end
});




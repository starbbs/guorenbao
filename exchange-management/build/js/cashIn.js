require(['jquery','avalon'],function($,avalon){

    //请求
    //$(".cashIn").click(function(){   //点击载入
    $(function(){   //直接载入
            $.ajax({
                    url: "http://localhost/goopalMarketBack/1.json",
                    type:"post",
                    dataType: "json",
                    cache: true,
                    success:function(data){
                        //console.log(data.data);

                            $("#div1").html("");   //添加前，先清空 分页div，无它，就会重复添加分页

                            page({
                            
                                id : 'div1',
                                nowNum : 1,
                                allNum : Math.ceil(data.data.length/10),
                                callBack : function(now,all){

                                    var num = now*10 < data.data.length ? 10 : data.data.length - (now-1)*10;
                                    
                                    var html = [];
                                    for(var i=0; i<num;i++){
                                        html.push("<tr>");
                                        /*html.push("<td>"+ data.data[(now-1)*10+i].id +"</td>");*/
                                        html.push("<td><span class='icon-cny btnConfirm'></span></td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].uid +"</a></td>");
                                        html.push("<td class='uid'><a href='../user-info/user-info.html' style='color:blue;text-decoration:underline' title='点击进入"+data.data[(now-1)*10+i].uid+"用户信息详情页'>"+ data.data[(now-1)*10+i].uid +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].bankId +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].amount +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].bankName +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].phone +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].realName +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].content +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].status +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].createTime +"</td>");
                                        html.push("<td>"+ data.data[(now-1)*10+i].updateTimed +"</td>");
                                        html.push("</tr>");
                                        $(".aside-table-tbody").html("");  //添加前，先清空 
                                        $(".aside-table-tbody").append(html.join("")); 

                                        //<input class='btnConfirm' type='button' value="￥" />
                                        $(".btnConfirm").click(function(){
                                            $(".mydiv").css("display","block");
                                            $(".bg").css("display","block");
                                        });
                                        $(".btnClose").click(function(){
                                            $(".mydiv").css("display","none");
                                            $(".bg").css("display","none");
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

                    },
                    error:function(err){
                        console.log('error');
                    }
            });
    });

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



//end
});




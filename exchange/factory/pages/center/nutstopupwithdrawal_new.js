
    //请求
$(function(){ 

    $(function(){
        $('.rmbxh').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbtx').removeClass('bottomon');
            $('.recharge').show();
            $('.withdraw_deposit').hide();
        });
        $('.rmbtx').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        });
    });

    //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -开始
    $(".status-guorenInput").filter(":contains('进行中')").css("color","orange");

    $(".status-guorenOutput").filter(":contains('进行中')").css("color","orange");
    //暂无真实接口-为出现效果,暂时放这里,有接口时,删除 -结束

    $.ajax({
            url: "http://localhost/1.json",
            type:"post",
            dataType: "json",
            cache: true,
            success:function(data){

                    $("#div1").html("");   //添加前，先清空 分页div
                    console.log(data);
                    page({

                        id : 'div1',
                        nowNum : 1,
                        allNum : Math.ceil(data.data.length/5),
                        callBack : function(now,all){ 

                            var PageNum = 5;
                            var num = now*PageNum < data.data.length ? PageNum : data.data.length - (now-1)*PageNum;
                            
                            var html = [];
                            for(var i=0; i<num;i++){
                                html.push("<tr>");                                        
                                html.push("<td>"+ data.data[(now-1)*PageNum+i].uid +"</td>");
                                html.push("<td>"+ data.data[(now-1)*PageNum+i].bankId +"</td>");
                                html.push("<td>"+ data.data[(now-1)*PageNum+i].amount +"</td>");
                                html.push("<td>"+ data.data[(now-1)*PageNum+i].amount +"</td>");
                                html.push("<td>"+ data.data[(now-1)*PageNum+i].phone +"</td>");
                                html.push("</tr>");
                                $(".guorenInput-history").html("");  //添加前，先清空 
                                $(".guorenInput-history").append(html.join("")); 

                                //分页页码后半部分
                                $(".allNum").html(all);
                                //添加按钮点击跳转分页
                                $(".btn-fenye").click(function(){
                                    var inputValue = $(".inputNum").val();
                                    if(isNaN(inputValue) || inputValue <= 0 || inputValue > all){
                                        $(".inputNum").css("border","1px solid red").val("");
                                    }else{
                                         var html = [];
                                         for(var i=0; i<num;i++){
                                            html.push("<tr>");                                        
                                            html.push("<td>"+ data.data[(inputValue-1)*PageNum+i].uid +"</td>");
                                            html.push("<td>"+ data.data[(inputValue-1)*PageNum+i].bankId +"</td>");
                                            html.push("<td>"+ data.data[(inputValue-1)*PageNum+i].amount +"</td>");
                                            html.push("<td>"+ data.data[(inputValue-1)*PageNum+i].amount +"</td>");
                                            html.push("<td>"+ data.data[(inputValue-1)*PageNum+i].phone +"</td>");
                                            html.push("</tr>");
                                            $(".guorenInput-history").html("");  //添加前，先清空 
                                            $(".guorenInput-history").append(html.join(""));  
                                            $(".inputNum").css("border","1px solid #ccc").val(inputValue);                                                   

                                        }                                                
                                    }

                                });
                            }
                        }
                    });
                    //


            //分页 
            function page(opt){
                
                var obj = document.getElementById(opt.id);

                var nowNum = opt.nowNum || 1;
                var allNum = opt.allNum || 3;
                var callBack = opt.callBack || function(){};
                
                if(nowNum>=0){  //为0 是刚开始就有，为2是 初始第一页时无，然后有
                    var oA = document.createElement('a');
                    oA.href = '#' + (nowNum - 1);
                    oA.innerHTML = '上一页';
                    obj.appendChild(oA);
                }
                
                if(allNum<=3){
                    for(var i=1;i<=allNum;i++){
                        var oA = document.createElement('a');
                        oA.href = '#' + i;
                        if(nowNum == i){
                            oA.innerHTML = '<font style="color: #58D2FF;"> '+ i +'</font>';;
                        }
                        else{
                            oA.innerHTML = i;
                        }
                        obj.appendChild(oA);
                    }   
                }
                else
                {
                    for(var i=1;i<=3;i++){
                        var oA = document.createElement('a');
                        
                        if(nowNum == 1 || nowNum == 2){
                            
                            oA.href = '#' + i;
                            if(nowNum == i){
                                oA.innerHTML = '<font style="color: #428bca;"> '+ i +'</font>';
                            }
                            else{
                                oA.innerHTML = i;
                            }
                            
                        }
                        else{
                            oA.href = '#' + (nowNum - 2 + i);
                            
                            if(i==2){  //中间位置
                                oA.innerHTML = '<font style="color: #428bca;"> '+ (nowNum - 2 + i) +' </font>';
                            }
                            else{
                                oA.innerHTML = (nowNum - 2 + i);
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
                
                callBack(nowNum,allNum);
                
                var aA = obj.getElementsByTagName('a');
                
                    for(var i=0;i<aA.length;i++){
                        aA[i].onclick = function(){
                            
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

                    //方法一
                    $(".btn-fenye").click(function(){

                            obj.innerHTML = '';
                            
                            page({
                                id : opt.id,
                                nowNum : parseInt($(".inputNum").val()),
                                allNum : allNum,
                                callBack : callBack    
                            });
                    });

            //end 符号
            }
            //分页 结束

            },
            error:function(err){
                console.log('error');
            }
    });
});



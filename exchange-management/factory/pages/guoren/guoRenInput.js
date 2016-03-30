require(['api_mkt_management'],function(api_mkt_management){

    //人民币充值/提现查询
    api_mkt_management.transferGopInput({
        'id':'',
        'uid':'',
        'phone':'',
        'optType':'OUT',
        'address':'',
        'optType':'',
        'status':'',
        'pageNo':1,
        'pageSize':10
    },function(data){
        if (data.status == 200) {
            console.log(data.data.list[0].mobile);
            var html = [];
            for(var i=0; i<10;i++){
               html.push("<tr>");
                html.push("<td>"+ data.data.list[i].id +"</td>");                
                /*html.push("<td class='uid'><a href='../user-info/user-info.html' style='color:blue;text-decoration:underline' title='点击进入"+data.data.list[i].uid+"用户信息详情页'>"+ data.data.list[i].uid +"</td>");*/
                html.push("<td class='uidNum'>"+ data.data.list[i].uid +"</td>");
                html.push("<td>"+ data.data.list[i].price +"</td>");
                html.push("<td>"+ data.data.list[i].num +"</td>");
                html.push("<td>"+ data.data.list[i].buyUid +"</td>");
                html.push("<td>"+ data.data.list[i].sellTid +"</td>");
                html.push("<td>"+ data.data.list[i].sellUid +"</td>");
                html.push("<td>"+ data.data.list[i].createTime +"</td>");
                html.push("<td>"+ data.data.list[i].updateTimed +"</td>");
                html.push("</tr>");
                $(".aside-table-tbody").html("");  //添加前，先清空 
                $(".aside-table-tbody").append(html.join("")); 
            }
        } else {
            console.log(data.msg);
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



//end
});




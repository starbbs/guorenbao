require(['api_mkt_management'],function(api_mkt_management){   
    //人民币充值/提现查询
    $("#div1").html("");   //添加前，先清空 
    page({            
        id : 'div1',
        nowNum : 1,
        allNum : $.cookie('pageTotal'), // Math.ceil(data.data.list.length/10),
        callBack : function(now,all){
            //alert(now);
            api_mkt_management.transfer({
                'optType':'IN',
                'pageNo':now,
                'pageSize':10
            },function(data){   
                 if (data.status == 200 && data.data.list.length > 1) {                             
                        var html = [];
                        $.cookie('pageTotal',data.data.pageNum);
                        var len = data.data.list.length < 10?data.data.list.length:10;
                        for(var i=0; i<len;i++){
                           html.push("<tr>");
                            html.push("<td class='firstBtn'><span class='aa icon-unlocked'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-undo'></span></td>");
                            html.push("<td class='idNum'>"+ data.data.list[i].id +"</a></td>");
                            html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                            html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                            html.push("<td>"+ data.data.list[i].money +"</td>");
                            html.push("<td>"+ data.data.list[i].pay +"</td>");
                            html.push("<td>"+ data.data.list[i].bank +"</td>");
                            html.push("<td>"+ data.data.list[i].acnumber +"</td>");
                            html.push("<td>"+ data.data.list[i].name +"</td>");
                            html.push("<td>"+ data.data.list[i].msg +"</td>");
                            html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                            html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
                            html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
                            html.push("</tr>");

                            $(function(){                                
                                var msg = $('.status').text();
                                if(msg == 'SUCCESS'){
                                    $(this).parent().find('firstBtn').html('已成功');
                                }else if(msg == 'CANCEL'){
                                    $(this).parent().find('firstBtn').html('已取消');
                                }
                            });

                            $(".aside-table-tbody").html("");  //添加前，先清空 
                            $(".aside-table-tbody").append(html.join(""));

                            //点击锁定/接触锁定
                            $(".aa").on('click',function(){
                                if($(this).hasClass("icon-unlocked")){
                                    var msg = $(this).parent().parent().find('.status').html();
                                    if(msg == 'SUCCESS'){
                                        $(this).parent().text('已成功');
                                    }else if(msg == 'CANCEL'){
                                        $(this).parent().text('已取消');
                                    }else{
                                        $(this).removeClass("icon-unlocked").addClass("icon-lock");
                                        $(this).parent().parent().css("backgroundColor","yellow");
                                        $(this).siblings(".bb").removeClass("icon-undo").addClass("icon-checkmark");
                                        //人民币提现锁定
                                        api_mkt_management.lockTransfer({
                                            'id':$(this).parent().parent().find('.idNum').text(),
                                            'ip':''
                                        }, function(data) {
                                            if (data.status == 200) {
                                                console.log(data);
                                            } else {
                                                console.log(data);
                                            }
                                        });
                                    }
                                }else{
                                    $(this).removeClass("icon-lock").addClass("icon-unlocked");
                                    $(this).parent().parent().css("backgroundColor","");
                                    $(this).siblings(".bb").removeClass("icon-checkmark").addClass("icon-undo");
                                    //人民币提现解锁
                                    api_mkt_management.unlockTransfer({
                                        'id':$(this).parent().parent().find('.idNum').text(),
                                        'ip':''
                                    }, function(data) {
                                        if (data.status == 200) {
                                            console.log(data);
                                        } else {
                                            console.log(data);
                                        }
                                    });
                                }
                            });

                            //点击锁定后，撤销按钮【点击弹出框】变 确定【点击删除】
                            $(".bb").on('click',function(){
                                var msg = $(this).parent().parent().find('.status').html();
                                if(msg == 'SUCCESS'){
                                    $(this).parent().text('已成功');
                                }else if(msg == 'CANCEL'){
                                    $(this).parent().text('已取消');
                                }else{
                                    if($(this).hasClass("icon-undo")){
                                        $(".mydiv").css("display","block");
                                        $(".bg").css("display","block");
                                    }else{
                                        $(this).parent().parent().remove();
                                        //data.data.length = data.data.length-1;
                                    }
                                }
                            });

                            //关闭弹出框 
                            $(".icon-cross").click(function(){
                                $(".mydiv").css("display","none");
                                $(".bg").css("display","none");
                            });  
                            //用户详情
                            $('.toUidInfo').click(function(){
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
                            });
                        }
                    }
            });   
        }
    });

    $('.aside-table-thead-select').change(function(){
        var optionSel = $(this).find('option:selected').text();
        //console.log(optionSel);
        if(optionSel === 'ALL'){
            api_mkt_management.transfer({
                'status':'',
                'optType':'IN',
                'pageNo':1,
                'pageSize':10
            },function(data){   
                if (data.status == 200 && data.data.list.length > 1) {                             
                    var html = [];
                    var len = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<len;i++){
                       html.push("<tr>");
                        html.push("<td><span class='aa icon-unlocked'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-undo'></span></td>");
                        html.push("<td class='idNum'>"+ data.data.list[i].id +"</a></td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                        html.push("<td>"+ data.data.list[i].money +"</td>");
                        html.push("<td>"+ data.data.list[i].pay +"</td>");
                        html.push("<td>"+ data.data.list[i].bank +"</td>");
                        html.push("<td>"+ data.data.list[i].acnumber +"</td>");
                        html.push("<td>"+ data.data.list[i].name +"</td>");
                        html.push("<td>"+ data.data.list[i].msg +"</td>");
                        html.push("<td>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
                        html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
                        html.push("</tr>");
                        $(".aside-table-tbody").html("");  //添加前，先清空 
                        $(".aside-table-tbody").append(html.join(""));                       
                        
                    }
                }
            }); 
        }else{
            api_mkt_management.transfer({
                'status':optionSel,
                'optType':'IN',
                'pageNo':1,
                'pageSize':10
            },function(data){   
                if (data.status == 200 && data.data.list.length > 1) {                             
                    var html = [];
                    var len = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<len;i++){
                       html.push("<tr>");
                        html.push("<td><span class='aa icon-unlocked'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-undo'></span></td>");
                        html.push("<td class='idNum'>"+ data.data.list[i].id +"</a></td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                        html.push("<td>"+ data.data.list[i].money +"</td>");
                        html.push("<td>"+ data.data.list[i].pay +"</td>");
                        html.push("<td>"+ data.data.list[i].bank +"</td>");
                        html.push("<td>"+ data.data.list[i].acnumber +"</td>");
                        html.push("<td>"+ data.data.list[i].name +"</td>");
                        html.push("<td>"+ data.data.list[i].msg +"</td>");
                        html.push("<td>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
                        html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
                        html.push("</tr>");
                        $(".aside-table-tbody").html("");  //添加前，先清空 
                        $(".aside-table-tbody").append(html.join(""));                       
                    }
                }
            });
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
        var oVal =  $(".aside-table-thead-select").find("option:selected").text(); 
        
            /*if(oVal === "成功"){
                $(".aside-table-tbody tr").each(function(){ 
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
            }*/
            
    });

        
        //搜索
        $('.aside-div-searchBtn').click(function(){
            var sel = $('.aside-div-select').find('option:selected').text();
            var val = $('.aside-div-input').val();
            /*alert(sel);
            alert(val);*/
            if(sel == 'ID'){
                api_mkt_management.transfer({
                    'id':val,
                    'pageNo':1,
                    'optType':'IN', //类型必须加上
                    'pageSize':10
                },function(data) {
                    if (data.status == 200) {
                        console.log(data);
                    } else {
                        console.log(data.msg);
                    }
                });
            }
            if(sel == '用户ID'){
                api_mkt_management.transfer({
                    'id':val,
                    'pageNo':1,
                    'optType':'IN', //类型必须加上
                    'pageSize':10
                },function(data) {
                    if (data.status == 200) {
                        console.log(data);
                    } else {
                        console.log(data.msg);
                    }
                });
            }
            
        });   

//end
});




require(['api_mkt_management'],function(api_mkt_management){    
    alert($.cookie('pageTotal'));
    //人民币充值/提现查询

    $("#div1").html("");   //添加前，先清空 
    page({            
        id : 'div1',
        nowNum : 1,
        allNum : $.cookie('pageTotal'), 
        callBack : function(now,all){
            api_mkt_management.transfer({
                'status':'',
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
                            html.push("<td><span class='icon-cny btnConfirm'></span></td>");
                            html.push("<td class='uidNum'>"+ data.data.list[i].id +"</td>");
                            html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                            html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                            html.push("<td>"+ data.data.list[i].money +"</td>");
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
                            //时间戳转时间格式
                            /*$('.createTime').text(unix_to_datetime(data.data.list[i].createDate));
                            $('.updateTimed').text(unix_to_datetime(data.data.list[i].updateDate));*/

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
                            //<input class='btnConfirm' type='button' value="￥" />
                            $(".btnConfirm").click(function(){
                                //alert($(this).parent().find('.uidNum').text());
                                $(".mydiv").css("display","block");
                                $(".bg").css("display","block");
                                $('.btn-a').val('');
                                //传值
                                $('.cashInUid').val($(this).parent().parent().find('.uidNum').text());
                                //console.log($(this).parent().parent().find('.uidNum').text());
                            }); 
                        }

                        /*if(data.data.list.length < 10){
                            $("#div1").hide();
                        }else{
                            $("#div1").show();
                        }*/
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
                        html.push("<td><span class='icon-cny btnConfirm'></span></td>");
                        html.push("<td class='uidNum'>"+ data.data.list[i].id +"</td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                        html.push("<td>"+ data.data.list[i].money +"</td>");
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
                        html.push("<td><span class='icon-cny btnConfirm'></span></td>");
                        html.push("<td class='uidNum'>"+ data.data.list[i].id +"</td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                        html.push("<td>"+ data.data.list[i].money +"</td>");
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

    //人民币充值/提现确认
    $('.btnTrue').click(function(){        
        api_mkt_management.confirmTransfer({
            'id':$('.cashInUid').val(),
            'password':$('.btn-a').val(),
            'ip':''
        }, function(data) {
            if (data.status == 200) {
                console.log(data);
                $(".frameHtml").attr("src", "cashIn.html");                
                $(".mydiv").css("display","none");
                $(".bg").css("display","none");
                window.location.href='cashIn.html';

            } else {
                console.log(data);
            }
        });
    }); 
    //关闭弹出框 
    $(".btnClose, icon-cross").click(function(){
        $(".mydiv").css("display","none");
        $(".bg").css("display","none");
    });   

//end
});




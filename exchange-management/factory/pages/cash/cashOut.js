require(['api_mkt_management'],function(api_mkt_management){   
    //人民币充值/提现查询
    $("#div1").html("");   //添加前，先清空 
    
    //点击锁定/接触锁定
    $("#tobody-json").on("click", ".aa", function() {
        if($(this).hasClass("icon-unlocked")){
	            //人民币提现锁定
	            api_mkt_management.lockTransfer({
	                'id':$(this).parent().parent().find('.idNum').text(),
	                'ip':''
	            }, function(data) {
	                if (data.status == 200) {
	                	 window.location.reload();
	                    console.log(data);
	                } else {
	                	alert(data.msg);
	                    console.log(data);
	                }
	            }); 
        }else{
            //人民币提现解锁
            api_mkt_management.unlockTransfer({
                'id':$(this).parent().parent().find('.idNum').text(),
                'ip':''
            }, function(data) {
                if (data.status == 200) {
                    console.log(data);
                    window.location.reload();
                } else {
                	alert(data.msg);
                    console.log(data);
                }
            });
        }
    });

    //点击锁定后，撤销按钮【点击弹出框】变 确定【点击删除】
    $("#tobody-json").on("click", ".bb", function() {
    	$(".mydiv").css("display","block");
        $(".bg").css("display","block");
        $(".btnTrue").attr("data-id",$(this).parent().parent().find('.idNum').text());
    	if($(this).hasClass("icon-undo")){
    		//撤销提现申请        
            $(".js-msg").html("您要撤销此笔提现申请?");
            $(".btnTrue").attr("data-operation","cancel");
        }else if($(this).hasClass("icon-checkmark")){
        	//提现成功确认
        	$(".js-msg").html("提现转账成功确认?");
        	$(".btnTrue").attr("data-operation","confirm");
        }
    });

    //密码输入确认操作
    $(".mydiv").on("click", ".btnTrue", function() {
    	if($(this).attr("data-operation")=="confirm"){
    		//确认提现成功
    		api_mkt_management.confirmTransfer({
                'id':$(this).attr("data-id"),
                'password':$(".js-password").val(),
                'ip':''
            }, function(data) {
                if (data.status == 200) {
                    console.log(data);
                    window.location.reload();
                } else {
                	alert(data.msg);
                    console.log(data);
                }
            });
    	}else if($(this).attr("data-operation")=="cancel"){
    		//撤销提现申请
    		api_mkt_management.cancelTransfer({
                'id':$(this).attr("data-id"),
                'password':$(".js-password").val(),
                'ip':''
            }, function(data) {
                if (data.status == 200) {
                    console.log(data);
                    window.location.reload();
                } else {
                	alert(data.msg);
                    console.log(data);
                }
            });
    	}
    });
    
    //关闭弹出框 
    
    $(".mydiv").on("click", ".icon-cross", function() {
        $(".mydiv").css("display","none");
        $(".bg").css("display","none");
    });  
    
    //用户详情
    $("#tobody-json").on("click", ".toUidInfo", function() {
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
    
    /**
     * 提现数据列表初始化操作
     */
    var initTransferOutList=function(data){     
        var html = [];
        $.cookie('pageTotal',data.data.pageNum);
        var len = data.data.list.length < 10?data.data.list.length:10;
        $(".aside-table-tbody").html("");
        for(var i=0; i<len;i++){
        	if(data.data.list[i].transferCnyStatus=='PROCESSING'){
        		//进行中            		
                html.push('<tr style="background-color: yellow;">');
                html.push("<td class='firstBtn'><span class='aa icon-lock'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-checkmark'></span></td>");
        	}else if(data.data.list[i].transferCnyStatus=='WAIT'){
                html.push("<tr>");
                html.push("<td class='firstBtn'><span class='aa icon-unlocked'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-undo'></span></td>");
        	}else if(data.data.list[i].transferCnyStatus=='SUCCESS'){
                html.push("<tr>");
                html.push("<td class='firstBtn'>已成功</td>");
        	}else if(data.data.list[i].transferCnyStatus=='CANCEL'){
                html.push("<tr>");
                html.push("<td class='firstBtn'>已取消</td>");
        	}
            html.push("<td class='idNum'>"+ data.data.list[i].id +"</a></td>");
            html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
            html.push("<td>"+ data.data.list[i].money +"</td>");
            html.push("<td>"+ data.data.list[i].pay +"</td>");
            html.push("<td>"+ data.data.list[i].bank +"</td>");
            html.push("<td>"+ data.data.list[i].acnumber +"</td>");
            html.push("<td>"+ data.data.list[i].name +"</td>");
            html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
            html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
            html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
            html.push("</tr>");
        }
        $(".aside-table-tbody").html(html.join(""));
        //过滤内容显示不同颜色
        $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange"); 
        $(".status").filter(":contains('PROCESSING')").text('转账中').css("color","orange");  
        $(".status").filter(":contains('CANCEL')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                  
        $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                                      
        $(".status").filter(":contains('CLOSED')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');
    	
    };
    
    
    page({            
        id : 'div1',
        nowNum : 1,
        allNum : $.cookie('pageTotal'), // Math.ceil(data.data.list.length/10),
        callBack : function(now,all){
            //alert(now);
            api_mkt_management.transfer({
                'optType':'OUT',
                'pageNo':now,
                'pageSize':10
            },function(data){   
                 if (data.status == 200 && data.data.list.length > 1) {
                	 initTransferOutList(data); 
                 }
            });   
        }
    });

    $('.aside-table-thead-select').change(function(){
        var optionSel = $(this).find('option:selected').attr("data-status");
        //console.log(optionSel);
        $(".aside-table-tbody").html('');
        if(optionSel === 'ALL'){
            api_mkt_management.transfer({
                'status':'',
                'optType':'OUT',
                'pageNo':1,
                'pageSize':10
            },function(data){   
                if (data.status == 200 && data.data.list.length > 0) {
                	initTransferOutList(data); 
                }
            }); 
        }else{
            api_mkt_management.transfer({
                'status':optionSel,
                'optType':'OUT',
                'pageNo':1,
                'pageSize':10
            },function(data){   
                if (data.status == 200 && data.data.list.length > 0) {
                	initTransferOutList(data); 
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




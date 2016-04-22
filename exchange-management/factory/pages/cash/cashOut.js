require(['api_mkt_management'],function(api_mkt_management){   
    //人民币充值/提现查询
    
    //分页开始-jxn
    var page_size = 10; //每页条数
    var optionStatus = ''; //当前状态，"显示全部"时为''
    $(document).on("click", ".btn-fenye", function() {
        var pageNo=$(".inputNum").val();
        cashInList(parseInt(pageNo),page_size,optionStatus);
    });
    
    $(document).on("keyup", ".inputNum", function(e) {
    	var pageNo=$(this).val();
        var pageNum=$(this).attr("data-pagenum");
        if(parseInt(pageNo)>parseInt(pageNum)){
        	$(this).val(pageNum);
        }else if(pageNo==0){
        	$(this).val(1);
        }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(e.keyCode==13){
			cashInList(parseInt(pageNo),page_size,optionStatus);
        }
    });
    /**
     * 分页标签
     */
    $(document).on("click", ".billPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        cashInList(parseInt(pageNo),page_size,optionStatus);
    });
    
    var cashInList = function(pageNo,pageSize,status){
    	api_mkt_management.transfer({
    		'status':status,
            'optType':'OUT',
            'pageNo':pageNo,
            'pageSize':pageSize
        },function(data){   
            if (data.status == 200) {
            	if(data.data.list.length > 0){
            		initTransferOutList(data); 
	            	var htmlPage = [];
		            var pageNum = data.data.pageNum;
					var start=pageNo>3?(pageNo-3):1;
		            var end=(pageNum-start)>=9?(start+9):pageNum;
		            if(end==pageNum){
		            	start=(pageNum-9)>1?(pageNum-9):1;
		            }
		    		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+(pageNo>1?(pageNo-1):1)+'">上一页</a>');  
		
		            for(var i=start;i<=end;i++){
		            	if(i==pageNo){
		            		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
		            	}else{
		            		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
		            	}
		            }
		    		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>'); 
		     		$(".paging").html(htmlPage.join("")); 
            	}else{
            		$(".aside-table-tbody").html("");
        			$(".aside-table-tbody").append(""); 
        			$(".PageCode").html("");
            	}
             }
        });
    }
    //分页结束-jxn
    cashInList(1,page_size,optionStatus);
    $('.aside-table-thead-select').change(function(){
    	$(".inputNum").val(""); //清空页码输入框的数据
        var optionSel = $(this).find('option:selected').attr("data-status");
        optionStatus = (optionSel == "ALL"?"": optionSel);
        cashInList(1,page_size,optionStatus);
    });
    
    
    
    
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




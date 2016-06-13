require(['api_mkt_management'],function(api_mkt_management){   
    //人民币充值/提现查询
    
    //分页开始-jxn
    var page_size = 10; //每页条数
    var optionStatus = ''; //当前状态，"显示全部"时为''
    var pageTotle;
    $(document).on("click", ".btn-fenye", function() {
        var pageNo=$(".inputNum").val();
        if(pageNo > pageTotle){
        	$(".inputNum").val(pageTotle);
        }
        cashOutList(parseInt(pageNo),page_size,optionStatus);
    });
    
    
    $(document).on("click", ".aside-div-searchBtn", function() {
        cashOutList(1,page_size,optionStatus);
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
			cashOutList(parseInt(pageNo),page_size,optionStatus);
        }
    });
    /**
     * 分页标签
     */
    $(document).on("click", ".billPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        cashOutList(parseInt(pageNo),page_size,optionStatus);
    });
    
    var cashOutList = function(pageNo,pageSize,status){
    	var param={};
    	param.status=status;
    	param.optType='OUT';
    	param.pageNo=pageNo;
    	param.pageSize=pageSize;
    	if($(".aside-div-input").val()){
    		param[$(".aside-div-select").val()]=$(".aside-div-input").val();
    	}
    	api_mkt_management.transfer(param,function(data){   
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
		            		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:red;">'+pageNo+'</a>');
		            	}else{
		            		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
		            	}
		            }
		    		htmlPage.push('<a class="billPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>'); 
		     		$(".PageCode").html('<span class="paging"></span><input type="text" class="inputNum"/><span class="allNum"></span><span class="btn-fenye">确定</span>');
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
    cashOutList(1,page_size,optionStatus);
    $('.aside-table-thead-select').change(function(){
    	$(".inputNum").val(""); //清空页码输入框的数据
        var optionSel = $(this).find('option:selected').attr("data-status");
        optionStatus = (optionSel == "ALL"?"": optionSel);
        cashOutList(1,page_size,optionStatus);
    });
    
    // $("#tobody-json").on("click",".cc",function(){
    //     if($(this).text()=="超代"){
    //         // alert("超代")
    //     } else if($(this).text()=="退款"){
            
    //     }
    // });
    
    //点击锁定/接触锁定
    $("#tobody-json").on("click", ".aa", function() {
    	var currentClass = this;
        if($(this).hasClass("icon-unlocked")){
	            //人民币提现锁定
	            api_mkt_management.lockTransfer({
	                'id':$(this).parent().parent().find('.idNum').text(),
	                'ip':''
	            }, function(data) {
	                if (data.status == 200) {
	                	$(currentClass).removeClass("icon-unlocked");
	                	$(currentClass).addClass("icon-lock").attr("title","解锁");
	                	$(currentClass).siblings(".bb").removeClass("icon-undo");
	                	$(currentClass).siblings(".bb").addClass("icon-checkmark");
	                	$(currentClass).parent().parent("tr").css("background-color","yellow");
	                	$(currentClass).parent().siblings(".status").html("进行中");
                        $(currentClass).siblings(".cc").text("退款").attr("title","退款").removeClass("cjdf").addClass("tk");
	                	 //window.location.reload();
                        // $(currentClass).addClass("");
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
                   // window.location.reload();
                   $(currentClass).addClass("icon-unlocked").attr("title","锁定");
	               $(currentClass).removeClass("icon-lock");
	               $(currentClass).siblings(".bb").addClass("icon-undo");
                	$(currentClass).siblings(".bb").removeClass("icon-checkmark");
                	$(currentClass).parent().parent("tr").css("background-color","white");
                	$(currentClass).parent().siblings(".status").html("等待");
                    $(currentClass).siblings(".cc").text("超代").attr("title","超代").removeClass("tk").addClass("cjdf");
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

    $("#tobody-json").on("click",".cc",function(){
        $(".mydiv").css("display","block");
        $(".bg").css("display","block");
        $(".js-password").val("");
        $(".btnTrue").attr("data-id",$(this).parent().parent().find('.idNum').text());
        if($(this).hasClass("tk")){
            $(".js-msg").html("您确定要退款?");
            $(".btnTrue").attr("data-operation","tk");
        }else if($(this).hasClass("cjdf")){
            $(".js-msg").html("确认进行超代");
            $(".btnTrue").attr("data-operation","cjdf");
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
    	}else if($(this).attr("data-operation")=="tk"){
            //撤销提现申请
            api_mkt_management.refundTransfer({
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
        }else if($(this).attr("data-operation")=="cjdf"){
            //撤销提现申请
            api_mkt_management.cibPay({
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
        pageTotle = data.data.pageNum;
        $.cookie('pageTotal',data.data.pageNum);
        var len = data.data.list.length < 10?data.data.list.length:10;
        $(".aside-table-tbody").html("");
        for(var i=0; i<len;i++){
        	if(data.data.list[i].transferCnyStatus=='PROCESSING'){
        		//进行中            		
                html.push('<tr style="background-color: yellow;">');
                html.push("<td class='firstBtn' style='padding:0 0 0 10px;'><span class='aa icon-lock' title='解锁'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-checkmark' title='确定'></span><span class='cc tk' title='退款'>退款</span></td>");
        	}else if(data.data.list[i].transferCnyStatus=='WAIT'){  //
                html.push("<tr>");
                html.push("<td class='firstBtn' style='padding:0 0 0 10px;'><span class='aa icon-unlocked' title='锁定'></span>&nbsp;&nbsp;&nbsp;<span class='bb icon-undo' title='撤销'></span><span class='cc cjdf' title='超代'>超代</span></td>");
        	}else if(data.data.list[i].transferCnyStatus=='SUCCESS'){
                html.push("<tr>");
                html.push("<td class='firstBtn' style='padding:0 0 0 10px;'><!--已成功--></td>");
        	}else if(data.data.list[i].transferCnyStatus=='CANCEL'){
                html.push("<tr>");
                html.push("<td class='firstBtn' style='padding:0 0 0 10px;'><!--已取消--></td>");
        	} else {
                html.push("<tr>");
                html.push("<td class='firstBtn' style='padding:0 0 0 10px;'></td>");
            }
            html.push("<td class='idNum'>"+ data.data.list[i].id +"</a></td>");
            html.push("<td class='toUidInfo' style='padding:10px 0 10px 5px;'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
            if(data.data.list[i].transferCnyPayMode=="OFFLINE"){
                html.push("<td>线下</td>");
            } else if(data.data.list[i].transferCnyPayMode=="SUPERPAY"){
                html.push("<td>超代</td>");
            } else {
                html.push("<td></td>");
            }

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
        $(".status").filter(":contains('WAIT')").text('等待').css("color","orange"); 
        $(".status").filter(":contains('PROCESSING')").text('进行中').css("color","orange");  
        $(".status").filter(":contains('CANCEL')").text('已撤销').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                  
        $(".status").filter(":contains('SUCCESS')").text('提现成功').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                                      
        $(".status").filter(":contains('FAILURE')").text('已退款').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');
    	
    };
        
        //搜索
//        $('.aside-div-searchBtn').click(function(){
//            var sel = $('.aside-div-select').find('option:selected').text();
//            var val = $('.aside-div-input').val();
//            /*alert(sel);
//            alert(val);*/
//            if(sel == 'ID'){
//                api_mkt_management.transfer({
//                    'id':val,
//                    'pageNo':1,
//                    'optType':'OUT', //类型必须加上
//                    'pageSize':10
//                },function(data) {
//                    if (data.status == 200) {
//                        console.log(data);
//                    } else {
//                        console.log(data.msg);
//                    }
//                });
//            }
//            if(sel == '用户ID'){
//                api_mkt_management.transfer({
//                    'id':val,
//                    'pageNo':1,
//                    'optType':'IN', //类型必须加上
//                    'pageSize':10
//                },function(data) {
//                    if (data.status == 200) {
//                        console.log(data);
//                    } else {
//                        console.log(data.msg);
//                    }
//                });
//            }
//            
//        });   

//end
});

window.addEventListener("keydown", function(){
    if (event.keyCode == 13) {
        event.returnValue = false;
        event.cancel = true;
        $(".btnTrue").click();
    }
});
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
        cashInList(parseInt(pageNo),page_size,optionStatus);
    });
    
    $(document).on("click", ".aside-div-searchBtn", function() {
        cashInList(1,page_size,optionStatus);
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
    
    //用户详情
    $(document).on("click", ".toUidInfo", function() {
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
    
    $(document).on("click", ".btnConfirm", function() {
        $(".mydiv").css("display","block");
        $(".bg").css("display","block");
        $('.btn-a').val('');
        //传值
        $('.cashInUid').val($(this).parent().parent().find('.uidNum').text());
    }); 
    
    var cashInList = function(pageNo,pageSize,status){
    	var param={};
    	param.status=status;
    	param.optType='IN';
    	param.pageNo=pageNo;
    	param.pageSize=pageSize;
    	if($(".aside-div-input").val()){
    		param[$(".aside-div-select").val()]=$(".aside-div-input").val();
    	}
		api_mkt_management.transfer(param,function(data){ 
             if (data.status == 200) {          
             	if(data.data.list.length > 0){
             		var html = [];
             		pageTotle = data.data.pageNum;
                    $.cookie('pageTotal',data.data.pageNum);
                    var len = data.data.list.length;
                    for(var i=0; i<len;i++){
                       html.push("<tr>");
                       if(data.data.list[i].transferCnyStatus == "SUCCESS" || data.data.list[i].transferCnyStatus == "CANCEL"){
                            html.push("<td></td>");
                       }else{
                            html.push("<td><span class='icon-cny btnConfirm'></span></td>");
                       }
                        html.push("<td class='uidNum'>"+ data.data.list[i].id +"</td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                        html.push("<td>"+ data.data.list[i].money +"</td>");
                        html.push("<td>"+ data.data.list[i].bank +"</td>");
                        html.push("<td>"+ data.data.list[i].acnumber +"</td>");
                        html.push("<td>"+ data.data.list[i].name +"</td>");
                        html.push("<td>"+ data.data.list[i].uid +"</td>");
                        html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
                        html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
                        html.push("</tr>");
                    }
                    
                    $(".aside-table-tbody").html(html.join("")); 
                    $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");                                      
                    $(".status").filter(":contains('CANCEL')").text('已取消').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text(' ');                  
                    $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text(' ');                                      

                    
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
             		$(".PageCode").html('<span class="paging"></span><input type="text" class="inputNum"/><span class="allNum"></span><a href="javascript:;"><span class="btn-fenye">确定</span></a>');
             		$(".paging").html(htmlPage.join(""));
             	}else{
             		$(".aside-table-tbody").html("");  //添加前，先清空 
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




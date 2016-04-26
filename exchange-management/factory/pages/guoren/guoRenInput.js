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
        guoRenInList(parseInt(pageNo),page_size,optionStatus);
    });
    
    $(document).on("click", ".aside-div-searchBtn", function() {
    	guoRenInList(1,page_size,optionStatus);
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
			guoRenInList(parseInt(pageNo),page_size,optionStatus);
        }
    });
    /**
     * 分页标签
     */
    $(document).on("click", ".billPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        guoRenInList(parseInt(pageNo),page_size,optionStatus);
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
    
    var guoRenInList = function(pageNo,pageSize,status){
    	var param={};
    	param.status=status;
    	param.optType='IN';
    	param.pageNo=pageNo;
    	param.pageSize=pageSize;
    	if($(".aside-div-input").val()){
    		param[$(".aside-div-select").val()]=$(".aside-div-input").val();
    	}
		api_mkt_management.transferGopInput(param,function(data){ 
        	if (data.status == 200 ) {       
        		if(data.data.list.length > 0){
        			var html = [];
        			pageTotle = data.data.pageNum;
	                $.cookie('pageTotal',data.data.pageNum);
	                var len = data.data.list.length;
	                $(".aside-table-tbody").html("");  //添加前，先清空 
	                for(var i=0; i<len;i++){
	                   html.push("<tr>");
	                    html.push("<td>"+ data.data.list[i].id +"</td>");
	                    html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
	                    html.push("<td>"+ data.data.list[i].wallet +"</td>");
	                    html.push("<td>"+ data.data.list[i].number +"</td>");
	                    html.push("<td class='status'>"+ data.data.list[i].transferGopStatus +"</td>");
	                    html.push("<td>"+ data.data.list[i].msg +"</td>");
	                    html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
	                    html.push("</tr>");
	                   
	                   
	                }
	                $(".aside-table-tbody").append(html.join("")); 
	            	
					
					//过滤内容显示不同颜色
                    $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");                                      
                    $(".status").filter(":contains('CANCEL')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text(' ');                  
                    $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text(' ');                                      
                    $(".status").filter(":contains('CLOSED')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text(' ');
                    
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
    guoRenInList(1,page_size,optionStatus);
    $('.aside-table-thead-select').change(function(){
    	$(".inputNum").val(""); //清空页码输入框的数据
        var optionSel = $(this).find('option:selected').attr("data-status");
        optionStatus = (optionSel == "ALL"?"": optionSel);
        guoRenInList(1,page_size,optionStatus);
    });
    //分页 结束

});




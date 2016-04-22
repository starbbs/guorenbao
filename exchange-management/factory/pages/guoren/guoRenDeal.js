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
        guoRenDealList(parseInt(pageNo),page_size,optionStatus);
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
			guoRenDealList(parseInt(pageNo),page_size,optionStatus);
        }
    });
    /**
     * 分页标签
     */
    $(document).on("click", ".billPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        guoRenDealList(parseInt(pageNo),page_size,optionStatus);
    });
    var guoRenDealList = function(pageNo,pageSize,status){
		api_mkt_management.order({
            'id':'',
            'uid':'',
            'phone':'',
            'optType':'IN',
            'name':'',
            'msg':'',
            'status':status,
            'pageNo':pageNo,
            'pageSize':pageSize
        },function(data){ 
             if (data.status == 200) {          
             	if(data.data.list.length > 0){
             		$.cookie('pageTotalDeal',data.data.pageNum);
             		pageTotle = data.data.pageNum;
                    var html = [];
                    var len = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<len;i++){
                       html.push("<tr>");
                       html.push("<td>"+ data.data.list[i].id +"</td>");               
                        html.push("<td>"+ data.data.list[i].price +"</td>");
                        html.push("<td>"+ data.data.list[i].num +"</td>");
                        html.push("<td>"+ data.data.list[i].buyTid +"</td>");
                        html.push("<td>"+ data.data.list[i].buyUid +"</td>");
                        html.push("<td>"+ data.data.list[i].sellTid +"</td>");
                        html.push("<td>"+ data.data.list[i].sellUid +"</td>");
                        html.push("<td class='createDate'>"+ data.data.list[i].createDate +"</td>");
                        html.push("</tr>");
                        $(".aside-table-tbody").html("");  //添加前，先清空 
                        $(".aside-table-tbody").append(html.join(""));

                        /*$('.createDate').text(unix_to_datetime(data.data.list[i].createDate));*/                            
                    }
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
             		$(".aside-table-tbody").html("");  //添加前，先清空 
                    $(".aside-table-tbody").append("");
                    $(".PageCode").html("");
             	}
             }
        });  
    }
    guoRenDealList(1,page_size,optionStatus);
     //分页结束-jxn
});




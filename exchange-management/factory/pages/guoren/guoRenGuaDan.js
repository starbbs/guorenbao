require(['api_mkt_management'],function(api_mkt_management){
    //分页开始-jxn
    var page_size = 10; //每页条数
    var optionStatus = ''; //当前状态，"显示全部"时为''
    var optionType = ''; //当前买卖类型
    var pageTotle; //总页数
    $(document).on("click", ".btn-fenye", function() {
        var pageNo=$(".inputNum").val();
        if(pageNo > pageTotle){
        	$(".inputNum").val(pageTotle);
        }
        guoRenGuaDanList(parseInt(pageNo),page_size,optionStatus,optionType);
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
			guoRenGuaDanList(parseInt(pageNo),page_size,optionStatus,optionType);
        }
    });
    /**
     * 分页标签
     */
    $(document).on("click", ".billPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        guoRenGuaDanList(parseInt(pageNo),page_size,optionStatus,optionType);
    });
    var guoRenGuaDanList = function(pageNo,pageSize,status,type){
		api_mkt_management.trade({
            'id':'',
            'uid':'',
            'phone':'',
            'type':type,
            'status':status,
            'pageNo':pageNo,
            'pageSize':pageSize
        },function(data){ 
             if (data.status == 200) {          
             	if(data.data.list.length > 0){
             		$.cookie('pageTotalGaDan',data.data.pageNum);
             		pageTotle = data.data.pageNum;
                    var html = [];
                    var len = data.data.list.length < 10?data.data.list.length:10;
                    for(var i=0; i<len;i++){
                       html.push("<tr>");
                        html.push("<td>"+ data.data.list[i].id +"</td>");
                        html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</td>");
                        html.push("<td>"+ data.data.list[i].price +"</td>");
                        html.push("<td>"+ data.data.list[i].numTotal +"</td>");
                        html.push("<td>"+ data.data.list[i].numOver +"</td>");
                        html.push("<td>"+ data.data.list[i].tradeGopType +"</td>");
                        html.push("<td>"+ data.data.list[i].tradeGopStatus +"</td>");
                        html.push("<td>"+ data.data.list[i].tradeGopFlag +"</td>");
                        html.push("<td class='createTime'>"+ data.data.list[i].createDate +"</td>");
                        html.push("<td class='updateTimed'>"+ data.data.list[i].updateDate +"</td>");
                        html.push("</tr>");
                        $(".aside-table-tbody").html("");  //添加前，先清空 
                        $(".aside-table-tbody").append(html.join(""));                 

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
             		$(".paging").html("");
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
    guoRenGuaDanList(1,page_size,optionStatus,optionType);
    $('.aside-table-thead-select-status').change(function(){
    	$(".inputNum").val(""); //清空页码输入框的数据
        var optionSel = $(this).find('option:selected').attr("data-status");
        optionStatus = (optionSel == "ALL"?"": optionSel);
        guoRenGuaDanList(1,page_size,optionStatus,optionType);
    });
    
    $('.aside-table-thead-select-type').change(function(){
    	$(".inputNum").val(""); //清空页码输入框的数据
        var optionSelType = $(this).find('option:selected').attr("data-type");
        optionType = (optionSelType == "ALL"?"": optionSelType);
        guoRenGuaDanList(1,page_size,optionStatus,optionType);
    });
    
});




require(['api_mkt', 'mkt_info','decimal', 'cookie'], function(api_mkt, mkt_info,decimal, mkt_pagehead) {
	
	 	$(".wrapper").on("click", ".btn-fenye", function() {
	        var pageNo=$(".inputNum").val();
	        if(!pageNo || pageNo<0){
            	return false;
            }
	        billList(parseInt(pageNo),10);
	    });
	    
	    $(".wrapper").on("keyup", ".inputNum", function(e) {
	    	var pageNo=$(this).val();
            var pageNum=$(this).attr("data-pagenum");
            if(parseInt(pageNo)>parseInt(pageNum)){
            	$(this).val(pageNum);
            }else if(pageNo==0){
            	$(this).val(1);
            }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
				$(this).val($(this).val().replace(this.value,""));
			}else if(e.keyCode==13){
				billList(parseInt(pageNo),10);
	        }
	    });
	    
	    /**
	     * 分页标签
	     */
	    $(".wrapper").on("click", ".billPageNo", function() {
	        var pageNo=$(this).attr("data-pageno");
	        billList(parseInt(pageNo),10);
	    });
	    
	    
	/**
	 * 账单分页查询
	 */
	var billList=function(pageNo,pageSize){
	    api_mkt.billList({
	        'pageNo':pageNo,
	        'pageSize':pageSize
	    },function(data) {
	        if (data.status == 200 && data.data && data.data.list.length!=0){
	            var html = [];
	            var num = data.data.list.length;
                $(".aside-table-tbody").html(""); //添加前清空 
	            for (var i = 0; i < num; i++) {
	                html.push("<tr>");
	                html.push("<td>" + data.data.list[i].createDate + "</td>");
	                html.push("<td class='operType'>" + data.data.list[i].operType + "</td>");
	                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].cnyNumber) + "</td>");
	                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].cnyBalance) + "</td>");
	                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].gopNumber) + "</td>");
	                html.push("<td class='toFixed'>" + decimal.getTwoPs(data.data.list[i].gopBalance) + "</td>");
	                html.push("</tr>");              
	            }    
	            $(".aside-table-tbody").append(html.join(""));

                //过滤内容显示不同颜色
                $(".operType").filter(":contains('CNYIN')").text('人民币充值');
                $(".operType").filter(":contains('CNYOUT')").text('人民币提现');
                $(".operType").filter(":contains('GOPIN')").text('果仁充值');
                $(".operType").filter(":contains('GOPOUT')").text('果仁提现');
                $(".operType").filter(":contains('BUY')").text('买入').css("color", "red");
                $(".operType").filter(":contains('SELL')").text('卖出').css("color", "green");
                $("td").filter(":contains('undefined')").text('0');
                
                var htmlPage = [];
                var pageNum=data.data.pageNum;
	            $(".billPage").html(""); 
	            $(".inputNum").attr("data-pagenum",pageNum);
	            $(".allNum").html(pageNum);
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

	            $(".billPage").html(htmlPage.join(""));
	            $(window).scrollTop(0);
	            if(pageNum>0){
	            	$(".bill").show();
   	            }else{
   	            	$(".bill").hide();
   	            }
	        } else {
	            //console.log('财务中心-资产状况-账户明细表格，加载失败。');
	        	$(".bill").hide();
	        }
	    }); 
	};
	
	billList(1,10);
    

});

require(['api_mkt', 'mkt_info', 'mkt_trade','decimal', 'cookie'], function(api_mkt, mkt_info, mkt_trade,decimal) {
    /*当前委托-历史委托 new 页面 tab*/
    $(function(){
        $(".entrust-side-table:gt(0)").hide();
        var liA = $(".tab-li");
        liA.click(function(){
            $(this).addClass("bottomon").siblings(".tab-li").removeClass("bottomon");
            var liA_index = liA.index(this);
            $(".entrust-side-table").eq(liA.index(this)).show().siblings(".entrust-side-table").hide();
        });
    });
    var text;
    //撤单
    $(".wrapper").on("click", ".saDan", function() {
        text = $(this).parent().parent().find('.id').text();
        $("#floor_bg").show();
        $("#sel_div_password").val("");
        $(".payment_error").hide();
        $("#floor_popDiv").fadeIn(500);
        //变为 撤单 确认框
        $('.h3_1').css('display','none');
        $('.sure_btn').css('display','none');
        $('#sel_div_password').css('display','none');
        $('.h3_2').css('display','block');
        $('.sure_btn1').css('display','block');
    
        
    }); 
    
    //确认撤单
    $("#floor_popDiv").on("click", ".confirm", function() {
        api_mkt.tradeGopCancelByid({
            'id':text
        },function(data) {        
            
        });
        //恢复为 买入卖出 确认框
        $("#floor_popDiv").hide(500);
        $("#floor_bg").hide();
        $('.h3_1').css('display','block');
        $('.sure_btn').css('display','block');
        $('#sel_div_password').css('display','block');
        $('.h3_2').css('display','none');
        $('.sure_btn1').css('display','none');
        window.location.reload();
    }); 
    
    //取消撤单
    $("#floor_popDiv").on("click", ".cancle", function() {
        $("#floor_bg").hide();
        $("#floor_popDiv").hide(500);
        //恢复为 买入卖出 确认框
        $("#floor_popDiv").hide(500);
        $("#floor_bg").hide();
        $('.h3_1').css('display','block');
        $('.sure_btn').css('display','block');
        $('#sel_div_password').css('display','block');
        $('.h3_2').css('display','none');
        $('.sure_btn1').css('display','none');
    });
    
    $(".wrapper").on("click", ".btn-current-fenye", function() {
        var pageNo=$(".inputCurrentNum").val();
        tradeGopCurrentList(parseInt(pageNo),10);
    });
    
    $(".wrapper").on("keyup", ".inputCurrentNum", function(e) {
    	var pageNo=$(this).val();
        var pageNum=$(this).attr("data-pagenum");
        if(pageNo>pageNum){
        	$(this).val(pageNum);
        }else if(pageNo==0){
        	$(this).val(1);
        }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(e.keyCode==13){
            tradeGopCurrentList(parseInt(pageNo),10);
        }
    });
    
    /**
     * 分页标签
     */
    $(".wrapper").on("click", ".currentPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        tradeGopCurrentList(parseInt(pageNo),10);
    });
    
    /**
     * 分页标签
     */
    $(".wrapper").on("click", ".historyPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        tradeGopHistoryList(parseInt(pageNo),10);
    });
    
    $(".wrapper").on("click", ".btn-history-fenye", function() {
        var pageNo=$(".inputHistroyNum").val();
        tradeGopHistoryList(parseInt(pageNo),10);
    });
    
    $(".wrapper").on("keyup", ".inputHistroyNum", function(e) {
    	var pageNo=$(this).val();
        var pageNum=$(this).attr("data-pagenum");
        if(pageNo>pageNum){
        	$(this).val(pageNum);
        }else if(pageNo==0){
        	$(this).val(1);
        }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(e.keyCode==13){
        	tradeGopHistoryList(parseInt(pageNo),10);
        }
    });
    
    /**
     * 当前委托分页查询
     */
    var tradeGopCurrentList=function(pageNo,pageSize){
        api_mkt.tradeGopCurrentList({
            'pageNo':pageNo,
            'pageSize':pageSize
        },function(data) {
            if (data.status == 200 && data.data.list.length >0) {
                var html = [];
                var num = data.data.list.length;
                $(".tradeGopCurrentListTable").html("");  //添加前清空 
                for(var i=0; i<num;i++){
                	html.push("<tr>");                                        
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");                
                    html.push("<td class='id' style='display:none'>"+ data.data.list[i].id +"</td>");
                    html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                    html.push("<td class='tradeGopFlag' style='display:none'>"+ data.data.list[i].tradeGopFlag +"</td>");                    
                    if(data.data.list[i].tradeGopFlag=='MARKET'){
                    	//市价
                        html.push("<td class='price'>市价</td>");
                    	if(data.data.list[i].tradeGopType=='SELL'){
                            html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                    	}else{
                            html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].market) +"</td>");
                    	}
                    }else{
                    	//限价
                        html.push("<td class='price'>"+ decimal.getTwoPs(data.data.list[i].price) +"</td>");
                        html.push("<td class='numTotal'>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                    }
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].tradedGop) + "</td>");
                    html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numOver) +"</td>");
                    html.push("<td><p class='saDan'>撤单</p></td>");
                    html.push("</tr>");                  
                } 
                $(".tradeGopCurrentListTable").append(html.join(""));  
                //过滤内容显示不同颜色
                $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green"); 
                
                var htmlPage = [];
                var pageNum=data.data.pageNum;
	            $(".currentPage").html(""); 
	            $(".inputCurrentNum").attr("data-pagenum",pageNum);
	            var start=pageNo>3?(pageNo-3):1;
	            var end=(pageNum-start)>=6?(start+6):pageNum;
	            if(end==pageNum){
	            	start=(pageNum-6)>1?(pageNum-6):1;
	            }
	            for(var i=start;i<=end;i++){
	            	if(i==start && pageNo!=start && i!=1){
	            		htmlPage.push('<a class="currentPageNo" href="javascript:void(0);" data-pageno="'+i+'">上一页</a>');  
	            	}else if(i==end && pageNo!=end && i!=pageNum){
	            		htmlPage.push('<a class="currentPageNo" href="javascript:void(0);" data-pageno="'+i+'">下一页</a>');  
	            	}else if(i==pageNo){
	            		htmlPage.push('<a class="currentPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
	            	}else{
	            		htmlPage.push('<a class="currentPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
	            	}
	            }
	            $(".currentPage").html(htmlPage.join(""));
	            $(window).scrollTop(0);
	            if(pageNum>0){
	            	$(".current").show();
	            }else{
	            	$(".current").hide();
	            }
            }else{
                //console.log(data);
            }
        });   
    }
    
    /**
     * 历史委托分页查询
     */
    var tradeGopHistoryList=function(pageNo,pageSize){
    	 api_mkt.tradeGopHistoryList({
             'pageNo':pageNo,
             'pageSize':pageSize
         },function(data) {
             if (data.status == 200) {
                 console.log(data);
                 var html = [];
                 var num =data.data.list.length;
                 $(".tradeGopHistoryListTable").html("");  //添加前清空 
                 for(var i=0; i<num;i++){
                 	html.push("<tr>");                                      
                     html.push("<td>"+ data.data.list[i].createDate +"</td>");
                     html.push("<td class='tradeGopType'>"+ data.data.list[i].tradeGopType +"</td>");
                     if(data.data.list[i].tradeGopFlag=='MARKET'){
                     	//市价
                         html.push("<td>市价</td>");
                     	if(data.data.list[i].tradeGopType=='SELL'){
                             html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                     	}else{
                             html.push("<td>"+ decimal.getTwoPs(data.data.list[i].market) +"</td>");
                     	}
                     }else{
                     	//限价
                         html.push("<td>"+ decimal.getTwoPs(data.data.list[i].price) +"</td>");
                         html.push("<td>"+ decimal.getTwoPs(data.data.list[i].numTotal) +"</td>");
                     }
                     html.push("<td class='priceAver'>"+ decimal.getTwoPs(data.data.list[i].tradedGop<=0?0:(data.data.list[i].totalTraded*100) / (data.data.list[i].tradedGop*100)) + "</td>");
                     html.push("<td>"+ decimal.getTwoPs(data.data.list[i].tradedGop) +"</td>");
                     html.push("<td>"+ decimal.getTwoPs(data.data.list[i].totalTraded) +"</td>");
                     html.push("<td class='tradeGopStatus'>"+ data.data.list[i].tradeGopStatus +"</td>");
                     html.push("</tr>");
                    
                 }  
                 $(".tradeGopHistoryListTable").append(html.join(""));
                 //过滤内容显示不同颜色
                 $(".tradeGopType").filter(":contains('BUY')").text('买入').css("color","red");                    
                 $(".tradeGopType").filter(":contains('SELL')").text('卖出').css("color","green");
                 $(".tradeGopStatus").filter(":contains('SUCCESS')").text('已成交').css("color","orange");                    
                 $(".tradeGopStatus").filter(":contains('CANCEL')").text('已撤销').css("color","#999");                                     
                 $(".priceAver").filter(":contains('Infinity')").text('0'); 
                 
                 var htmlPage = [];
                 var pageNum=data.data.pageNum;
 	            $(".historyPage").html(""); 
 	            $(".inputHistroyNum").attr("data-pagenum",pageNum);
 	            var start=pageNo>3?(pageNo-3):1;
 	            var end=(pageNum-start)>=6?(start+6):pageNum;
 	            if(end==pageNum){
 	            	start=(pageNum-6)>1?(pageNum-6):1;
 	            }
 	            for(var i=start;i<=end;i++){
 	            	if(i==start && pageNo!=start && i!=1){
 	            		htmlPage.push('<a class="historyPageNo" href="javascript:void(0);" data-pageno="'+i+'">上一页</a>');  
 	            	}else if(i==end && pageNo!=end && i!=pageNum){
 	            		htmlPage.push('<a class="historyPageNo" href="javascript:void(0);" data-pageno="'+i+'">下一页</a>');  
 	            	}else if(i==pageNo){
 	            		htmlPage.push('<a class="historyPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
 	            	}else{
 	            		htmlPage.push('<a class="historyPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
 	            	}
 	            }
 	            $(".historyPage").html(htmlPage.join(""));
 	            $(window).scrollTop(0);
 	           if(pageNum>0){
	            	$(".history").show();
	            }else{
	            	$(".history").hide();
	            }
             }else{
                 //console.log(data);
             }
         });
    }
     
    tradeGopCurrentList(1,10);
    
    tradeGopHistoryList(1,10);
    
    
    //接受跳转参数
    $(function(){
        function getQueryString(name) {
            href = decodeURIComponent(location.href);
            // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
            if (href.indexOf("?") == -1
                    || href.indexOf(name + '=') == -1) {
                return '';
            }
            // 获取链接中参数部分
            var queryString = href.substring(href.indexOf("?") + 1);
            // 分离参数对 ?key=value&key2=value2
            var parameters = queryString.split("&");
            var pos, paraName, paraValue;
            for ( var i = 0; i < parameters.length; i++) {
                // 获取等号位置
                pos = parameters[i].indexOf('=');
                if (pos == -1) {
                    continue;
                }
                // 获取name 和 value
                paraName = parameters[i].substring(0, pos);
                paraValue = parameters[i].substring(pos + 1);
                // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
                if (paraName == name) {
                    return unescape(paraValue.replace(/\+/g, " "));
                }
            }
            return '';
        };

        var b = getQueryString("whichtab");
        //console.log(b);
        if(b){
            $(".table2").show();
            $(".table1").hide();
            $(".left").removeClass("bottomon");
            $(".right").addClass("bottomon");
        }
        
    });      

});

require(['api_mkt', 'mkt_info','decimal', 'mkt_pagehead', 'cookie'], function(api_mkt, mkt_info,decimal) {
    $('.rmbxh').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbtx').removeClass('bottomon');
        $('.recharge').show();
        $('.withdraw_deposit').hide();
    });
    $('.rmbtx').on('click', function() {
        $(this).addClass('bottomon');
        $('.rmbxh').removeClass('bottomon');
        $('.recharge').hide();
        $('.withdraw_deposit').show();
    });

    $(".wrapper").on("click", ".nustInBtn", function() {
        var pageNo=$(".nutsInInput").val();
        transferInHistory(parseInt(pageNo),10);
    });
    
    $(".wrapper").on("keyup", ".nutsInInput", function(e) {
    	var pageNo=$(this).val();
        var pageNum=$(this).attr("data-pagenum");
        if(parseInt(pageNo)>parseInt(pageNum)){
        	$(this).val(pageNum);
        }else if(pageNo==0){
        	$(this).val(1);
        }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(e.keyCode==13){
			transferInHistory(parseInt(pageNo),10);
        }
    });
    
    /**
     * 分页标签
     */
    $(".wrapper").on("click", ".nutsInPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        transferInHistory(parseInt(pageNo),10);
    });
    
    //==============================
    
    $(".wrapper").on("click", ".nutsOutBtn", function() {
        var pageNo=$(".nutsOutInput").val();
        transferOutHistory(parseInt(pageNo),10);
    });
    
    $(".wrapper").on("keyup", ".nutsOutInput", function(e) {
    	var pageNo=$(this).val();
        var pageNum=$(this).attr("data-pagenum");
        if(parseInt(pageNo)>parseInt(pageNum)){
        	$(this).val(pageNum);
        }else if(pageNo==0){
        	$(this).val(1);
        }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(e.keyCode==13){
			transferOutHistory(parseInt(pageNo),10);
        }
    });
    
    /**
     * 分页标签
     */
    $(".wrapper").on("click", ".nutsOutPageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        transferOutHistory(parseInt(pageNo),10);
    });
   
    /**
     * 果仁充值分页查询
     */
    var transferInHistory=function(pageNo,pageSize){
        api_mkt.transferInHistory({
            'pageNo': pageNo,
            'pageSize': pageSize
        }, function(data) {
            if (data.status == 200) {
                var html = [];
                var num = data.data.list.length;
                $(".guorenInput").html(""); //添加前清空 
                for(var i=0; i<num;i++){
                    html.push("<tr>");
                    html.push("<td>" + data.data.list[i].createDate + "</td>");
                    html.push("<td>" + data.data.list[i].wallet + "</td>");
                    html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                    html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                    html.push("</tr>");     
                }
                $(".guorenInput").append(html.join(""));

                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");

                var htmlPage = [];
                var pageNum=data.data.pageNum;
                $(".nutsInInput").attr("data-pagenum",pageNum);
	            $(".nutsInPage").html(""); 
	            var start=pageNo>3?(pageNo-3):1;
	            var end=(pageNum-start)>=9?(start+9):pageNum;
	            if(end==pageNum){
	            	start=(pageNum-9)>1?(pageNum-9):1;
	            }
        		htmlPage.push('<a class="nutsInPageNo" href="javascript:void(0);" data-pageno="'+(start>1?(start-1):1)+'">上一页</a>');  
	            for(var i=start;i<=end;i++){
	            	if(i==pageNo){
	            		htmlPage.push('<a class="nutsInPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
	            	}else{
	            		htmlPage.push('<a class="nutsInPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
	            	}
	            }
        		htmlPage.push('<a class="nutsInPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>');  

	            $(".nutsInPage").html(htmlPage.join(""));
	            $(window).scrollTop(0);
	            if(pageNum>0){
	            	$(".nutsIn").show();
   	            }else{
   	            	$(".nutsIn").hide();
   	            }
            }else{
            	$(".nutsIn").hide();
            }
        });
    }
    
    /**
     * 果仁提现分页查询
     */
    var transferOutHistory=function(pageNo,pageSize){
        api_mkt.transferOutHistory({
            'pageNo': pageNo,
            'pageSize': pageSize
        }, function(data) {
            if (data.status == 200) {
                var html = [];
                var num = data.data.list.length;
                $(".guorenOutput").html(""); //添加前清空 
                for(var i=0; i<num;i++){
                    html.push("<tr>");
                    html.push("<td>" + data.data.list[i].createDate + "</td>");
                    html.push("<td>" + data.data.list[i].wallet + "</td>");
                    html.push("<td>" + decimal.getTwoPs(data.data.list[i].number) + "</td>");
                    html.push("<td class='status'>" + data.data.list[i].transferGopStatus + "</td>");
                    html.push("</tr>");               
                }
                $(".guorenOutput").append(html.join(""));
                //过滤内容显示不同颜色
                $(".status").filter(":contains('SUCCESS')").text('已到账').css("color", "#999");                
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color", "orange");          
                $(".status").filter(":contains('FAILURE')").text('失败').css("color", "#999");
            
                var htmlPage = [];
                var pageNum=data.data.pageNum;
	            $(".nutsOutPage").html(""); 
	            $(".nutsOutInput").attr("data-pagenum",pageNum);
	            var start=pageNo>3?(pageNo-3):1;
	            var end=(pageNum-start)>=9?(start+9):pageNum;
	            if(end==pageNum){
	            	start=(pageNum-9)>1?(pageNum-9):1;
	            }
	            htmlPage.push('<a class="nutsOutPageNo" href="javascript:void(0);" data-pageno="'+(start>1?(start-1):1)+'">上一页</a>');
	            for(var i=start;i<=end;i++){
	            	if(i==pageNo){
	            		htmlPage.push('<a class="nutsOutPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
	            	}else{
	            		htmlPage.push('<a class="nutsOutPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
	            	}
	            }
            	htmlPage.push('<a class="nutsOutPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>');
	            $(".nutsOutPage").html(htmlPage.join(""));
	            $(window).scrollTop(0);
	            if(pageNum>0){
	            	$(".nutsOut").show();
   	            }else{
   	            	$(".nutsOut").hide();
   	            }
            }else{
            	$(".nutsOut").hide();
            }
        });
    }
    
    transferOutHistory(1,10);
    transferInHistory(1,10);
    
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

        var b = getQueryString("id");
        //console.log(b);
        if(b){
            $('.rmbtx').addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        }
        
    })
            
});

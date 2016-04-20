require(['api_mkt', 'cookie'], function(api_mkt) {
	var category="ALL";//消息类型
	var pageSize=10;//分页数量
	var pageNum=0;
	$(".wrapper").on("click", ".btn-fenye", function() {
        var pageNo=$(".inputNum").val();
        mymessage(parseInt(pageNo),pageSize);
    });
    
    $(".wrapper").on("keyup", ".inputNum", function(e) {
        var pageNo=$(this).val();
        if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
			$(this).val($(this).val().replace(this.value,""));
		}else if(pageNo>pageNum){
			pageNo=pageNum;
			$(this).val(pageNo);
		}else if(parseInt(pageNo)==0){
			pageNo=1;
			$(this).val(1);
		}else if(e.keyCode==13){
			mymessage(parseInt(pageNo),pageSize);
        }
    });
    
    /**
     * 分页标签
     */
    $(".wrapper").on("click", ".messagePageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        mymessage(parseInt(pageNo),pageSize);
    });
    
    var mymessage = function(pageNo,pageSize) {
        $("#itemContainer").html("")
        var obj = {};
        if (category == "ALL") {} else {
        	obj.category = category;
        }
        obj.pageNo=pageNo;
        obj.pageSize=pageSize;
        api_mkt.message(obj, function(data) {
            //console.log(data.data.list);  right_reg_side_content  message_cont
            var messagehtml = "";
            $("#itemContainer").html("");
            $(".messagePage").html(""); 
            if (data) {
                if (data.data) {
                    if (data.data.list) {
                        var dlist = data.data.list;
                        for (var i = 0; i < dlist.length; i++) {
                            var categoryname = dlist[i]['cmsNewsCategory'];
                            var categoryname_showvalue = "";
                            if (categoryname == "ASSETS") {
                                categoryname_showvalue = "资产";
                            } else if (categoryname == "SECURITY") {
                                categoryname_showvalue = "安全";
                            } else if (categoryname == "SYSTEM") {
                                categoryname_showvalue = "系统";
                            }
                            if (i%2== 0) {
                                messagehtml += "<li><div class='message_cont_box color_let'><span>" + categoryname_showvalue + "</span><span>" + dlist[i]['createDate'] + "</span><div class='messageDiv'>" + dlist[i]['content'] + "</div></div></li>";
                            } else {
                                messagehtml += "<li><div class='message_cont_box'><span>" + categoryname_showvalue + "</span><span>" + dlist[i]['createDate'] + "</span><div class='messageDiv'>" + dlist[i]['content'] + "</div></div></li>";
                            }
                        }
                    }
                    $("#itemContainer").html(messagehtml);
                    var htmlPage = [];
                    pageNum=data.data.pageNum; 
                    $(".allNum").html(pageNum);
    	            var start=pageNo>3?(pageNo-3):1;
    	            var end=(pageNum-start)>=6?(start+6):pageNum;
    	            if(end==pageNum){
    	            	start=(pageNum-6)>1?(pageNum-6):1;
    	            }
    	            htmlPage.push('<a class="messagePageNo" href="javascript:void(0);" data-pageno="'+(start>1?(start-1):1)+'">上一页</a>');
    	            for(var i=start;i<=end;i++){
    	            	if(i==pageNo){
    	            		htmlPage.push('<a class="messagePageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
    	            	}else{
    	            		htmlPage.push('<a class="messagePageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
    	            	}
    	            	htmlPage.push('<a class="messagePageNo" href="javascript:void(0);" data-pageno="'+(end<pageNum?(end+1):pageNum)+'">下一页</a>');
    	            }
    	            $(".messagePage").html(htmlPage.join(""));
    	            $(window).scrollTop(0);
    	           if(pageNum>0){
    	            	$(".PageCode").show();
    	            }else{
    	            	$(".PageCode").hide();
    	            }
                } else {
                    $(".right_reg_side_content").css("border-bottom","none");
                    $(".holder").hide();
                    $(".PageCode").hide();
                }
                
            }
            

            
        });
    }

    api_mkt.realAuth({
    }, function(data) {
        if (data.status == 200) {
        } else if (data.status == 305) {
        } else if(data.status == 400){
        } else {
        }
    });

    /*mymessage("ALL"); //默认是全部选中*/
    $(".tab").on("click", function() {
        var messageonehtml = "";
        $(this).siblings().removeClass("choosed_on_mes");
        $(this).addClass("choosed_on_mes");
        category=$(this).attr("data-category");
        if ($(this).hasClass("one")) { //全部
            mymessage(1,pageSize);
        } else if ($(this).hasClass("two")) { //系统
            mymessage(1,pageSize);
        } else if ($(this).hasClass("three")) { //安全
            mymessage(1,pageSize);
        } else if ($(this).hasClass("four")) { //资产
            mymessage(1,pageSize);
        }
    });
    
    mymessage(1,pageSize);
    
    //hover 效果
    $('.ls_tab').hover(function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fafafa');
        }
    },function(){
        if($(this).hasClass('ls_tab_on')){
            $(this).css('backgroundColor','#f1f1f1');
        }else{
            $(this).css('backgroundColor','#fff');
        }
    });

    //消息列表 hover 显示滚动条
    $('.messageDiv').hover(function(){
        if($(this).text().length > 100){
           $(this).addClass('scrollY');
        }
    },function(){
        $(this).removeClass('scrollY');
    });
});

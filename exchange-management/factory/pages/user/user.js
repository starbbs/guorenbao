require(['api_mkt_management'], function(api_mkt_management) {
    
    //控制面板右侧 常用 的显示隐藏
        $(".aside-div-spanRight").hover(function(){
            $(".aside-div-spanRight-div").show();
        },function(){
            var timer = setTimeout(function(){
                $(".aside-div-spanRight-div").hide();
            },500);
            $(".aside-div-spanRight-div").hover(function(){
            $(".aside-div-spanRight-div").show();
            clearInterval(timer);
            });
        });

    $(".set, .set-icon").click(function(e){
        var ul=$(".new");
        if(ul.css("display")=="none"){
            ul.slideDown();
        }else{
            ul.slideUp();
        };
        e.stopPropagation(); 
    });
    
    $(".select li").click(function(e){
        var li=$(this).text();
        $(".select p").html(li);
        $(".new").hide();
        /*$(".set").css({background:'none'});*/
        e.stopPropagation();   
    });
    
    //分页开始-jxn
    var page_size = 10; //每页条数
    var optionStatus = ''; //当前状态，"显示全部"时为''
    var pageTotle;
    $(document).on("click", ".btn-fenye", function() {
        var pageNo=$(".inputNum").val();
        if(pageNo > pageTotle){
        	$(".inputNum").val(pageTotle);
        }
        queryUser(parseInt(pageNo),page_size,optionStatus);
    });
    
    $(document).on("click", ".aside-div-searchBtn", function() {
    	queryUser(1,page_size,optionStatus);
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
			queryUser(parseInt(pageNo),page_size,optionStatus);
        }
    });
    
    /**
     * 分页标签
     */
    $(document).on("click", ".pageNo", function() {
        var pageNo=$(this).attr("data-pageno");
        queryUser(parseInt(pageNo),page_size,optionStatus);
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
   
    
    var queryUser=function(pageNo,pageSize){
    	var param={};
    	param.pageNo=pageNo;
    	param.pageSize=pageSize;
    	if($(".aside-div-input").val()){
    		param[$(".aside-div-select").val()]=$(".aside-div-input").val();
    	}
        api_mkt_management.userList(param,function(data){
            if (data.status == 200) {
                var html = [];
                var len = data.data.list.length;
                for(var i=0; i<len;i++){
                    html.push("<tr>");
                    html.push("<td class='toUidInfo'><a href='javascript:;'>"+ data.data.list[i].uid +"</a></td>");
                    html.push("<td class='mobile'>"+ data.data.list[i].mobile +"</td>");
                    html.push("<td class='userNameHave'>"+ data.data.list[i].name +"</td>");
                    html.push("<td>"+ data.data.list[i].createDate +"</td>");
                    html.push("<td>"+ data.data.list[i].createip +"</td>");
                    html.push("</tr>");                    
                } 
                $(".aside-table-tbody").html(html.join(""));  
                
                var htmlPage = [];
                var pageNum = data.data.pageNum;
				var start=pageNo>3?(pageNo-3):1;
	            var end=(pageNum-start)>=9?(start+9):pageNum;
	            if(end==pageNum){
	            	start=(pageNum-9)>1?(pageNum-9):1;
	            }
        		htmlPage.push('<a class="pageNo" href="javascript:void(0);" data-pageno="'+(pageNo>1?(pageNo-1):1)+'">上一页</a>');  

	            for(var i=start;i<=end;i++){
	            	if(i==pageNo){
	            		htmlPage.push('<a class="pageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
	            	}else{
	            		htmlPage.push('<a class="pageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
	            	}
	            }
        		htmlPage.push('<a class="pageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>'); 
         		$(".PageCode").html('<span class="paging"></span><input type="text" class="inputNum"/><span class="allNum"></span><span class="btn-fenye">确定</span>');
         		$(".paging").html(htmlPage.join(""));
            }
        });   
    }

    queryUser(1,page_size);
});




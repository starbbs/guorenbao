require(['api_mkt','mkt_info','decimal','cookie'], function(api_mkt,mkt_info,decimal) {

        $('.rmbxh').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbtx').removeClass('bottomon');
            $('.recharge').show();
            $('.withdraw_deposit').hide();
        });
        $('.rmbtx').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
        });    

        
        $(".wrapper").on("click", ".cnydepostisBtn", function() {
            var pageNo=$(".cnydepostisInput").val();
            if(!pageNo || pageNo<0){
            	return false;
            }
            rmbRechargeHistory(parseInt(pageNo),10);
        });
        
        $(".wrapper").on("keyup", ".cnydepostisInput", function(e) {
            var pageNo=$(this).val();
            var pageNum=$(this).attr("data-pagenum");
            if(parseInt(pageNo)>parseInt(pageNum)){
            	$(this).val(pageNum);
            }else if(pageNo==0){
            	$(this).val(1);
            }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
    			$(this).val($(this).val().replace(this.value,""));
    		}else if(e.keyCode==13){
    			rmbRechargeHistory(parseInt(pageNo),10);
            }
        });
        
        $(".iknow").on("click",function(){
            $(".mydiv").hide();
            $(".bg").hide();
        });
        /**
         * 分页标签
         */
        $(".wrapper").on("click", ".cnydepostisPageNo", function() {
            var pageNo=$(this).attr("data-pageno");
            rmbRechargeHistory(parseInt(pageNo),10);
        });
        
        $(".wrapper").on("click", ".cnywithdrawBtn", function() {
            var pageNo=$(".cnywithdrawInput").val();
            if(!pageNo || pageNo<0){
            	return false;
            }
            rmbWithdrawalsHistory(parseInt(pageNo),10);
        });
        
        $(".wrapper").on("keyup", ".cnywithdrawInput", function(e) {
        	var pageNo=$(this).val();
            var pageNum=$(this).attr("data-pagenum");
            if(parseInt(pageNo)>parseInt(pageNum)){
            	$(this).val(pageNum);
            }else if(pageNo==0){
            	$(this).val(1);
            }else if(this.value.charCodeAt()<48 || this.value.charCodeAt()>57){
    			$(this).val($(this).val().replace(this.value,""));
    		}else if(e.keyCode==13){
    			rmbWithdrawalsHistory(parseInt(pageNo),10);
            }
        });
        
        /**
         * 分页标签
         */
        $(".wrapper").on("click", ".cnywithdrawPageNo", function() {
            var pageNo=$(this).attr("data-pageno");
            rmbWithdrawalsHistory(parseInt(pageNo),10);
        });
        
        /**
         * 查看此笔充值单
         */
        $(".wrapper").on("click", ".checkDeal", function() {
            //打开弹出层-生成汇款单
            $(".mydiv").css("display","block");
            $(".bg").css("display","block");               
            $(".remittance-id").text($(this).parent().find('.txid').text());
            $(".money-new").text('¥'+$(this).parent().find('.money').text());                
            $(".remittance-note-numbe-newr").text($(this).parent().find('.uid').text());
            $(".zsyhwy").text($(this).parent().find(".bank").text());
            //关闭弹出层 -生成汇款单
            $(".span-text").click(function(){
                $(".mydiv").css("display","none");
                $(".bg").css("display","none");
            });  
        });
        
        /**
         * 人民币充值分页查询
         */
        var rmbRechargeHistory=function(pageNo,pageSize){
            api_mkt.rmbRechargeHistory({
                    'pageNo':pageNo,
                    'pageSize':pageSize
                },function(data) {
                    if (data.status == 200) {
                        var html = [];
                        var num = data.data.list.length;
                        $(".cnyInput").html("");  //添加前清空 
                        for(var i=0; i<num;i++){
                            html.push("<tr>");                                        
                            html.push("<td>"+ data.data.list[i].createDate +"</td>");
                            html.push("<td class='bank'>"+ data.data.list[i].bank +"</td>");
                            html.push("<td class='money'>"+ decimal.getTwoPs(data.data.list[i].money) +"</td>");                    
                            html.push("<td style='display:none' class='txid'>"+ data.data.list[i].txid +"</td>");
                            html.push("<td style='display:none' class='name'>"+ data.data.list[i].name +"</td>");  
                            html.push("<td style='display:none' class='uid'>"+ data.data.list[i].uid +"</td>");                   
                            html.push("<td style='display:none' class='acnumber'>"+ data.data.list[i].acnumber +"</td>");
                            html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                            html.push("<td class='checkDeal'>查看此笔充值单</td>");
                            html.push("</tr>");

                            
                        }
                        $(".cnyInput").append(html.join(""));

                        //过滤内容显示不同颜色
                        $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");                                      
                        $(".status").filter(":contains('CANCEL')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                  
                        $(".status").filter(":contains('SUCCESS')").text('已完成').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');                                      
                        $(".status").filter(":contains('CLOSED')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('');
                        
                        var htmlPage = [];
                        var pageNum=data.data.pageNum;
        	            $(".cnydepostisPage").html(""); 
        	            $(".cnydepostisInput").attr("data-pagenum",pageNum);
        	            $(".cnydepostisAllNum").html(pageNum);
        	            var start=pageNo>3?(pageNo-3):1;
        	            var end=(pageNum-start)>=9?(start+9):pageNum;
        	            if(end==pageNum){
        	            	start=(pageNum-6)>1?(pageNum-6):1;
        	            }      	            
	            		htmlPage.push('<a class="cnydepostisPageNo" href="javascript:void(0);" data-pageno="'+(pageNo>1?(pageNo-1):1)+'">上一页</a>');  
	            		for(var i=start;i<=end;i++){
        	            	if(i==pageNo){
        	            		htmlPage.push('<a class="cnydepostisPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
        	            	}else{
        	            		htmlPage.push('<a class="cnydepostisPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
        	            	}
        	            }
	            		htmlPage.push('<a class="cnydepostisPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>');  
        	            $(".cnydepostisPage").html(htmlPage.join(""));
        	            $(window).scrollTop(0);
        	            if(pageNum>0){
        	            	$(".cnydepostis").show();
    	   	            }else{
    	   	            	$(".cnydepostis").hide();
    	   	            }
        	            
                    }else{
                        //console.log('财务中心-人民币充值历史表格，加载失败。');
                    	$(".cnydepostis").hide();
                    }
                });
        }
       
        var rmbWithdrawalsHistory=function(pageNo,pageSize){
        	 //人民币转出 带分页
            api_mkt.rmbWithdrawalsHistory({
                'pageNo':pageNo,
                'pageSize':pageSize
            },function(data) {
                if (data.status == 200 && data.data.list.length > 0) {
                    //console.log(data);
                    var html = [];
                    var num = data.data.list.length;
                    $(".cnyOutput").html("");  //添加前清空 
                    for(var i=0; i<num;i++){
                        html.push("<tr>");                                        
                        html.push("<td>"+ data.data.list[i].updateDate +"</td>");
                        html.push("<td>"+ data.data.list[i].bank +"</td>");
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].pay) +"</td>");                 
                        html.push("<td>"+ decimal.getTwoPs(data.data.list[i].fee) +"</td>");
                        html.push("<td class='status'>"+ data.data.list[i].transferCnyStatus +"</td>");
                        html.push("</tr>");                   
                    }
                    $(".cnyOutput").append(html.join(""));
                    //过滤内容显示不同颜色
                    // $(".status").filter(":contains('WAIT')").text('进行中').css("color","orange");
                    // $(".status").filter(":contains('PROCESSING')").text('进行中').css("color","orange");
                    // $(".status").filter(":contains('SUCCESS')").text('转出成功').css("color","#ccc");  
                    // $(".status").filter(":contains('CANCEL')").text('已关闭').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('已关闭');                  

                    $(".status").filter(":contains('WAIT')").text('等待').css("color","orange");
                $(".status").filter(":contains('PROCESSING')").text('进行中').css("color","orange");
                $(".status").filter(":contains('SUCCESS')").text('转出成功').css("color","#ccc");
                $(".status").filter(":contains('FAILURE')").text('已退款').css("color","#ccc");
                $(".status").filter(":contains('CANCEL')").text('已撤销').css("color","#ccc").parent().find('.checkDeal').removeClass('checkDeal').text('已关闭');
                    
                    var htmlPage = [];
                    var pageNum=data.data.pageNum;
    	            $(".cnywithdrawPage").html(""); 
    	            $(".cnywithdrawInput").attr("data-pagenum",pageNum);
    	            $(".cnywithdrawAllNum").html(pageNum);
    	            var start=pageNo>3?(pageNo-3):1;
    	            var end=(pageNum-start)>=9?(start+9):pageNum;
    	            if(end==pageNum){
    	            	start=(pageNum-6)>1?(pageNum-6):1;
    	            }
            		htmlPage.push('<a class="cnywithdrawPageNo" href="javascript:void(0);" data-pageno="'+(pageNo>1?(pageNo-1):1)+'">上一页</a>');  
    	            for(var i=start;i<=end;i++){
    	            	if(i==pageNo){
    	            		htmlPage.push('<a class="cnywithdrawPageNo" href="javascript:void(0);" data-pageno="'+i+'" style="color:blue;">'+pageNo+'</a>');
    	            	}else{
    	            		htmlPage.push('<a class="cnywithdrawPageNo" href="javascript:void(0);" data-pageno="'+i+'">'+i+'</a>');  
    	            	}
    	            }
            		htmlPage.push('<a class="cnywithdrawPageNo" href="javascript:void(0);" data-pageno="'+(pageNo<pageNum?(pageNo+1):pageNum)+'">下一页</a>');  

    	            $(".cnywithdrawPage").html(htmlPage.join(""));
    	            $(window).scrollTop(0);
    	            if(pageNum>0){
    	            	$(".cnywithdraw").show();
	   	            }else{
	   	            	$(".cnywithdraw").hide();
	   	            }
                }else{
                   // console.log('财务中心-人民币转出历史表格，加载失败。');
                	$(".cnywithdraw").hide();
                }
            });
        }
           

        //生成汇款单校验
        //开户人姓名校验
        var btnConfirm = false;
        $("#bank-username").blur(function(){
            var username = $("#bank-username").val();
            if(!username){
                btnConfirm = false;
                $('.msg-bank-username').show().text('请输入正确开户人姓名');
            }else{
                $('.msg-bank-username').hide();
                btnConfirm = true;
            }
        });
        //充值金额校验
        $("#bank-money").blur(function(){
            var bankmoney = $("#bank-money").val();
            if(bankmoney < 100 || isNaN(bankmoney)){
                btnConfirm = false;
                $('.msg-bank-money').show().text('最小充值金额为100元');
            }else{
                $('.msg-bank-money').hide();
                btnConfirm = true;
            }
        });
        $("#bank-money").focus(function(){
            $("#bank-money").val('');
        });        

        
        rmbRechargeHistory(1,10);
        rmbWithdrawalsHistory(1,10);
        
        //接受跳转参数
        $(function() {
            function getQueryString(name) {
                href = decodeURIComponent(location.href);
                // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
                if (href.indexOf("?") == -1 || href.indexOf(name + '=') == -1) {
                    return '';
                }
                // 获取链接中参数部分
                var queryString = href.substring(href.indexOf("?") + 1);
                // 分离参数对 ?key=value&key2=value2
                var parameters = queryString.split("&");
                var pos, paraName, paraValue;
                for (var i = 0; i < parameters.length; i++) {
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

            var b = getQueryString("formindex");
            if (b) {
                $('.rmbtx').addClass('bottomon');
                $('.rmbxh').removeClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
            }
        });
        
});
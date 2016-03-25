require(['api_mkt'],function(){
	var exchangeToken = $.cookie('exchangeToken');
	if (!exchangeToken) {
        $(".wrapper").on("click",function(){
        	$(".popDiv").show();
        	$(".bg").show();
        });
        $(".close_btn").on("click",function(e){
	    	$(".popDiv").hide();
	        $(".bg").hide();
	        return false;
	    });
    } else {
        // $(".login_regist").hide();
        // $(".login_header").show();
        // $("#logined_username").html(global_loginusername);
        // $(".popDiv").hide();
        // $(".bg").hide();
        //alert("bg");
    }
});
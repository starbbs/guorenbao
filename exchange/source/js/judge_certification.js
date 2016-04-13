require(['api_mkt'],function(api_mkt){
/*	var exchangeToken = $.cookie('exchangeToken');
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
    }*/
    // var whether_certification = $.cookie("");

    // var global_loginusername = $.cookie("global_loginusername");
    // if(!global_loginusername){
    //     alert("您还未实名认证,请先实名认证再操作此页面");
    //     location.href = "./index.html";
    // } else {
        
    // }
    
    api_mkt.realAuth({
    }, function(data) {
        if (data.status == 200) {
            // console.log(data.msg);
        } else if (data.status == 305) {
            // console.log(data.msg);
        } else if(data.status == 400){
            // console.log(data.msg);
        } else if(data.status == 444){
            // console.log(data.msg);
        }
    });
}); 
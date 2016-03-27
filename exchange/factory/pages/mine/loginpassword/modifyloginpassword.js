require(['api_mkt','cookie'], function(api_mkt) {
	var exchangeToken = $.cookie('exchangeToken');
	var global_loginuserphone = $.cookie("global_loginuserphone");
	if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else {  			//已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        // api_mkt.userbasic(function(data){
        //     $("#who_account").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
        // });
        $("#who_account").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));

    }

   	$(".currentPwd").on("blur",function(){
   		if($(this).val()==""){
   			$("#one_span").show().html("原登录密码不能为空");
   			return;
   		} else {
   			$("#one_span").hide().html("");
   		}
   	});
    $(".newPwd").on("blur",function(){
    	if($(this).val()==""){
   			$("#two_span").show().html("新登录密码不能为空");
   			return;
   		} else {
   			$("#two_span").hide().html("");
   		}
   		if($(this).val()!==""&&$(this).val()!==$(".newPwd").val()){
   			$("#two_span").show().html("两次密码不相同");
   			return;
   		} else {
   			$("#two_span").hide().html("");
   		}
    });
    $(".confirmNewPwd").on("blur",function(){
    	if($(this).val()==""){
   			$("#three_span").show().html("确认新密码不能为空");
   			return;
   		}
   		if($(this).val()!==""&&$(this).val()!==$(".newPwd").val()){
   			$("#three_span").show().html("两次密码不相同");
   			return;
   		} else {
   			$("#three_span").hide().html("");
   		}
    });

    var whether_sub = true;
    $(".next_step_btn").on("click",function(){
    	whether_sub = true;
    	$("#one_span,#two_span,#three_span").hide().html("");
    	if($("#currentPwd").val()==""){
    		$("#one_span").show().html("原登录密码不能为空");
    		whether_sub = false;
    	}
    	if($("#newPwd").val()==""){
    		$("#two_span").show().html("新登录密码不能为空");
    		whether_sub = false;
    	}
    	if($("#confirmNewPwd").val()==""){
    		$("#three_span").show().html("确认密码不能为空");
    		whether_sub = false;
    	}
    	if($("#newPwd").val()!==$("#confirmNewPwd").val()){
    		$("#three_span").show().html("两次密码不相同");
    		whether_sub = false;
    	}
    	if(whether_sub){
    		api_mkt.loginpassword({
	            currentPwd: $("#currentPwd").val(),
	            newPwd: $("#newPwd").val(),
	            confirmNewPwd: $("#confirmNewPwd").val()
	        }, function(data) {
	            if (data.status == 200) {
	                console.log("asdfjkl")
	                $(".reset_login_password_step_1").hide();
	                $(".reset_login_password_step_2").show();
	            } else if (data.status == 305) {
	                alert(data.msg);
	            } else if (data.status==400) {
	            	if(data.msg=="原密码错误"){
	            		$("#one_span").show().html(data.msg);
	            	} else if(data.msg=="密码长度错误"){
	            		$("#three_span").show().html(data.msg);
	            	}
                } else {
	            	$("#three_span").show().html(data.msg);
	            }
	        });
    	}
    });
});
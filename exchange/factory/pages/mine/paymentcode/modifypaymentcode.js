require(['api_mkt','cookie'], function(api_mkt) {
	var exchangeToken = $.cookie('exchangeToken');
	var global_loginuserphone = $.cookie("global_loginuserphone");
	var checkFlag1=false;//校验通过标志
	var checkFlag2=false;//校验通过标志
	var checkFlag3=false;//校验通过标志
	var checkFlag4=false;//校验通过标志
	if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else {  			//已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        $("#who_account").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));

    	$("#currentPayPwd").on("blur",function(){
    		var reg = new RegExp("^[0-9]*$");//纯数字
    		var hanzi = /[\u4e00-\u9fa5]/;//汉字
    		if($(this).val().indexOf(" ")>0 || $(this).val().length>20||$(this).val().length<8 || reg.test($(this).val()) || hanzi.test($(this).val())){
	   			$("#error_one").show().html("请输入8~20位原支付密码");
	   			checkFlag1= false;
	   		} else {
	   			$("#error_one").hide().html("");
	   			checkFlag1= true;
	   		}
    	});
    	
    	$("#newPayPwd").on("blur",function(){
    		var reg = new RegExp("^[0-9]*$");//纯数字
    		var hanzi = /[\u4e00-\u9fa5]/;//汉字
    		if($(this).val().indexOf(" ")>0 || $(this).val().length>20||$(this).val().length<8 || reg.test($(this).val()) || hanzi.test($(this).val())){
	   			$("#error_two").show().html("请输入8~20位新支付密码");
	   			checkFlag2= false;
	   			return;
	   		}  else {
	   			$("#error_two").hide().html("");
	   			checkFlag2= true;
	   		}
    	});
    	
    	$("#confirmPayPwd").on("blur",function(){
    		var reg = new RegExp("^[0-9]*$");//纯数字
    		var hanzi = /[\u4e00-\u9fa5]/;//汉字
    		if($(this).val().indexOf(" ")>0 || $(this).val().length>20||$(this).val().length<8 || reg.test($(this).val()) || hanzi.test($(this).val())){
	   			$("#error_three").show().html("请再次输入新支付密码");
	   			checkFlag3= false;
	   			return;
	   		}  else {
	   			$("#error_three").hide().html("");
	   			checkFlag3= true;
	   		}
	   		if($(this).val()!==""&&$("#newPayPwd").val()!=""&&$(this).val()!==$("#newPayPwd").val()){
	   			$("#error_three").show().html("两次输入不一致");
	   			checkFlag3= false;
	   		} else {
	   			$("#error_three").hide().html("");
	   			checkFlag3= true;
	   		}
    	});
    	
    	$("#identifyingCode").on("blur",function(){
    		if($(this).val()==""){
	   			$("#error_four").show().html("验证码不能为空");
	   			checkFlag4= false;
	   		} else {
	   			$("#error_four").hide().html("");
	   			checkFlag4= true;
	   		}
    	});

	    $(".next_step_btn_one").on("click",function(){
	    	if(checkFlag1 && checkFlag2 && checkFlag3 && checkFlag4){
	    		api_mkt.setpaypwd({
		            currentPayPwd: $("#currentPayPwd").val(),
		            newPayPwd: $("#newPayPwd").val(),
		            confirmPayPwd: $("#confirmPayPwd").val(),
		            identifyingCode: $("#identifyingCode").val()
		        }, function(data) {
		            if (data.status == 200) {
		                // $(".one").hide();
		                // $(".two").show();
		                $(".correct").show();
	                    $(".rg_lf_label").hide();
	                    $(".rg_rg_input").hide();
	                    toIndex();
		            } else if (data.status == 305) {
		                alert(data.msg);
		            } else if (data.status==400) {
		            	if(data.msg=="验证码错误"){
		            		$("#error_four").show().html(data.msg);
		            	} else if(data.msg=="密码长度错误"){
		            		$("#error_four").show().html(data.msg);
		            	} else if(data.msg=="原支付密码输入错误"){
		            		$("#error_one").show().html(data.msg);
		            	} else if(data.msg=="支付密码必须为数字"){
		            		$("#error_four").show().html(data.msg);
		            	} else if(data.msg=="支付密码长度错误"){
		            		$("#error_four").show().html(data.msg);
		            	}
	                } else {
		            	$("#error_three").show().html(data.msg);
		            }
		        });
	    	}else{
	    		
	    		$('#currentPayPwd').focus();
	    		$('#currentPayPwd').blur();
	    		
	    		$('#newPayPwd').focus();
	    		$('#newPayPwd').blur();

	    		$('#confirmPayPwd').focus();
	    		$('#confirmPayPwd').blur();

	    		$('#identifyingCode').focus();
	    		$('#identifyingCode').blur();
	    	}
	    });
	    


	    //获取短信验证码
		$('.getauthcode').click(function(){
            if(whether_sub_one == false){
                alert('请完善填写信息！');
            } else {
                api_mkt.sendCodeByLoginAfter( function(data) {
                    if (data.status == 200) {
                        console.log(data);
                        //60秒内只能发送一次
		                var count = 60;
		                var resend = setInterval(function(){
		                    count--;
		                    if(count > 0){
		                        $('.getauthcode').html(count+'s后重新发送');
		                        $('.getauthcode').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
		                    }else{
		                        clearInterval(resend);
		                        $('.getauthcode').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).text('获取验证码');
		                    }
		                },1000);
                    } else {

                    }
                });
                
            }
        });
    }

    function toIndex() {
        var count = 3;
        var timer = setInterval(function() {
            count--;
            if (count > 0) {
                $("#howmanysecond").text(count);
            } else {
                clearInterval(timer);
                location.href = "./basicinfo.html";
            }
        }, 1000);
    }
});
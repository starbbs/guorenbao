require(['api_mkt','cookie'], function(api_mkt) {
    var popup_login_times = 0;
    var exchangeToken = $.cookie('exchangeToken');
    console.log(exchangeToken);
    var global_loginusername = "";
    if (!exchangeToken) {
    	$(".login_regist").show();
    } else {
    	$(".login_regist").hide();
        $(".login_header").show();
        $("#logined_username").html(global_loginusername);
        $(".popDiv").hide();
        $(".bg").hide();
    }
    //右上角登录按钮点击之后出发的事件
    $(".popup_login_btn").on("click", function() {
        popup_login_times++;
        var phone = $(".phone").val();
        var password = $(".password").val();
        api_mkt.login({
            phone: phone,
            password: password
        }, function(data) {
            if (data.status == 200) {
                $.cookie('exchangeToken', 'logined');
                alert(data.msg);
                $(".login_regist").hide();
                $(".login_header").show();
                $(".popDiv").hide();
                $(".bg").hide();
                //data.data.phone;  data.data.name
                global_loginusername = data.data.phone;
                $("#logined_username").html(data.data.phone);
            } else if (data.status == 305) {
                alert(data.msg);
            }
        });
        if (popup_login_times > 3) {
            $("#authcode").show();
            $(".popup_login_btn").css("top", "250px");
            $(".bottom_div").css("top", "284px");
        } else {
            $(".popup_login_btn").css("top", "190px");
            $(".bottom_div").css("top", "226px");
        }
    });
    $(".global_loginbtn").on('click', function() {
        $(".popDiv").show();
        $(".bg").show();
    });
    $(".close_btn").on("click",function(){
    	$(".popDiv").hide();
        $(".bg").hide();
    })
    $("#logoutbtn").on("click", function() {
        console.log("xuletian");
    	$.cookie('exchangeToken','');
    	console.log("haha");
    	console.log($.cookie('exchangeToken'));
        location.reload(true);
    });
});

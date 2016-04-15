require(['api_mkt','cookie'], function(api_mkt) {
    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);
    var exchangeToken = $.cookie('exchangeToken');
    if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else {  //已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        api_mkt.userbasic(function(data){
            if(data.data){
                if(data.data.list){
                    api_mkt.realAuth({
                    }, function(data) {
                        if (data.status == 200) {
                            if(data.data.list.name&&data.data.list.name!=""){
                                var num = data.data.list.idNumber;
                                var numId = num.replace(num.slice(1,17),'****************');
                                $(".verticle_line_id").html(numId);
                                $(".verticle_line").show();
                                $(".verticle_line_id").show();
                                $("#realname").html(data.data.list.name);
                                $(".jumpone").on("click",function(){
                                    location.href = "./modifyloginpassword.html";
                                });
                                $(".jumptwo").on("click",function(){
                                    location.href = "./modifypaymentcode.html";
                                });
                                $(".jumpthree").on("click",function(){
                                    location.href = "./resetpaymentcode.html";
                                });
                            } else {
                                
                                $(".unautherized").show();
                            }
                        } else if (data.status == 305) {
                        } else if(data.status == 400){
                            if(data.msg=="用户未实名认证"){
                                $(".verticle_line").hide();
                                $(".verticle_line_id").hide();
                                $("#realname").html("未认证").css("color","#ff6600");
                                //$(".lookup").hide();
                                $(".jumpone,.jumptwo,.jumpthree").on("click",function(){
                                    $(".popuptips").hide();
                                    $(".popuptips").slideDown();
                                });
                            }
                        } else {
                        }
                    });
                    $("#account_name").html(data.data.list.mobile.substr(0,3)+'****'+data.data.list.mobile.substr(7,4));
                    $("#account_uid").html(data.data.list.uid);
                }
            }
        });
    }



    

    $(".close_btn").on("click",function(){
        $(".popDiv").hide();
        $(".bg").hide();
    });

    $(".sure_btn").on("click",function(){
        $(".popDiv").hide();
        $(".bg").hide();
        alert("修改成功");
    });

    var flag = true;
    $('.messagenum_area').on("click",function(){
        if(flag){
            flag = false;
            $(this).css("background-color","#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color","#333333");
            $(".msg_num").css("color","#333333");
        } else {
            flag = true;
            $(this).css("background-color","#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color","#cccccc");
            $(".msg_num").css("color","#cccccc");
        }
    });

});
function showDiv() {
    $("#bg").show();
    //$("#popDiv").fadeIn(500);
    $("#popDiv_role").show();
}
function closeDiv() {
    $("#popDiv").hide();
    $("#bg").hide();
}
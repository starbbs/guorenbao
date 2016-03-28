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
            /**
             * address: "56ed0cd2b90b447e8859f6bf0d355c17"
                createDate: 1458650196000
                createip: "0.0.0.0"
                locked: 0
                mobile: "18701097891"
                name: ""
                pid: 0
                pw: "ac787c6585709d40c601d6c5cef3c27b"
                pwtrade: "ac787c6585709d40c601d6c5cef3c27b"
                role: "user"
                uid: 3
                updateDate: 1458650196000
                updateip: "0.0.0.0"
             */
            console.log(data.data.list.name);
            console.log(data.data.list.mobile);
            console.log(data.data.list.uid);
            $("#realname").html(data.data.list.name);
            $("#account_name").html(data.data.list.mobile);
            $("#account_uid").html(data.data.list.uid);
            
            console.log("api_mkt");
        });

    }
    $(".close_btn").on("click",function(){
        $("#popDiv").hide();
        $("#bg").hide();
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
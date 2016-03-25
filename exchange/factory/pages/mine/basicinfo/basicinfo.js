require(['api_mkt','cookie'], function(api_mkt) {

    $(".bg").width($(document).width());
    $('.bg').height($(document).height());

    console.log($(document).width());
    console.log($(document).height());

    $('.bg').css('left', 0);
    $('.bg').css('top', 0);

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
    function showDiv() {
        $("#bg").show();
        $("#popDiv").fadeIn(500);
    }

    function closeDiv() {
        $("#popDiv").hide();
        $("#bg").hide();
    }

	
	
});
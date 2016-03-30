require(['jquery','api_mkt_management','avalon'],function($,api_mkt_management,avalon){
    

    $('.container-section-inputThree').click(function(){
        api_mkt_management.login({
            'phone':$('.container-section-inputOne').val(),
            'password':$('.container-section-inputTwo').val()
        }, function(data) {
            if (data.status == 200) {
                console.log(data);
                window.location.href="home.html";
                $.cookie('key',data.data.username);
            } else {
                console.log(data);
            }
        });
    });    

    //验证登录 1 只能输入数字
    $(".container-section-inputOne").keyup(function(){
        $(this).val($(this).val().replace(/[^0-9$]/g,''));
    });
    $(".container-section-inputOne").blur(function(){
        if($(this).val().length < 11 && $(this).val().length > 0){
            var errText = $("<span class='icon-warning container-section-errOne'>手机号错误</span>");
            $(this).parent().append(errText);
            $(this).css("color","red");
        }
        if($(this).val().length == ""){
            var errText = $("<span class='icon-warning container-section-errOne'>手机号为空</span>");
            $(this).parent().append(errText);
            $(this).css("color","red");
        }   
    });
    //focus 时清空
    $(".container-section-inputOne").focus(function(){
        $(this).val("").css("color","");
        $(this).parent().children(".container-section-errOne").remove();
    });
    //end 
})




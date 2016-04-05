require(['jquery','api_mkt_management'], function($,api_mkt_management) {

    api_mkt_management.login({
        'phone':'',
        'password':''
    }, function(data) {
        if (data.status == 444) {
            window.location.href="login.html";
        } else {
            console.log(data);
        }
    });

    $('.div-2-name').text($.cookie('name'));
    $('.div-2-btn').click(function(){
        api_mkt_management.logout(function(data) {
            if (data.status == 200) {
                $.cookie('key','');
                window.location.href="login.html";
            } else {
                //console.log(data.msg);
            }
        });
    });
    api_mkt_management.login(function(data) {
        if (data.status == 444) {         
            window.location.href="login.html";
        } else {
        }
    });
      
    //左侧导航  
    $(".div2").click(function() {
        $(this).next("div").slideToggle();
        changeIcon($(this));
    });
    $(".div2-1").click(function() {
        $(this).next("div").slideToggle();

        changeIcon($(this));
    });

    function changeIcon(img) {
        if (img) {
            if (img.css("background-image").indexOf("collapsed.gif") >= 0) {
                img.css("background-image", "url('./images/expanded.gif')");
            } else {
                img.css("background-image", "url('./images/collapsed.gif')");
            }
        }
    }

    //点击增加 active类
    $(".div3").find("a").on("click", function() {        
        $(".div3").find("a").removeClass("active");
        $(this).addClass("active");
        //$(this).hover(function(){
        //  $(this).css("background","red");
        //});
    });

    //顶部三个小图标的点击
    /*$(".icon-warning").on('click', function(e) {
        $(".left-1").slideToggle();
        $(".middle-1").hide();
        $(".right-1").hide();
        e.stopPropagation(); //阻止事件冒泡
    });
    $(".icon-bitcoin").on('click', function(e) {
        $(".middle-1").slideToggle();
        $(".left-1").hide();
        $(".right-1").hide();
        e.stopPropagation();
    });
    $(".icon-cny").on('click', function(e) {
        $(".right-1").slideToggle();
        $(".left-1").hide();
        $(".middle-1").hide();
        e.stopPropagation();
    });*/

    //点击其他位置，收起
    /*$('body').bind('click', function(event) {
        // IE支持 event.srcElement ， FF支持 event.target    
        var evt = event.srcElement ? event.srcElement : event.target;
        if (evt.className == 'header-div-icon') return; //如果点击的类名匹配 返回
        else {
            $('.header-div-showHide').slideUp();
        }
    });*/

    //创建iframe
    $("<Iframe class='frameHtml' src='./controllPanel.html' height='550' scrolling='no' frameborder='0' name='main'></iframe>").insertAfter(".nav");

    //点击框架 收起
    $(window.frames["main"].document.body).click(function() {
        $('.header-div-showHide').slideUp();
    });

    //控制面板右侧 常用 的显示隐藏
    $(".aside-div-spanRight").hover(function() {
        $(".aside-div-spanRight-div").show();
    }, function() {
        var timer = setTimeout(function() {
            $(".aside-div-spanRight-div").hide();
        }, 500);
        $(".aside-div-spanRight-div").hover(function() {
            $(".aside-div-spanRight-div").show();
            clearInterval(timer);
        });
    });

    //操作框架
    $(".liCashIn").click(function() {
        $(".frameHtml").attr("src", "cashIn.html");
    });
    $(".liCashOut").click(function() {
        $(".frameHtml").attr("src", "cashOut.html");
    });
    $(".liguoRenDeal").click(function() {
        $(".frameHtml").attr("src", "guoRenDeal.html");
    });
    $(".liguoRenKaDan").click(function() {
        $(".frameHtml").attr("src", "guoRenKaDan.html");
    });
    $(".liguoRenInput").click(function() {
        $(".frameHtml").attr("src", "guoRenInput.html");
    });
    $(".liguoRenOutput").click(function() {
        $(".frameHtml").attr("src", "guoRenOutput.html");
    });
    $(".liguoRenGuaDan").click(function() {
        $(".frameHtml").attr("src", "guoRenGuaDan.html");
    });
    $(".liuser").click(function() {
        $(".frameHtml").attr("src", "user.html");
    });
    $(".liuser-info").click(function() {
        $(".frameHtml").attr("src", "user-info.html");
    });

    $(".ContrllPanel").click(function() {
        $(".frameHtml").attr("src", "controllPanel.html");
    });


});

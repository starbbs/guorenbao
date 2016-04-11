require(['api_mkt', 'cookie'], function(api_mkt) {
    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);

    $(".feature").removeClass("index_on");

    var exchangeToken = $.cookie('exchangeToken');

    if (!exchangeToken) {
        //$(".popDiv").show();
        //$(".bg").show();
    } else { //已经实名认证
        //$(".popDiv").hide();
        //$(".bg").hide();

        api_mkt.userbasic(function(data) {
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
    $(".close_btn").on("click", function() {
        $("#popDiv").hide();
        $("#bg").hide();
    });
    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#333333");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#cccccc");
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

/*tab*/
$(function() {
    $(".tabcon:gt(0)").hide();
    var liA = $(".tab");
    liA.click(function() {
        $(this).addClass("tab_on").siblings(".tab").removeClass("tab_on");
        $(".tabcon").eq(liA.index(this)).show().siblings(".tabcon").hide();
    });
});

$(function() {
    $(".two-right:gt(0)").hide();
    var liA = $(".li_tab");
    liA.click(function() {
        $(this).addClass("li_tab_active").siblings(".li_tab").removeClass("li_tab_active");
        $(".two-right").eq(liA.index(this)).show().siblings(".two-right").hide();
    });
});
$(function() {
    $(".two-right1:gt(0)").hide();
    var liA = $(".li_tab1");
    liA.click(function() {
        $(this).addClass("li_tab_active").siblings(".li_tab1").removeClass("li_tab_active");
        $(".two-right1").eq(liA.index(this)).show().siblings(".two-right1").hide();
    });
});

//接受跳转参数
$(function() {
    function getQueryString(name) {
        href = decodeURIComponent(location.href);
        // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
        if (href.indexOf("?") == -1 || href.indexOf(name + '=') == -1) {
            return '';
        }
        // 获取链接中参数部分
        var queryString = href.substring(href.indexOf("?") + 1);
        // 分离参数对 ?key=value&key2=value2
        var parameters = queryString.split("&");
        var pos, paraName, paraValue;
        for (var i = 0; i < parameters.length; i++) {
            // 获取等号位置
            pos = parameters[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            // 获取name 和 value
            paraName = parameters[i].substring(0, pos);
            paraValue = parameters[i].substring(pos + 1);
            // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
            if (paraName == name) {
                return unescape(paraValue.replace(/\+/g, " "));
            }
        }
        return '';
    };
    var fval = getQueryString("f");
    console.log(fval);
    if (fval=="a") {
        console.log("a");
        $(".tab").eq(0).addClass("tab_on").siblings(".tab").removeClass("tab_on");
        $('.tabcon').hide();
        $('.tab_one').show();
    } else if(fval=="b"){
        console.log("b");
        $(".tab").eq(1).addClass("tab_on").siblings(".tab").removeClass("tab_on");
        $('.tabcon').hide();
        $('.tab_two').show();
    } else if(fval=="c"){
        console.log("c");
        $(".tab").eq(2).addClass("tab_on").siblings(".tab").removeClass("tab_on");
        $('.tabcon').hide();
        $('.tab_three').show();
    } else if(fval=="d"){
        console.log("d");
        $(".tab").eq(3).addClass("tab_on").siblings(".tab").removeClass("tab_on");
        $('.tabcon').hide();
        $('.tab_four').show();
    }
});

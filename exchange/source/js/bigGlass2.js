$.fn.bigGlass2 = function(type) {
    var glassT = $(this).offset().top,
        glassL = $(this).offset().left; //定义预展示输入框的坐标
    var gId = $(this).attr("id");
    var glassStr = '<div id="bigGlass2"><nobr><span></span><span></span><span></span><span></span></nobr></div>';
    $(this).after($(glassStr));
    $(this).focus(function() {
        $("#bigGlass").hide();
        showbigGlass2();
    });
    $(this).keyup(function() {
        if((event.keyCode<48||event.keyCode>57)&&event.keyCode!=8&&(event.keyCode<96||event.keyCode>105)){
            return false;
        } else {
            showbigGlass2();
        }
    });
    //生成放大镜
    function showbigGlass2() {
        var inputVal;
        inputVal = $("#" + gId).val();
        inputVal = Trim(inputVal,"G");
        l = inputVal.length;
        if (!inputVal) {
            $("#bigGlass2").show();
            $("#bigGlass2").html("银行账号");
            return false;
        } else {
        }
        //身份证号码与电话号码展示逻辑不同，做区分
        $("#bigGlass2").html('<nobr><span></span><span></span><span></span><span></span><span></span></nobr>');
        if (type == 1) {
            if (l <= 4) {
                $("#bigGlass2").find("span").eq(0).text(inputVal);
            } else if (l <= 8) {
                $("#bigGlass2").find("span").eq(0).text(inputVal.substring(0, 4));
                $("#bigGlass2").find("span").eq(1).text(inputVal.substring(4, l));
            } else if (l <= 12) {
                $("#bigGlass2").find("span").eq(0).text(inputVal.substring(0, 4));
                $("#bigGlass2").find("span").eq(1).text(inputVal.substring(4, 8));
                $("#bigGlass2").find("span").eq(2).text(inputVal.substring(8, l));
            } else if (l <= 16) {
                $("#bigGlass2").find("span").eq(0).text(inputVal.substring(0, 4));
                $("#bigGlass2").find("span").eq(1).text(inputVal.substring(4, 8));
                $("#bigGlass2").find("span").eq(2).text(inputVal.substring(8, 12));
                $("#bigGlass2").find("span").eq(3).text(inputVal.substring(12, l));
            } else {
                $("#bigGlass2").find("span").eq(0).text(inputVal.substring(0, 4));
                $("#bigGlass2").find("span").eq(1).text(inputVal.substring(4, 8));
                $("#bigGlass2").find("span").eq(2).text(inputVal.substring(8, 12));
                $("#bigGlass2").find("span").eq(3).text(inputVal.substring(12, 16));
                $("#bigGlass2").find("span").eq(4).text(inputVal.substring(16, l));
            }
        } else if (type == 2) {
            if (l <= 12) {
                $("#bigGlass2").find("span").eq(0).text(inputVal);
            }
        }
        $("#bigGlass2").show();
    }
    //控制数字放大镜的显示与销毁
    $(document).click(function(event) {
        var obj = event.srcElement || event.target;
        if ($(obj).attr("id") != gId) {
            $("#bigGlass2").html("").hide();
        } else {
            showbigGlass2();
        }
    });
}
function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

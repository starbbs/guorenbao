require(['api_mkt', 'cookie'], function(api_mkt) {
    var exchangeToken = $.cookie('exchangeToken');
    var global_loginuserphone = $.cookie("global_loginuserphone");
    if (!exchangeToken) {
        $(".popDiv").show();
        $(".bg").show();
    } else { //已经实名认证
        $(".popDiv").hide();
        $(".bg").hide();
        // api_mkt.userbasic(function(data){
        //     $("#who_account").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));
        // });
        $("#who_account").html(global_loginuserphone.substr(0, 3) + '****' + global_loginuserphone.substr(7, 4));
    }

    $(".currentPwd").on("blur", function() {
        if ($(this).val() == "") {
            $("#one_span").show().html("原登录密码不能为空");
            return;
        } else {
            $("#one_span").hide().html("");
        }
    }).on("input", function() {
        if ($(this).val() !== "") {
            $("#one_span").hide().html("");
        } else {
            $("#one_span").show().html("原登录密码不能为空");
        }
    });
    $(".newPwd").on("blur", function() {
        if ($(this).val() == "") {
            $("#two_span").show().html("新登录密码不能为空");
            return;
        } else if ($(this).val().length > 20 || $(this).val().length < 8) {
            $("#two_span").show().html("请输入8~20位新登录密码");
            return;
        }
        if ($(this).val().length >= 8 && $(this).val().length <= 20) {
            var pattern = /^[0-9]{1,20}$/;
            if (!pattern.exec($(this).val())) {} else {
                $("#two_span").show().html("新登录密码不能为纯数字");
            }
            var thisval = $(this).val();
            var flagcharcode = true;
            for (var i = 0; i < thisval.length; i++) {
                if (thisval.charCodeAt(i) < 33 || thisval.charCodeAt(i) > 126) {
                    flagcharcode = false;
                    break;
                }
            }
            if (!flagcharcode) {
                $("#two_span").show().html("密码必须是8~20位非纯数字组成");
            }
        }
    }).on("input", function() {
        if ($(this).val() !== "") {
            $("#two_span").show().html("");
        } else {
            $("#two_span").show().html("新登录密码不能为空");
        }
    });
    $(".confirmNewPwd").on("blur", function() {
        if ($(this).val() == "") {
            $("#three_span").show().html("确认密码不能为空");
            return;
        } else if ($(this).val().length > 20 || $(this).val().length < 8) {
            $("#three_span").show().html("请输入8~20位确认密码");
            return;
        } else {
            $("#three_span").show().html("");
        }
        if ($(this).val().length >= 8 && $(this).val().length <= 20) {
            var pattern = /^[0-9]{1,20}$/;
            if (!pattern.exec($(this).val())) {} else {
                $("#three_span").show().html("确认密码不能为纯数字");
            }
            var thisval = $(this).val();
            var flagcharcode = true;
            for (var i = 0; i < thisval.length; i++) {
                if (thisval.charCodeAt(i) < 33 || thisval.charCodeAt(i) > 126) {
                    flagcharcode = false;
                    break;
                }
            }
            if (!flagcharcode) {
                $("#three_span").show().html("密码必须是8~20位非纯数字组成");
            }
        }
    }).on("input", function() {
        if ($(this).val() !== "") {
            $("#three_span").hide().html("");
        } else {
            $("#three_span").show().html("确认密码不能为空");
        }
    });

    var whether_sub = true;
    $(".next_step_btn").on("click", function() {
        whether_sub = true;
        $("#one_span,#two_span,#three_span").hide().html("");
        if ($("#currentPwd").val() == "") {
            $("#one_span").show().html("原登录密码不能为空");
            whether_sub = false;
            return;
        }
        if ($("#newPwd").val() == "") {
            $("#two_span").show().html("新登录密码不能为空");
            whether_sub = false;
            return;
        } else if ($("#newPwd").val().length > 20 || $("#newPwd").val().length < 8) {
            $("#two_span").show().html("请输入8~20位新登录密码");
            return;
        } else {
            $("#two_span").hide().html("");
        }
        if ($("#newPwd").val().length >= 8 && $("#newPwd").val().length <= 20) {
            var pattern = /^[0-9]{1,20}$/;
            if (!pattern.exec($("#newPwd").val())) {
                whether_sub = true;
            } else {
                whether_sub = false;
                $("#two_span").show().html("新登录密码不能为纯数字");
            }
            var thisval = $("#newPwd").val();
            var flagcharcode = true;
            for (var i = 0; i < thisval.length; i++) {
                if (thisval.charCodeAt(i) < 33 || thisval.charCodeAt(i) > 126) {
                    flagcharcode = false;
                    break;
                }
            }
            if (!flagcharcode) {
                whether_sub = false;
                $("#two_span").show().html("密码必须是8~20位非纯数字组成");
            } else {
                whether_sub = true;
            }
        }

        if ($("#confirmNewPwd").val().length >= 8 && $("#confirmNewPwd").val().length <= 20) {
            var pattern = /^[0-9]{1,20}$/;
            if (!pattern.exec($("#confirmNewPwd").val())) {
                whether_sub = true;
            } else {
                whether_sub = false;
                $("#three_span").show().html("新登录密码不能为纯数字");
            }
            var thisval = $("#confirmNewPwd").val();
            var flagcharcode = true;
            for (var i = 0; i < thisval.length; i++) {
                if (thisval.charCodeAt(i) < 33 || thisval.charCodeAt(i) > 126) {
                    flagcharcode = false;
                    break;
                }
            }
            if (!flagcharcode) {
                whether_sub = false;
                $("#three_span").show().html("密码必须是8~20位非纯数字组成");
            } else {
                whether_sub = true;
            }
        }
        if ($("#confirmNewPwd").val() == "") {
            $("#three_span").show().html("确认密码不能为空");
            whether_sub = false;
            return;
        } else if ($("#confirmNewPwd").val().length > 20 || $("#confirmNewPwd").val().length < 8) {
            $("#three_span").show().html("请输入8~20位确认密码");
            whether_sub = false;
            return;
        } else {
            $("#three_span").hide().html("");
            if ($("#newPwd").val() !== $("#confirmNewPwd").val()) {
                $("#three_span").show().html("两次密码不一致");
                whether_sub = false;
            }
        }
        if (whether_sub) {
            api_mkt.loginpassword({
                currentPwd: $("#currentPwd").val(),
                newPwd: $("#newPwd").val(),
                confirmNewPwd: $("#confirmNewPwd").val()
            }, function(data) {
                if (data.status == 200) {
                    $(".reset_login_password_step_1").hide();
                    $(".reset_login_password_step_2").show();
                    alert("修改登录密码成功");
                    setTimeout(function() {
                        location.href = "./basicinfo.html";
                    }, 1000);
                } else if (data.status == 305) {
                    alert(data.msg);
                } else if (data.status == 400) {
                    if (data.msg == "原密码错误") {
                        $("#one_span").show().html(data.msg);
                    } else if (data.msg == "密码长度错误") {
                        $("#three_span").show().html(data.msg);
                    }
                } else {
                    $("#three_span").show().html(data.msg);
                }
            });
        }
    });
});
